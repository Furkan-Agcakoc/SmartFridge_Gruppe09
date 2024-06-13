import React, { Component } from "react";
import {
  Box,
  Paper,
  Typography,
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
import AlertComponent from "../dialogs/AlertComponent";

class RecipeDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      ingredientData: {
        amount: "",
        unit: "",
        name: "",
      },
      recipeData: {
        title: props.isEditMode ? props.recipeTitle : "",
        duration: props.isEditMode ? props.recipeDuration : "",
        servings: props.isEditMode ? props.recipeServings : "",
        instructions: props.isEditMode ? props.recipeInstructions : "",
        groceryUnit: ["g", "kg", "ml", "l", "Stück"],
        ingredients: props.isEditMode && props.recipeIngredients ? props.recipeIngredients : [],
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.recipeTitle !== this.props.recipeTitle ||
      prevProps.recipeDuration !== this.props.recipeDuration ||
      prevProps.recipeServings !== this.props.recipeServings ||
      prevProps.recipeInstructions !== this.props.recipeInstructions ||
      prevProps.recipeIngredients !== this.props.recipeIngredients
    ) {
      this.setState({
        recipeData: {
          title: this.props.recipeTitle,
          duration: this.props.recipeDuration,
          servings: this.props.recipeServings,
          instructions: this.props.recipeInstructions,
          groceryUnit: ["g", "kg", "ml", "l", "Stück"],
          ingredients: Array.isArray(this.props.recipeIngredients) ? this.props.recipeIngredients : [],
        },
      });
    }
  }

  handleAddIngredient = () => {
    const { ingredientData, recipeData } = this.state;
    if (ingredientData.amount && ingredientData.unit && ingredientData.name) {
      this.setState({
        recipeData: {
          ...recipeData,
          ingredients: [...recipeData.ingredients, ingredientData],
        },
        ingredientData: { amount: "", unit: "", name: "" },
        showAlert: false,
      });
    } else {
      this.setState({ showAlert: true });
      console.log("Zutat nicht vollständig");
    }
  };

  handleRemoveIngredient = (index) => {
    const newIngredients = this.state.recipeData.ingredients.filter(
      (_, i) => i !== index
    );
    this.setState((prevState) => ({
      recipeData: {
        ...prevState.recipeData,
        ingredients: newIngredients,
      },
    }));
  };

  handleClick = (e) => {
    const { recipeData } = this.state;
    const form = e.target.closest("form");
    if (form.checkValidity() && recipeData.ingredients.length > 0) {
      console.log("Form submitted: ", recipeData);
      this.props.handleCreateRecipes(recipeData);
    } else {
      this.setState({ showAlert: true });
    }
    console.log("Hier sieht man recipeData", recipeData.ingredients);
  };

  render() {
    const { handlePopupRecipeClose, isEditMode } = this.props;
    const {
      showAlert,
      recipeData: {
        title,
        duration,
        servings,
        instructions,
        groceryUnit,
        ingredients,
      },
      ingredientData: { amount, unit, name },
    } = this.state;

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
            top: "10%",
            zIndex: 2,
            maxHeight: "80vh",
            overflowY: "auto",
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
              {isEditMode ? "Rezept bearbeiten" : "Neues Rezept hinzufügen"}
            </Typography>
            <AlertComponent showAlert={showAlert} alertType="recipe" />
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
                value={title}
                onChange={(e) =>
                  this.setState({
                    recipeData: {
                      ...this.state.recipeData,
                      title: e.target.value,
                    },
                  })
                }
                onInput={() => this.setState({ showAlert: false })}
                id="outlined-required"
                name="title"
                label="Rezepttitel"
                placeholder="Rezepttitel"
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
                  value={duration}
                  onChange={(e) =>
                    this.setState({
                      recipeData: {
                        ...this.state.recipeData,
                        duration: e.target.value,
                      },
                    })
                  }
                  onInput={() => this.setState({ showAlert: false })}
                  id="outlined-required"
                  name="duration"
                  label="Dauer (Minuten)"
                  placeholder="Dauer"
                  InputLabelProps={{ style: { fontSize: "15px" } }}
                  type="number"
                  inputProps={{ min: "1" }}
                  sx={{ width: "50%" }}
                />
                <TextField
                  required
                  value={servings}
                  onChange={(e) =>
                    this.setState({
                      recipeData: {
                        ...this.state.recipeData,
                        servings: e.target.value,
                      },
                    })
                  }
                  onInput={() => this.setState({ showAlert: false })}
                  id="outlined-required"
                  name="servings"
                  label="Portionen"
                  placeholder="Portionen"
                  InputLabelProps={{ style: { fontSize: "15px" } }}
                  type="number"
                  inputProps={{ min: "1" }}
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
                <TextField // Menge
                  label="Menge"
                  placeholder="Menge"
                  name="amount"
                  value={amount}
                  onInput={() => this.setState({ showAlert: false })}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    this.setState((prevState) => ({
                      ingredientData: {
                        ...prevState.ingredientData,
                        [name]: value,
                      },
                    }));
                  }}
                  type="number"
                  inputProps={{ min: "1" }}
                  sx={{ width: "150px" }}
                />
                <Autocomplete // Einheit
                  options={groceryUnit}
                  value={unit}
                  freeSolo
                  onChange={(event, value) => {
                    this.setState((prevState) => ({
                      ingredientData: {
                        ...prevState.ingredientData,
                        unit: value,
                      },
                    }));
                  }}
                  onInputChange={() => this.setState({ showAlert: false })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={unit}
                      onChange={(event) => {
                        const { name, value } = event.target;
                        this.setState((prevState) => ({
                          ingredientData: {
                            ...prevState.ingredientData,
                            [name]: value,
                          },
                        }));
                      }}
                      onInput={() => this.setState({ showAlert: false })}
                      name="unit"
                      label="Einheit"
                      placeholder="Einheit"
                      sx={{ width: "150px" }}
                    />
                  )}
                />
                <TextField // Zutat
                  label="Zutat"
                  placeholder="Zutat"
                  name="name"
                  value={name}
                  onChange={(event) => {
                    const { name, value } = event.target;
                    this.setState((prevState) => ({
                      ingredientData: {
                        ...prevState.ingredientData,
                        [name]: value,
                      },
                    }));
                  }}
                  onInput={() => this.setState({ showAlert: false })}
                  sx={{ flex: 1 }}
                />
                <IconButton disableRipple onClick={this.handleAddIngredient}>
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
                        onClick={() => this.handleRemoveIngredient(index)}
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
                value={instructions}
                onChange={(e) =>
                  this.setState({
                    recipeData: {
                      ...this.state.recipeData,
                      instructions: e.target.value,
                    },
                  })
                }
                onInput={() => this.setState({ showAlert: false })}
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
                  onClick={handlePopupRecipeClose}
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

export default RecipeDialog;
