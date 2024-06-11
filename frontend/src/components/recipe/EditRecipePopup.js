import React, { Component } from "react";
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
  // Avatar,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";

class EditRecipePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      currentIngredient: {
        amount: props.currentIngredient.amount,
        unit: props.currentIngredient.unit,
        name: props.currentIngredient.name,
      },
      recipeData: {
        title: props.recipeData.title,
        duration: props.recipeData.duration,
        servings: props.recipeData.servings,
        instructions: props.recipeData.instructions,
        ingredients: props.recipeData.ingredients,
      },
      groceryUnit: ["g", "kg", "ml", "l", "Stück"],
    };
  }

  handleInvalid = (e) => {
    e.preventDefault();
    this.setState({ showAlert: true });
  };

  handleInput = () => {
    this.setState({ showAlert: false });
  };

  handleRecipeChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      recipeData: {
        ...this.state.recipeData,
        [name]: value,
      },
    });
  };

  handleIngredientChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      currentIngredient: {
        ...prevState.currentIngredient,
        [name]: value,
      },
    }));
  };

  handleAutocompleteChange = (event, value) => {
    this.setState((prevState) => ({
      currentIngredient: {
        ...prevState.currentIngredient,
        unit: value,
      },
    }));
  };

  handleAddIngredient = () => {
    const { currentIngredient, recipeData } = this.state;
    console.log(recipeData, currentIngredient);
    if (
      currentIngredient.amount &&
      currentIngredient.unit &&
      currentIngredient.name
    ) {
      this.setState({
        recipeData: {
          ...recipeData,
          ingredients: [...recipeData.ingredients, currentIngredient],
        },
        currentIngredient: { amount: "", unit: "", name: "" },
        showAlert: false,
      });
    } else {
      this.setState({ showAlert: true });
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
    console.log(newIngredients);
  };

  // handleClick = (e) => {
  //   const form = e.target.closest("form");
  //   console.log(form.checkValidity());
  //   if (form.checkValidity() || this.state.recipeData.ingredients.length === 0) {
  //     this.setState({ showAlert: true });
  //   } else {
  //     this.setState({ showAlert: false });
  //     const { recipeData, currentIngredient } = this.state;
  //     this.props.handleCreateRecipes(recipeData, currentIngredient);
  //     this.props.handlePopupRecipeClose();
  //   }
  // };

  handleClick = (e) => {
    const {recipeData} = this.state;
    const form = e.target.closest("form");
    if (form.checkValidity() && recipeData.ingredients.length > 0) { 
      console.log("Form submitted: ", recipeData);
      this.props.handleCreateRecipes(recipeData);
      console.log("valid");
    } else {
      this.setState({ showAlert: true });
      console.log("invalid");
    }
  };

  render() {
    const { handlePopupRecipeClose } = this.props;
    const {
      showAlert,
      currentIngredient: { amount, unit, name },
      recipeData: { title, duration, servings, instructions, ingredients },
      groceryUnit,
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
          onInvalid={this.handleInvalid}
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
              Rezept bearbeiten <CreateRoundedIcon
                sx={{
                  color: "secondary.dark",
                  width: "30px",
                  height: "auto",
                }}
              />
            </Typography>
            
            {showAlert && (
              <Alert severity="error" sx={{ marginBottom: "20px" }}>
                Bitte füllen Sie alle Felder aus und fügen Sie mindestens eine
                Zutat hinzu!
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
                value={title}
                onChange={this.handleRecipeChange}
                onInput={this.handleInput}
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
                  onChange={this.handleRecipeChange}
                  onInput={this.handleInput}
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
                  onChange={this.handleRecipeChange}
                  onInput={this.handleInput}
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
                <TextField
                  label="Menge"
                  placeholder="Menge"
                  name="amount"
                  value={amount}
                  onChange={this.handleIngredientChange}
                  onInput={this.handleInput}
                  type="number"
                  inputProps={{ min: "1" }}
                  sx={{ width: "150px" }}
                />
                <Autocomplete
                  options={groceryUnit}
                  value={unit || ""}
                  onChange={this.handleAutocompleteChange}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      value={unit}
                      onChange={this.handleIngredientChange}
                      onInput={this.handleInput}
                      name="unit"
                      label="Einheit"
                      placeholder="Einheit"
                      sx={{ width: "150px" }}
                    />
                  )}
                />
                <TextField
                  label="Zutat"
                  placeholder="Zutat"
                  name="name"
                  value={name}
                  onChange={this.handleIngredientChange}
                  onInput={this.handleInput}
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
                onChange={this.handleRecipeChange}
                onInput={this.handleInput}
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
                  Speichern
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

export default EditRecipePopup;
