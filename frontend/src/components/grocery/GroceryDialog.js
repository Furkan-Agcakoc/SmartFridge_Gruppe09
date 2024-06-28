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
// import GroceryStatementBO from "../../api/GroceryStatementBO";
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
        groceryUnit: [],
      },
      groceryStatement: [],
      measurementStatement: {
        measureId: null,
      },
      combinedData: null, // New state property for combined object
      newGrocery: "",
      newMeasurement: "",
      showAlert: false,
      foodOptions: props.foodOptions || [],
      groceryUnit: [],
      fridgeId: this.props.fridgeId,
    };
  }

  componentDidMount() {
    this.getMeasure();
    this.getGrocery();
  }

  componentDidUpdate(prevProps) {
    console.log("CombinedData:", this.state.combinedData);
    console.log("GroceryDialog componentDidUpdate", this.state.quantity);
    console.log("GroceryDialog componentDidUpdate", this.state.groceryId);
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.groceryName !== this.props.groceryName ||
      prevProps.groceryQuantity !== this.props.groceryQuantity ||
      prevProps.groceryUnit !== this.props.groceryUnit ||
      prevProps.foodOptions !== this.props.foodOptions
    ) {
      this.setState({
        groceryData: {
          name: this.props.groceryName,
          quantity: this.props.groceryQuantity,
          unit: this.props.groceryUnit,
          groceryUnit: [],
        },
        foodOptions: this.props.foodOptions || [],
      });
    }
  }

  handleClick = async (e) => {
    const { groceryData, newGrocery, newMeasurement, foodOptions } = this.state;
    const form = e.target.closest("form");

    if (form.checkValidity()) {
      this.props.handleCreateGroceries(groceryData);

      if (!foodOptions.includes(newGrocery)) {
        try {
          await this.addMeasure(newMeasurement);
          await this.addGrocery(newGrocery);
          await this.getGroceryByName(); // Wait for the API call to complete
          await this.getMeasureByName(); // Wait for the API call to complete
          await this.handleAddGrocery();
          // await this.addGroceryStatement();
          console.log(
            "After getGroceryByName (newly added):",
            this.state.groceryStatement.groceryId
          );
        } catch (error) {
          console.error("Error adding grocery:", error);
        }
      } else {
        await this.getGroceryByName(); // Wait for the API call to complete
        await this.getMeasureByName(); // Wait for the API call to complete
        await this.handleAddGrocery();

        // await this.addGroceryStatement();

        console.log(
          "After getGroceryByName (already exists):",
          this.state.groceryStatement.groceryId
        );
      }
      this.useQuantityValue(this.state.groceryData.quantity);
    } else {
      this.setState({ showAlert: true });
    }

    // Update combinedData with the relevant information
    this.setState({
      combinedData: {
        groceryId: this.state.groceryStatement.groceryId,
        measureId: this.state.measurementStatement.measureId,
        unit: this.state.groceryData.unit,
      },
    });

    console.log("End of handleClick:", this.state.groceryStatement.groceryId);
  };

  getGroceryByName = async () => {
    const { newGrocery } = this.state;
    if (!newGrocery) return console.error("newGrocery is empty or undefined");

    try {
      const groceryBO = await SmartFridgeAPI.getAPI().getGroceryByName(
        newGrocery
      );
      console.log("API response:", groceryBO);
      const groceryId = groceryBO.id;
      console.log("Grocery ID:", groceryId);
      return groceryId;
    } catch (error) {
      console.error("Error fetching grocery by name:", error);
      throw error;
    }
  };

  getMeasureByName = async () => {
    const { newMeasurement } = this.state;
    if (!newMeasurement)
      return console.error("newMeasurement is empty or undefined");

    try {
      const measureBO = await SmartFridgeAPI.getAPI().getMeasureByName(
        newMeasurement
      );
      console.log("API response:", measureBO);
      const measureId = measureBO.id;
      console.log("Measure ID:", measureId);
      return measureId;
    } catch (error) {
      console.error("Error fetching measure by name:", error);
      throw error;
    }
  };

  addGroceryStatement = async (groceryId, measureId, quantity) => {
    // this.useQuantityValue(quantity);
    // const { quantity } = this.state;
    const newGroceryStatement = new GroceryStatementBO(
      groceryId,
      measureId,
      quantity
    );

    try {
      const groceryStatement =
        await SmartFridgeAPI.getAPI().addGroceryStatement(newGroceryStatement);
      this.setState({ groceryStatement });
    } catch (error) {
      console.error("Error adding grocery statement:", error);
    }
  };

  handleAddGrocery = async () => {
    try {
      const groceryId = await this.getGroceryByName();
      const measureId = await this.getMeasureByName();
      const quantity = this.useQuantityValue();
      await this.addGroceryStatement(groceryId, measureId, quantity);
    } catch (error) {
      console.error("Error in handleAddGrocery:", error);
    }
  };

  useQuantityValue = () => {
    const { quantity } = this.state;
    console.log("Current Quantity:", quantity);
    return quantity;
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
          groceryUnit: measures.map((measure) => measure.getUnit()),
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
          groceryUnit: [...prevState.groceryUnit, measure.getUnit()],
        }));
      });
  };

  render() {
    const { handlePopupGroceryClose, isEditMode } = this.props;
    const {
      showAlert,
      groceryData: { name, quantity, unit },
      foodOptions,
      groceryUnit: measureOptions,
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
            width: "1100px",
            height: "auto",
            position: "fixed",
            top: "35%",
            zIndex: 2,
          }}
        >
          <Paper
            action="Lebensmittel"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0 30px 50px 30px",
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
              }}
            >
              {isEditMode
                ? "Lebensmittel bearbeiten"
                : "Lebensmittel hinzufügen"}
            </Typography>
            <AlertComponent showAlert={showAlert} alertType="grocery" />
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
                        quantity: e.target.value,
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
                  sx={{ width: "775px" }}
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
                      onInput={() => this.setState({ showAlert: false })}
                      name="unit"
                      label="Mengeneinheit angeben"
                      placeholder="Mengeneinheit"
                      sx={{ width: "250px" }}
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
                  justifyContent: "center",
                  gap: "10px",
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
