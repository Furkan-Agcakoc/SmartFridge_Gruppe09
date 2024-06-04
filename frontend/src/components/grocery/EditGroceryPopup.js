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
import Alert from "@mui/material/Alert";

class EditGroceryPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentGrocery: this.props.currentGrocery,
      currentGroceryQuantity: this.props.currentGroceryQuantity,
      currentGroceryUnit: this.props.currentGroceryUnit,
      groceryUnit: this.props.groceryUnit,
    };
  }

  // handleChange = (event) => {
  //   const { name, value } = event.target;
  //   this.setState({
  //     [name]: value,
  //     showAlert: false,
  //   });
  //   this.props.handleChange(event); // Propagation der Änderung an die übergeordnete Komponente
  // };

  // Funktion zur Behandlung von Änderungen im Autocomplete-Feld
  handleAutoCompleteChange = (event, value) => {
    this.setState({
      currentGroceryUnit: value,
    });
    // Manuelle Propagation der Änderung
    this.props.handleChange({
      target: { name: "currentGroceryUnit", value: value },
    });
  };

  render() {
    const { handleCreateGroceries, handlePopupClose, showAlert, handleChange } =
      this.props;

    const {
      currentGrocery,
      currentGroceryQuantity,
      currentGroceryUnit,
      groceryUnit,
    } = this.state;

    // // Sicherstellen, dass groceryUnit ein Array ist
    // if (!Array.isArray(groceryUnit)) {
    //   console.error("groceryUnit is not an array:", groceryUnit);
    //   return null; // oder eine Fehlermeldung anzeigen
    // }

    const showAlertComponent = showAlert && (
      <Alert severity="error" sx={{ marginBottom: "20px" }}>
        Bitte geben Sie einen Haushaltsnamen ein!
      </Alert>
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
          sx={{
            width: "1100px",
            height: "auto",
            position: "fixed",
            top: "35%",
            zIndex: 2,
          }}
        >
          <Paper
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
              Lebensmittel bearbeiten
            </Typography>
            {showAlertComponent}
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
                id="outlined-required"
                label="Lebensmittelname angeben"
                value={currentGrocery}
                name="currentGrocery"
                placeholder="Lebensmittelname"
                InputLabelProps={{ style: { fontSize: "15px" } }}
                onChange={handleChange}
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
                  id="outlined-required"
                  value={currentGroceryQuantity}
                  name="currentGroceryQuantity"
                  label="Menge angeben"
                  placeholder="Menge"
                  InputLabelProps={{ style: { fontSize: "15px" } }}
                  sx={{ width: "775px" }}
                  onChange={handleChange}
                />
                <Autocomplete
                  id="measurements-box"
                  options={groceryUnit}
                  freeSolo
                  value={currentGroceryUnit}
                  onChange={this.handleAutoCompleteChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      value={currentGroceryUnit}
                      name="currentGroceryUnit"
                      onChange={handleChange}
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
                  variant="contained"
                  endIcon={<CheckCircleOutlineRoundedIcon />}
                  onClick={handleCreateGroceries}
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
                  onClick={handlePopupClose}
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

export default EditGroceryPopup;
