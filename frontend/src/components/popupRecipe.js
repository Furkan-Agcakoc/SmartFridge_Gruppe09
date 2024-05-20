import React from "react";
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

const PopupRecipe = ({
  showAlert,
  handleCloseAlert,
  measurements,
  handleChange,
  handleCreateRecipes,
  closePopup,
}) => (
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
    <Box
      sx={{
        width: "1100px",
        position: "fixed",
        top: "35%",
        zIndex: 2,
      }}
    >
      <Paper
        action="Rezepte"
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
          Neues Rezept hinzufügen
        </Typography>
        {showAlert && (
          <Alert
            severity="error"
            onClose={handleCloseAlert}
            sx={{ marginBottom: "20px" }}
          >
            Bitte einen Namen des Rezepts eingeben!
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
            id="outlined-required"
            label="Rezept"
            placeholder="Neues Rezept"
            InputLabelProps={{ style: { fontSize: "15px" } }}
            onChange={handleChange}
          />
          <Autocomplete
            options={measurements}
            multiple
            renderInput={(params) => (
              <TextField
                {...params}
                label="Zutaten hinzufügen"
                placeholder="Zutaten hinzufügen"
                InputLabelProps={{
                  style: { fontSize: "15px" },
                }}
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
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <Button
              variant="contained"
              endIcon={<CheckCircleOutlineRoundedIcon />}
              onClick={handleCreateRecipes}
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

export default PopupRecipe;
