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

const filter = createFilterOptions();

class GroceryDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      groceryData: {
        name: props.isEditMode ? props.groceryName : "",
        quantity: props.isEditMode ? props.groceryQuantity : "",
        unit: props.isEditMode ? props.groceryUnit : "",
        groceryUnit: ["g", "kg", "ml", "l", "Stück"],
      },
      showAlert: false,
      foodOptions: props.foodOptions || [], // Assuming foodOptions is passed as a prop
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.groceryName !== this.props.groceryName ||
      prevProps.groceryQuantity !== this.props.groceryQuantity ||
      prevProps.groceryUnit !== this.props.groceryUnit
    ) {
      this.setState({
        groceryData: {
          name: this.props.groceryName,
          quantity: this.props.groceryQuantity,
          unit: this.props.groceryUnit,
          groceryUnit: ["g", "kg", "ml", "l", "Stück"],
        },
      });
    }
  }

  handleClick = (e) => {
    const { groceryData } = this.state;
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      this.props.handleCreateGroceries(groceryData);
      console.log("Form is valid");
    } else {
      this.setState({ showAlert: true });
    }
  };

  render() {
    const { handlePopupGroceryClose, isEditMode } = this.props;
    const {
      showAlert,
      groceryData: { name, quantity, unit, groceryUnit },
      foodOptions,
    } = this.state;

    // Sort food options alphabetically
    const sortedFoodOptions = foodOptions.sort((a, b) => a.localeCompare(b));

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
                  if (typeof newValue === "string") {
                    this.setState({
                      groceryData: {
                        ...this.state.groceryData,
                        name: newValue,
                      },
                    });
                  } else if (newValue && newValue.inputValue) {
                    this.setState({
                      groceryData: {
                        ...this.state.groceryData,
                        name: newValue.inputValue,
                      },
                    });
                  } else {
                    this.setState({
                      groceryData: {
                        ...this.state.groceryData,
                        name: newValue.title,
                      },
                    });
                  }
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
                id="free-solo-with-text-demo"
                options={sortedFoodOptions.map((option) => ({ title: option }))}
                freeSolo
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
                  options={groceryUnit}
                  value={unit}
                  freeSolo
                  onChange={(event, value) =>
                    this.setState((prevState) => ({
                      groceryData: { ...prevState.groceryData, unit: value },
                    }))
                  }
                  onInputChange={() => this.setState({ showAlert: false })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      onInput={() => this.setState({ showAlert: false })}
                      onChange={(e) =>
                        this.setState({
                          groceryData: {
                            ...this.state.groceryData,
                            unit: e.target.value,
                          },
                        })
                      }
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
