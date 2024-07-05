import React, { Component } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import AlertComponent from "../dialogs/AlertComponent";
import { createFilterOptions } from "@mui/material/Autocomplete";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import GroceryBO from "../../api/GroceryBO";
import MeasureBO from "../../api/MeasureBO";
import FridgeContext from "../contexts/FridgeContext";
import GroceryStatementBO from "../../api/GroceryStatementBO";

const filter = createFilterOptions();

class GroceryDialog extends Component {
  static contextType = FridgeContext;

  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      groceryData: {
        name: props.isEditMode ? props.groceryName : "",
        quantity: props.isEditMode ? props.groceryQuantity : "",
        unit: props.isEditMode ? props.groceryUnit : "",
      },
      groceryStatement: {},
      measurementStatement: {
        measureId: null,
      },
      newGrocery: props.isEditMode ? props.groceryName : "",
      newMeasurement: props.isEditMode ? props.groceryUnit : "",
      showAlert: false,
      foodOptions: props.foodOptions || [],
      measureOptions: props.measureOptions || [],
      fridgeId: this.props.fridgeId,
      showDuplicateAlert: false,
      duplicateGroceryName: "",
    };
  }

  componentDidMount() {
    this.getMeasure();
    this.getGrocery();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.groceryName !== this.props.groceryName ||
      prevProps.groceryQuantity !== this.props.groceryQuantity ||
      prevProps.groceryUnit !== this.props.groceryUnit ||
      prevProps.foodOptions !== this.props.foodOptions ||
      prevProps.measureOptions !== this.props.measureOptions ||
      prevProps.curentGroceryId !== this.props.curentGroceryId
    ) {
      this.setState({
        groceryData: {
          name: this.props.groceryName,
          quantity: this.props.groceryQuantity,
          unit: this.props.groceryUnit,
        },
        newGrocery: this.props.groceryName,
        newMeasurement: this.props.groceryUnit,
        foodOptions: this.props.foodOptions || [],
        measureOptions: this.props.measureOptions || [],
      });
    }
  }

  handleClick = async (e) => {
    const {
      groceryData,
      newGrocery,
      newMeasurement,
      foodOptions,
      measureOptions,
    } = this.state;
    const form = e.target.closest("form");
  
    if (form.checkValidity()) {
      if (this.props.isEditMode) {
        await this.handleUpdateGrocery(groceryData);
      } else {
        const isDuplicated = this.props.groceryStatements.some(statement => statement.grocery_name === newGrocery)
        if (isDuplicated) {
          this.setState({
            showDuplicateAlert: true,
            duplicateGroceryName: newGrocery,
          });
          return;
        }
  
        this.props.handleCreateGroceries(groceryData);
  
        // Check and handle newGrocery
        if (!foodOptions.includes(newGrocery)) {
          try {
            await this.addGrocery(newGrocery);
            await this.getGroceryByName(newGrocery);
          } catch (error) {
            console.error("Error adding grocery:", error);
          }
        } else {
          await this.getGroceryByName(newGrocery);
        }
  
        // Check and handle newMeasurement
        if (!measureOptions.includes(newMeasurement)) {
          try {
            await this.addMeasure(newMeasurement);
          } catch (error) {
            console.error("Error adding measurement:", error);
          }
        } else {
          await this.getMeasureByName(newMeasurement);
        }
  
        await this.handleAddGrocery();
      }
  
      this.props.refreshGroceryList();
      this.props.handlePopupGroceryClose();
    } else {
      console.log("Form is not valid, showing alert.");
      this.setState({ showAlert: true });
    }
  };
  

  addGroceryStatement = async (groceryId, measureId) => {
    const { groceryData, fridgeId } = this.state;
    const newGroceryStatement = new GroceryStatementBO(
      groceryId,
      measureId,
      groceryData.quantity
    );

    try {
      const groceryStatement =
        await SmartFridgeAPI.getAPI().addGroceryStatement(newGroceryStatement);
      this.setState({ groceryStatement: groceryStatement });
      const groceryStatementId = groceryStatement.id;
      console.log("groceryStatementId:", groceryStatementId);
      const groceryStatementAddedInFridge =
        await SmartFridgeAPI.getAPI().addGroceryinFridge(
          groceryStatementId,
          fridgeId
        );
      console.log(
        "groceryStatementAddedInFridge:",
        groceryStatementAddedInFridge
      );
    } catch (error) {
      console.error("Error adding grocery statement:", error);
    }
  };

  getGroceryByName = async (name) => {
    try {
      const groceryBO = await SmartFridgeAPI.getAPI().getGroceryByName(name);
      if (!groceryBO || !groceryBO.id) {
        throw new Error(`No grocery found with name: ${name}`);
      }
      console.log("API response:", groceryBO);
      const groceryId = groceryBO.id;
      console.log("Grocery ID:", groceryId);
      return groceryId;
    } catch (error) {
      console.error("Error fetching grocery by name:", error);
      throw error;
    }
  };

  getMeasureByName = async (unit) => {
    try {
      const measureBO = await SmartFridgeAPI.getAPI().getMeasureByName(unit);
      if (!measureBO || !measureBO.id) {
        throw new Error(`No measure found with unit: ${unit}`);
      }
      console.log("API response:", measureBO);
      const measureId = measureBO.id;
      console.log("Measure ID:", measureId);
      return measureId;
    } catch (error) {
      console.error("Error fetching measure by name:", error);
      throw error;
    }
  };

  handleAddGrocery = async () => {
    try {
      const groceryId = await this.getGroceryByName(this.state.newGrocery);
      const measureId = await this.getMeasureByName(this.state.newMeasurement);
      await this.addGroceryStatement(groceryId, measureId);
    } catch (error) {
      console.error("Error in handleAddGrocery:", error);
    }
  };

  handleUpdateGrocery = async (groceryData) => {
    try {
      const groceryId = await this.getGroceryByName(groceryData.name);
      const measureId = await this.getMeasureByName(groceryData.unit);

      const updatedGroceryStatement = new GroceryStatementBO(
        groceryId,
        measureId,
        groceryData.quantity
      );

      updatedGroceryStatement.setID(this.props.curentGroceryId);
      await SmartFridgeAPI.getAPI().updateGroceryStatement(
        updatedGroceryStatement
      );

      console.log("Updated grocery statement:", updatedGroceryStatement);
    } catch (error) {
      console.error("Error in handleUpdateGrocery:", error);
    }
  };

  getGrocery = () => {
    const { fridgeId } = this.state;
    SmartFridgeAPI.getAPI()
      .getGroceryByFridgeId(fridgeId)
      .then((groceries) => {
        this.setState({
          foodOptions: groceries.map((grocery) => grocery.getGroceryName()),
        });
      });
  };

  addGrocery = (newGroceryName) => {
    const { fridgeId } = this.state;
    const newGrocery = new GroceryBO(newGroceryName, fridgeId);

    SmartFridgeAPI.getAPI()
      .addGrocery(newGrocery)
      .then((grocery) => {
        this.setState((prevState) => ({
          foodOptions: [...prevState.foodOptions, grocery.getGroceryName()],
        }));
      });
  };

  getMeasure = () => {
    const { fridgeId } = this.state;
    SmartFridgeAPI.getAPI()
      .getMeasureByFridgeId(fridgeId)
      .then((measures) => {
        this.setState({
          measureOptions: measures.map((measure) => measure.getUnit()),
        });
      });
  };

  addMeasure = (newMeasurement) => {
    const { fridgeId } = this.state;
    const newMeasure = new MeasureBO(newMeasurement);
    newMeasure.setFridgeId(fridgeId);

    SmartFridgeAPI.getAPI()
      .addMeasure(newMeasure)
      .then((measure) => {
        this.setState((prevState) => ({
          measureOptions: [...prevState.measureOptions, measure.getUnit()],
        }));
      });
  };

  handleUnitInput = (event) => {
    this.setState({ showAlert: false });
    const value = event.target.value;
    event.target.value = value.replace(/[^a-zA-ZäöüÄÖÜß]/g, ""); // Regex to allow only letters including German umlauts
  };

  render() {
    const { handlePopupGroceryClose, isEditMode } = this.props;
    const {
      showAlert,
      showDuplicateAlert,
      duplicateGroceryName,
      groceryData: { name, quantity, unit },
      foodOptions,
      measureOptions,
    } = this.state;

    const sortedFoodOptions = foodOptions.sort((a, b) => a.localeCompare(b));
    const sortedMeasureOptions = measureOptions.sort((a, b) =>
      a.localeCompare(b)
    );
    return (
      <>
        <Box
          className="popup-background"
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <Box
          component="form"
          noValidate
          sx={{
            width: { xs: "90%", sm: "1100px" },
            height: "auto",
            position: "fixed",
            top: { xs: "20%", sm: "35%" },
            zIndex: 2,
          }}
        >
          <Paper
            action="Lebensmittel"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: { xs: "20px", sm: "0 30px 50px 30px" },
              borderRadius: "40px",
              fontSize: "17px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                marginBottom: "20px",
                marginTop: "20px",
                fontWeight: 600,
                color: "text.primary",
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              {isEditMode
                ? "Lebensmittel bearbeiten"
                : "Lebensmittel hinzufügen"}
            </Typography>
            <AlertComponent showAlert={showAlert} alertType="grocery" />
            <AlertComponent
              showAlert={showDuplicateAlert}
              alertType="duplicateGrocery"
              customMessage={`Du hast ${duplicateGroceryName} im Kühlschrank`}
              onClose={() => this.setState({ showDuplicateAlert: false })}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "10px",
              }}
            >
              <Autocomplete
                value={name}
                disabled={isEditMode}
                onChange={(event, newValue) => {
                  let updatedValue = "";
                  if (newValue === null) {
                    updatedValue = "";
                  } else if (typeof newValue === "string") {
                    updatedValue = newValue;
                  } else if (newValue && newValue.groceryInputValue) {
                    updatedValue = newValue.groceryInputValue;
                  } else {
                    updatedValue = newValue.title;
                  }
                  this.setState({
                    groceryData: {
                      ...this.state.groceryData,
                      name: updatedValue,
                    },
                    newGrocery: updatedValue,
                  });
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  const isExisting = options.some(
                    (option) => inputValue === option.title
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      groceryInputValue: inputValue,
                      title: `"${inputValue}" neu hinzufügen`,
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={sortedFoodOptions.map((option) => ({
                  title: option,
                }))}
                freeSolo
                getOptionLabel={(option) => {
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option.groceryInputValue) {
                    return option.groceryInputValue;
                  }
                  return option.title;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.title}</li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    onInput={() => this.setState({ showAlert: false })}
                    id="outlined-required"
                    name="groceryName"
                    label="Lebensmittelname angeben"
                    placeholder="Lebensmittelname"
                    InputLabelProps={{ style: { fontSize: "15px" } }}
                  />
                )}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <TextField
                  required
                  value={quantity}
                  onChange={(e) =>
                    this.setState({
                      groceryData: {
                        ...this.state.groceryData,
                        quantity: parseFloat(e.target.value)
                      },
                    })
                  }
                  onInput={() => this.setState({ showAlert: false })}
                  id="outlined-required"
                  name="quantity"
                  label="Menge angeben"
                  placeholder="Menge"
                  type="number"
                  InputLabelProps={{ style: { fontSize: "15px" } }}
                  sx={{ width: { xs: "100%", sm: "775px" } }}
                />
                <Autocomplete
                  id="measurements-box"
                  options={sortedMeasureOptions.map((option) => ({
                    title: option,
                  }))}
                  value={unit}
                  freeSolo
                  onChange={(event, newValue) => {
                    let updatedUnit = "";
                    if (newValue === null) {
                      updatedUnit = "";
                    } else if (typeof newValue === "string") {
                      updatedUnit = newValue;
                    } else if (newValue && newValue.inputValue) {
                      updatedUnit = newValue.inputValue;
                    } else {
                      updatedUnit = newValue.title;
                    }
                    this.setState({
                      groceryData: {
                        ...this.state.groceryData,
                        unit: updatedUnit,
                      },
                      newMeasurement: updatedUnit,
                    });
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    const isExisting = options.some(
                      (option) => inputValue === option.title
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        title: `"${inputValue}" neu hinzufügen`,
                      });
                    }
                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.title;
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>{option.title}</li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      onInput={this.handleUnitInput}
                      name="unit"
                      label="Mengeneinheit angeben"
                      placeholder="Mengeneinheit"
                      sx={{ width: { xs: "100%", sm: "250px" } }}
                      InputLabelProps={{
                        style: { fontSize: "15px" },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                top: "25px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  gap: "10px",
                  paddingBottom: { xs: "30px" },
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  endIcon={<CheckCircleOutlineRoundedIcon />}
                  onClick={this.handleClick}
                  sx={{
                    color: "success.dark",
                    bgcolor: "rgba(29, 151, 35, 0.2)",
                    border: "2px solid #06871d",
                    "&:hover": {
                      bgcolor: "success.dark",
                      color: "background.default",
                    },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  {isEditMode ? "Speichern" : "Hinzufügen"}
                </Button>
                <Button
                  variant="contained"
                  endIcon={<HighlightOffRoundedIcon />}
                  onClick={handlePopupGroceryClose}
                  sx={{
                    bgcolor: "rgba(197, 0, 0, 0.1)",
                    color: "error.main",
                    border: "2px solid #c50000 ",
                    "&:hover": {
                      bgcolor: "error.main",
                      color: "background.default",
                    },
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  Abbrechen
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </>
    );
  }
}

export default GroceryDialog;
