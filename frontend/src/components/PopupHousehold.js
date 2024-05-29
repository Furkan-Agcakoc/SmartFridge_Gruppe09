import React from "react";
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

const PopupHousehold = ({
  handleChange,
  handleCreateHousehold,
  closePopup,
  showAlert,
  emails,
}) => {
  const showAlertComponent = showAlert && (
    <Alert severity="error" sx={{ marginBottom: "20px" }}>
      Bitte geben Sie einen Haushaltsnamen ein!
    </Alert>
  );

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1,
        }}
      />
      <Box sx={{ width: "1100px", position: "fixed", zIndex: 2 }}>
        <Paper
          action="Haushalt"
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0 30px 50px 30px",
            borderRadius: "50px",
            fontSize: "18px",
          }}
        >
          <Typography
            variant="h4"
            sx={{ marginBottom: "20px", marginTop: "20px", fontWeight: 600 }}
          >
            Neuen Haushalt hinzufügen
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
              label="Haushaltsname"
              placeholder="Haushaltsname"
              InputLabelProps={{ style: { fontSize: "15px" } }}
              onChange={handleChange}
            />
            <Autocomplete
              options={emails}
              multiple
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Bewohner hinzufügen"
                  placeholder="Bewohner hinzufügen"
                  InputLabelProps={{ style: { fontSize: "15px" } }}
                />
              )}
            />
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
              sx={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <Button
                variant="contained"
                endIcon={<CheckCircleOutlineRoundedIcon />}
                onClick={handleCreateHousehold}
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

export default PopupHousehold;
