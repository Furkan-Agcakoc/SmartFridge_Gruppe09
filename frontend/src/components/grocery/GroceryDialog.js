import React, { Component, useContext } from "react";
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
import GroceryStatementBO from "../../api/GroceryStatementBO";
import FridgeContext from "../contexts/FridgeContext";

const filter = createFilterOptions();

class GroceryDialog extends Component {

  static contextType = FridgeContext;

  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      groceryData: {
        name: props.isEditMode ? props.groceryName  : "",
        quantity: props.isEditMode ? props.groceryQuantity : "",
        unit: props.isEditMode ? props.groceryUnit : "",
        groceryUnit: [],
      },
      newGrocery: "",
      newMeasurement: "",
      showAlert: false,
      foodOptions: props.foodOptions || [],
      groceryUnit: [], // State für Mengeneinheiten hinzugefügt
    };
  }

  componentDidMount() {
    this.getMeasure(); // Initialer Abruf der Mengeneinheiten beim Laden des Dialogs
  }

  componentDidUpdate(prevProps) {
    console.log('previous props ===>', prevProps)
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

  handleClick = (e) => {
    const { groceryData, newGrocery, newMeasurement, foodOptions } = this.state;
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      this.props.handleCreateGroceries(groceryData);

      // // Check if newGrocery is already in foodOptions before adding it
      // if (!foodOptions.includes(newGrocery)) {
        this.addGrocery(newGrocery);
      // }

      this.addMeasure(newMeasurement);
      this.addGroceryStatement(groceryData);
    } else {
      this.setState({ showAlert: true });
    }
  };

  getGrocery = () => {
    SmartFridgeAPI.getAPI()
      .getGrocery()
      .then((groceries) => {
        this.setState({
          foodOptions: groceries.map((grocery) => grocery.getGroceryName()),
        });
      });
  };

  getFridge = () => {
    SmartFridgeAPI.getAPI()
      .getFridge()
      .then((fridges) => {
        this.setState({
          fridgeOptions: fridges.map((fridge) => fridge.getFridgeName()),
        });
      });
  };

  addGrocery = (groceryName) => {
    const { fridgeId } = this.context;
    const groceryBO = new GroceryBO(groceryName, fridgeId);
    SmartFridgeAPI.getAPI()
      .addGrocery(groceryBO)
      .then((responseGroceryBO) => {
        this.setState({
          foodOptions: [
            ...this.state.foodOptions,
            responseGroceryBO.getGroceryName(),
          ],
        });
      });
  };

  getMeasure = () => {
    SmartFridgeAPI.getAPI()
      .getMeasure()
      .then((measures) => {
        const groceryUnit = measures.map((measure) => ({
          unit: measure.getUnit(),
          id: measure.getUnitId()
        }));
        
        this.setState({
          groceryUnit
        });
  
        console.log('groceryUnit:', groceryUnit);
      });
  };

  addMeasure = (measureName) => {
    const { fridgeId } = this.context;
    const measureBO = new MeasureBO(measureName, fridgeId);
    SmartFridgeAPI.getAPI()
      .addMeasure(measureBO)
      .then((measure) => {
        this.setState({
          groceryUnit: [...this.state.groceryUnit, measure.getUnit()],
        });
      });
  };



  addGroceryStatement = (groceryData) => {
    const testThis =  {
      "grocery_id": 2,
      "unit_id": 5,
      "quantity": 20
    }
    // müssen ids noch hinzufügen 
    //const groceryStatementBO = new GroceryStatementBO(groceryData.name, groceryData.unit, groceryData.quantity);
    const groceryStatementBO = new GroceryStatementBO(testThis.grocery_id, groceryData.unit_id, groceryData.quantity);
    console.log('groceryStatementBO ===>', groceryStatementBO)
    SmartFridgeAPI.getAPI()
      .addGroceryStatement(groceryStatementBO)
      .then((responseGroceryStatementBO) => {
        console.log("Grocery Statement added successfully", responseGroceryStatementBO);
      })
      .catch((error) => {
        console.error("Error adding grocery statement", error);
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

    // Sort food options alphabetically
    const sortedFoodOptions = foodOptions.sort((a, b) => a.localeCompare(b));

    const sortedMeasureOptions = measureOptions.sort((a, b) =>
      a.unit.localeCompare(b.unit)
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
                    newGrocery: updatedValue, // Update inputValue state
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
                    onClick={this.getGrocery} // Hier wird die Methode aufgerufen
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
                    title: option.unit,
                    id: option.id
                  }))} // Hier sind die Mengeneinheiten
                  value={unit}
                  freeSolo
                  onChange={(event, newValue) => {
                    let updatedUnit = "";
                    let updatedUnitId = null;
                    if (newValue === null) {
                      updatedUnit = "";
                      updatedUnitId = null;
                    } else if (typeof newValue === "string") {
                      updatedUnit = newValue;
                      const foundUnit = sortedMeasureOptions.find(opt => opt.unit === newValue);
                      updatedUnitId = foundUnit ? foundUnit.id : null;
                    } else if (newValue && newValue.inputValue) {
                      updatedUnit = newValue.inputValue;
                      const foundUnit = sortedMeasureOptions.find(opt => opt.unit === newValue.inputValue);
                      updatedUnitId = foundUnit ? foundUnit.id : null;                      
                    } else {
                      updatedUnit = newValue.title;
                      updatedUnitId = newValue.id;
                    }
                    console.log('MEASUREMENTS NEW VALUE ===>', newValue)
                    this.setState({
                      groceryData: {
                        ...this.state.groceryData,
                        unit: updatedUnit,
                        unit_id: updatedUnitId 
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
