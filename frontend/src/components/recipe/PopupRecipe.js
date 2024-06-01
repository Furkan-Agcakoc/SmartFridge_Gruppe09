import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  TextField,
  Autocomplete,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

const PopupRecipe = ({
  showAlert,
  handleCloseAlert,
  measurements,
  handleChange,
  handleCreateRecipes,
  closePopup,
}) => {
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState({
    amount: "",
    unit: "",
    name: "",
  });
  const [recipeData, setRecipeData] = useState({
    title: "",
    duration: "",
    servings: "",
    instructions: "",
  });

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

  const handleAddIngredient = () => {
    if (
      currentIngredient.amount &&
      currentIngredient.unit &&
      currentIngredient.name
    ) {
      setIngredients([...ingredients, currentIngredient]);
      setCurrentIngredient({ amount: "", unit: "", name: "" });
    }
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentIngredient({ ...currentIngredient, [name]: value });
  };

  const handleRecipeChange = (event) => {
    const { name, value } = event.target;
    setRecipeData({ ...recipeData, [name]: value });
  };

  const handleSubmit = () => {
    if (
      recipeData.title.trim() === "" ||
      ingredients.length === 0 ||
      recipeData.instructions.trim() === ""
    ) {
      handleCloseAlert(true);
    } else {
      handleCreateRecipes(recipeData.title);
    }
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
          maxHeight: "80vh",
          overflowY: "auto",
          position: "fixed",
          top: "10%",
          zIndex: 2,
          "&::-webkit-scrollbar": {
            width: "7px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "transparent",
            borderRadius: "25px",
          },
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
              Bitte geben Sie einen Rezepttitel, mindestens eine Zutat und eine
              Anleitung ein!
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
              name="title"
              onChange={handleRecipeChange}
            />
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                width: "100%",
              }}
            >
              <TextField
                id="outlined-required"
                label="Dauer (Minuten)"
                placeholder="Dauer in Minuten"
                InputLabelProps={{ style: { fontSize: "15px" } }}
                type="number"
                inputProps={{ min: "1" }}
                name="duration"
                onChange={handleRecipeChange}
                sx={{ width: "50%" }}
              />
              <TextField
                id="outlined-required"
                label="Portionen"
                placeholder="Portionenanzahl"
                InputLabelProps={{ style: { fontSize: "15px" } }}
                type="number"
                inputProps={{ min: "1" }}
                name="servings"
                onChange={handleRecipeChange}
                sx={{ width: "50%" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <TextField
                required
                label="Menge"
                placeholder="Menge"
                name="amount"
                value={currentIngredient.amount}
                onChange={handleInputChange}
                type="number"
                inputProps={{ min: "1" }}
                sx={{ width: "150px" }}
              />
              <Autocomplete
                options={measurements}
                getOptionLabel={(option) => option}
                value={currentIngredient.unit}
                onChange={(event, newValue) => {
                  setCurrentIngredient({
                    ...currentIngredient,
                    unit: newValue,
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Einheit"
                    placeholder="Einheit"
                  />
                )}
                sx={{ width: "150px" }}
              />
              <TextField
                required
                label="Zutat"
                placeholder="Zutat"
                name="name"
                value={currentIngredient.name}
                onChange={handleInputChange}
                sx={{ flex: 1 }}
              />

              <IconButton onClick={handleAddIngredient} disableRipple>
                <AddCircleOutlineRoundedIcon
                  sx={{
                    width: "40px",
                    height: "auto",
                    color: "success.dark",
                    borderRadius: "50%",
                    position: "relative",
                    top: "0px",
                    left: "3px",
                    "&:hover": {
                      bgcolor: "success.dark",
                      color: "background.default",
                    },
                  }}
                />
              </IconButton>
            </Box>
            <Typography
              sx={{
                bgcolor: "transparent",
                top: 0,
                fontSize: "15pt",
                fontWeight: 600,
                position: "relative",
                left: "8px",
                color: "text.primary",
              }}
            >
              Zutatenliste:
            </Typography>
            <List
              sx={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
                height: "auto",
                maxHeight: "200px",
                bgcolor: "transparent",
                position: "relative",
                overflow: "auto",
                "& ul": { padding: 0 },
                marginTop: "-10px",
                "&::-webkit-scrollbar": {
                  width: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  borderRadius: "25px",
                },
              }}
            >
              {ingredients.map((ingredient, index) => (
                <ListItem
                  key={index}
                  sx={{ marginBottom: "-18px", marginTop: "-15px" }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveIngredient(index)}
                      disableRipple
                    >
                      <RemoveCircleOutlineRoundedIcon
                        sx={{
                          height: "25px",
                          width: "auto",
                          color: "error.main",
                          borderRadius: "15px",
                          "&:hover": {
                            bgcolor: "error.main",
                            color: "background.default",
                          },
                        }}
                      />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`⪧ ${ingredient.amount}${ingredient.unit} → ${ingredient.name}`}
                    sx={{
                      color: "text.primary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <TextField
              required
              id="outlined-required"
              label="Anleitung"
              placeholder="Anleitung"
              InputLabelProps={{ style: { fontSize: "15px" } }}
              multiline
              rows={2}
              name="instructions"
              onChange={handleRecipeChange}
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
                onClick={handleSubmit}
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

export default PopupRecipe;
