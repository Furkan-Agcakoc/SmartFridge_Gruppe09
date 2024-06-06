import React, { Component } from "react";
import {
  Box,
  Paper,
  Alert,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

class AddGroceryPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGrocery: {
        name: "",
        quantity: "",
        unit: "",
      },
      groceryUnit: ["g", "kg", "ml", "l", "Stück"],
      showAlert: false,
    };
  }

  handleInvalid = (e) => {
    e.preventDefault();
    this.setState({ showAlert: true });
  };

  handleInput = () => {
    this.setState({ showAlert: false });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      currentGrocery: {
        ...prevState.currentGrocery,
        [name]: value,
      },
    }));
  };

  handleAutocompleteChange = (event, value) => {
    this.setState((prevState) => ({
      currentGrocery: {
        ...prevState.currentGrocery,
        unit: value,
      },
    }));
  };

  handleClick = (e) => {
    const form = e.target.closest("form");
    if (form.checkValidity() === false) {
      this.setState({ showAlert: true });
    } else {
      this.setState({ showAlert: false });
      const { currentGrocery, groceryUnit } = this.state;
      this.props.handleCreateGroceries(currentGrocery, groceryUnit); // Pass the current state values
      this.props.handlePopupGroceryClose(); // Close the popup
    }
  };

  render() {
    const { handlePopupGroceryClose } = this.props;

    const {
      currentGrocery: { name, quantity, unit },
      groceryUnit,
      showAlert,
    } = this.state; // Nutzung des State

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
          onInvalid={this.handleInvalid}
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
              Neues Lebensmittel hinzufügen
            </Typography>
            {showAlert && (
              <Alert severity="error" sx={{ marginBottom: "20px" }}>
                Bitte füllen Sie alle Felder aus!
              </Alert>
            )}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "10px",
              }}
            >
              <TextField
                required
                value={name}
                onChange={this.handleChange}
                onInput={this.handleInput}
                id="outlined-required"
                name="name"
                label="Lebensmittelname angeben"
                placeholder="Lebensmittelname"
                InputLabelProps={{ style: { fontSize: "15px" } }}
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
                  onChange={this.handleChange}
                  onInput={this.handleInput}
                  id="outlined-required"
                  name="quantity"
                  label="Menge angeben"
                  placeholder="Menge"
                  InputLabelProps={{ style: { fontSize: "15px" } }}
                  sx={{ width: "775px" }}
                />
                <Autocomplete
                  id="measurements-box"
                  options={groceryUnit}
                  freeSolo
                  onChange={this.handleAutocompleteChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      value={unit}
                      onChange={this.handleChange}
                      onInput={this.handleInput}
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
                  Hinzufügen
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

export default AddGroceryPopup;
