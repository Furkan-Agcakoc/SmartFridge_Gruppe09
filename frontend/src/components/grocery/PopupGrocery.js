import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";

const PopupGrocery = ({
  showAlert,
  handleCloseAlert,
  groceryUnit,
  handleCreateGroceries,
  handleChange,
  closePopup,
  showAlertComponent,
  currentNameGrocery,
  currentNameGrQuantity,
  currentNameGrUnit,
}) => {
  const [customGroceryUnit, setCustomGroceryUnit] = useState("");

  // const handleCustomGroceryUnitChange = (event, newValue) => {
  //   setCustomGroceryUnit(newValue);
  // };

  // const handleSubmit = () => {
  //   handleCreateGroceries();
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains("popup-background")) {
        closePopup();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePopup]);

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showAlert: false,
    });
  };

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
              value={currentNameGrocery}
              name="Lebensmittel"
              placeholder="Lebensmittelname"
              InputLabelProps={{ style: { fontSize: "15px" } }}
              onChange={this.handleChange}
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
                value={currentNameGrQuantity}
                name="Menge"
                label="Menge angeben"
                placeholder="Menge"
                InputLabelProps={{ style: { fontSize: "15px" } }}
                sx={{ width: "775px" }}
                onChange={this.handleChange}
              />
              <Autocomplete
                id="measurements-box"
                options={groceryUnit}
                freeSolo
                // onInputChange={handleCustomGroceryUnitChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    value={currentNameGrUnit}
                    onChange={this.handleChange}
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
                onClick={closePopup}
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
};

export default PopupGrocery;
