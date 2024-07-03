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
import { createFilterOptions } from "@mui/material/Autocomplete";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import AlertComponent from "../dialogs/AlertComponent";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import GroceryStatementBO from "../../api/GroceryStatementBO";
import MeasureBO from "../../api/MeasureBO";
import GroceryBO from "../../api/GroceryBO";
import FridgeContext from "../contexts/FridgeContext";

const filter = createFilterOptions();

class RecipeDialog extends Component {
  static contextType = FridgeContext;

  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      fridgeId: this.props.fridgeId,
      recipeId: this.props.recipeId,
      ingredientData: {
        amount: "",
        unit_name: "",
        grocery_name: "",
      },
      recipeData: {
        recipe_name: props.isEditMode ? props.recipeTitle : "",
        duration: props.isEditMode ? props.recipeDuration : "",
        portion: props.isEditMode ? props.recipeServings : "",
        instruction: props.isEditMode ? props.recipeInstructions : "",
        ingredients:
          props.isEditMode && props.recipeIngredients
            ? props.recipeIngredients
            : [],
      },
      foodOptions: props.foodOptions || [],
      measureOptions: props.measureOptions || [],
      removedIngredientIds: [],
    };
  }

  componentDidMount() {
    this.getGrocery();
    this.getMeasure();
    if (this.props.isEditMode) {
      console.log("Selected Recipe:", this.props);
    }
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
      this.setState(
        {
          recipeData: {
            recipe_name: this.props.recipeTitle,
            duration: this.props.recipeDuration,
            portion: this.props.recipeServings,
            instruction: this.props.recipeInstructions,
            ingredients: Array.isArray(this.props.recipeIngredients)
              ? this.props.recipeIngredients
              : [],
          },
        },
        () => {
          if (this.props.isEditMode) {
            console.log("Updated Selected Recipe:", this.state.recipeData);
          }
        }
      );
    }
  }

  handleAddIngredient = () => {
    const { ingredientData, recipeData } = this.state;
    if (
      ingredientData.amount &&
      ingredientData.unit_name &&
      ingredientData.grocery_name
    ) {
      this.setState({
        recipeData: {
          ...recipeData,
          ingredients: [...recipeData.ingredients, ingredientData],
        },
        ingredientData: { amount: "", unit_name: "", grocery_name: "" },
        showAlert: false,
      });
    } else {
      this.setState({ showAlert: true });
    }
  };

  handleRemoveIngredient = (ingredientId) => {
    console.log("Deleting ingredient with ID:", ingredientId);
    this.setState(
      (prevState) => {
        const newIngredients = prevState.recipeData.ingredients.filter(
          (ingredient) => ingredient.id !== ingredientId
        );
        console.log("Updated ingredients:", newIngredients);

        return {
          recipeData: {
            ...prevState.recipeData,
            ingredients: newIngredients,
          },
          removedIngredientIds: [
            ...prevState.removedIngredientIds,
            ingredientId,
          ],
        };
      },
      () => {
        console.log(
          "Updated removedIngredientIds:",
          this.state.removedIngredientIds
        );
      }
    );
  };

  removeIngredientsFromRecipe = async (groceryStatementId) => {
    try {
      await SmartFridgeAPI.getAPI().deleteGroceryStatement(groceryStatementId);
      console.log(
        `Successfully deleted ingredient with ID: ${groceryStatementId}`
      );
    } catch (error) {
      console.error(
        `Error deleting ingredient with ID: ${groceryStatementId}`,
        error
      );
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    const form = e.target.closest("form");

    if (form.checkValidity()) {
      this.updateStateAndSubmit();
    } else {
      this.setState({ showAlert: true });
    }
  };

  updateStateAndSubmit = async () => {
    const { recipeData, foodOptions, measureOptions, removedIngredientIds } =
      this.state;

    console.log("Form submitted: ", recipeData);

    const createdRecipe = await this.props.handleCreateRecipes(recipeData);

    console.log("Created Recipe ====>", createdRecipe);

    if (!createdRecipe || !createdRecipe.id) {
      console.error("Failed to create or update recipe");
      return;
    }

    console.log("Recipe ID in =====>", createdRecipe.id);
    const recipeId = createdRecipe.id;

    const newGroceries = new Set();
    const newMeasurements = new Set();

    for (const ingredient of recipeData.ingredients) {
      if (!foodOptions.includes(ingredient.grocery_name)) {
        newGroceries.add(ingredient.grocery_name);
      }
      if (!measureOptions.includes(ingredient.unit_name)) {
        newMeasurements.add(ingredient.unit_name);
      }
    }

    for (const grocery of newGroceries) {
      try {
        await this.addGrocery(grocery);
        console.log("Grocery added successfully.");
      } catch (error) {
        console.error("Error adding grocery:", error);
      }
    }

    for (const measurement of newMeasurements) {
      try {
        await this.addMeasure(measurement);
        console.log("Measurement added successfully.");
      } catch (error) {
        console.error("Error adding measurement:", error);
      }
    }

    for (const ingredient of recipeData.ingredients) {
      try {
        const grocery_id = await SmartFridgeAPI.getAPI().getGroceryByName(
          ingredient.grocery_name
        );
        const measure_id = await SmartFridgeAPI.getAPI().getMeasureByName(
          ingredient.unit_name
        );
        const amount = ingredient.amount;

        const groceryId = grocery_id.id;
        const measureId = measure_id.id;

        await this.addRecipeInFridge(groceryId, measureId, amount, recipeId);
        console.log(
          `Added ingredient ${ingredient.grocery_name} with measure ${ingredient.unit_name} to fridge.`
        );
      } catch (error) {
        console.error("Error adding ingredient to fridge:", error);
      }
    }

    if (removedIngredientIds && removedIngredientIds.length > 0) {
      for (const ingredientId of removedIngredientIds) {
        await this.removeIngredientsFromRecipe(ingredientId);
      }
    }

    console.log("Hier sieht man recipeData", recipeData.ingredients);
  };

  handleUnitInput = (event) => {
    this.setState({ showAlert: false });
    const value = event.target.value;
    event.target.value = value.replace(/[^a-zA-ZäöüÄÖÜß]/g, ""); // Regex to allow only letters including German umlauts
  };

  getGrocery = () => {
    const { fridgeId } = this.state;
    SmartFridgeAPI.getAPI()
      .getGroceryByFridgeId(fridgeId)
      .then((groceries) => {
        this.setState({
          foodOptions: groceries.map((grocery) => grocery.getGroceryName()),
        });
      });
  };

  getMeasure = () => {
    const { fridgeId } = this.state;
    SmartFridgeAPI.getAPI()
      .getMeasureByFridgeId(fridgeId)
      .then((measures) => {
        this.setState({
          measureOptions: measures.map((measure) => measure.getUnit()),
        });
      });
  };

  addGrocery = async (newGroceryName) => {
    const { fridgeId } = this.state;
    const newGrocery = new GroceryBO(newGroceryName, fridgeId);

    try {
      const grocery = await SmartFridgeAPI.getAPI().addGrocery(newGrocery);
      this.setState((prevState) => ({
        foodOptions: [...prevState.foodOptions, grocery.getGroceryName()],
      }));
    } catch (error) {
      console.error("Error adding grocery:", error);
    }
  };

  addMeasure = async (newMeasurement) => {
    const { fridgeId } = this.state;
    const newMeasure = new MeasureBO(newMeasurement, fridgeId);

    try {
      const measure = await SmartFridgeAPI.getAPI().addMeasure(newMeasure);
      this.setState((prevState) => ({
        measureOptions: [...prevState.measureOptions, measure.getUnit()],
      }));
    } catch (error) {
      console.error("Error adding measurement:", error);
    }
  };

  addRecipeInFridge = async (groceryId, measureId, amount, recipeId) => {
    const newGroceryStatement = new GroceryStatementBO(
      groceryId,
      measureId,
      amount
    );

    try {
      const groceryStatement =
        await SmartFridgeAPI.getAPI().addGroceryStatement(newGroceryStatement);
      const groceryStatementId = groceryStatement.id;
      console.log("groceryStatementId:", groceryStatementId);

      const groceryStatementAddedInFridge =
        await SmartFridgeAPI.getAPI().addGroceryinRecipe(
          groceryStatementId,
          recipeId
        );
      console.log(
        "groceryStatementAddedInFridge:",
        groceryStatementAddedInFridge
      );
    } catch (error) {
      console.error("Error adding grocery statement:", error);
    }
  };

  render() {
    const { handlePopupRecipeClose, isEditMode } = this.props;
    const {
      showAlert,
      recipeData: { recipe_name, duration, portion, instruction, ingredients },
      ingredientData: { amount, unit_name, grocery_name },
      foodOptions,
      measureOptions,
    } = this.state;

    const sortedFoodOptions = foodOptions.sort((a, b) => a.localeCompare(b));
    const sortedMeasureOptions = measureOptions.sort((a, b) =>
      a.localeCompare(b)
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
            width: { xs: "80%", sm: "80%", md: "85%", xl: "1100px" },
            height: "auto",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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
              padding: { xs: "20px", sm: "0 30px 50px 30px" },
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
                fontSize: { xs: "1.5rem", sm: "2rem" },
              }}
            >
              {isEditMode ? "Rezept bearbeiten" : "Rezept hinzufügen"}
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
                value={recipe_name}
                onChange={(e) =>
                  this.setState({
                    recipeData: {
                      ...this.state.recipeData,
                      recipe_name: e.target.value,
                    },
                  })
                }
                onInput={() => this.setState({ showAlert: false })}
                id="outlined-required"
                name="recipe_name"
                label="Rezepttitel"
                placeholder="Rezepttitel"
                InputLabelProps={{ style: { fontSize: "15px" } }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
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
                  sx={{ width: { xs: "100%", sm: "50%" } }}
                />
                <TextField
                  required
                  value={portion}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    this.setState({
                      recipeData: {
                        ...this.state.recipeData,
                        portion: value,
                      },
                    });
                  }}
                  onInput={() => this.setState({ showAlert: false })}
                  id="outlined-required"
                  name="portion"
                  label="Portionen"
                  placeholder="Portionen"
                  InputLabelProps={{ style: { fontSize: "15px" } }}
                  type="number"
                  inputProps={{ min: "1" }}
                  sx={{ width: { xs: "100%", sm: "50%" } }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <TextField
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
                        [name]: parseInt(value),
                      },
                    }));
                  }}
                  type="number"
                  inputProps={{ min: "1" }}
                  sx={{ width: { xs: "100%", xl: "150px" } }}
                />
                <Autocomplete
                  sx={{ width: { xs: "100%", xl: "150px" } }}
                  id="measurements-box"
                  options={sortedMeasureOptions.map((option) => ({
                    title: option,
                  }))}
                  value={unit_name}
                  freeSolo
                  onChange={(event, newValue) => {
                    let updatedUnit = "";
                    if (newValue === null) {
                      updatedUnit = "";
                    } else if (typeof newValue === "string") {
                      updatedUnit = newValue;
                    } else if (newValue && newValue.inputValue) {
                      updatedUnit = newValue.inputValue;
                    } else {
                      updatedUnit = newValue.title;
                    }
                    this.setState((prevState) => ({
                      ingredientData: {
                        ...prevState.ingredientData,
                        unit_name: updatedUnit,
                      },
                    }));
                  }}
                  onInputChange={() => this.setState({ showAlert: false })}
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
                      onInput={this.handleUnitInput}
                      name="unit"
                      label="Einheit"
                      placeholder="Einheit"
                      sx={{
                        width: {
                          xs: "100%",
                          xl: "150px",
                        },
                      }}
                    />
                  )}
                />

                <Autocomplete

                  id="ingredient-box"
                  options={sortedFoodOptions.map((option) => ({
                    title: option,
                  }))}
                  value={grocery_name}
                  freeSolo
                  onChange={(event, newValue) => {
                    let updatedName = "";
                    if (newValue === null) {
                      updatedName = "";
                    } else if (typeof newValue === "string") {
                      updatedName = newValue;
                    } else if (newValue && newValue.inputValue) {
                      updatedName = newValue.inputValue;
                    } else {
                      updatedName = newValue.title;
                    }
                    this.setState((prevState) => ({
                      ingredientData: {
                        ...prevState.ingredientData,
                        grocery_name: updatedName,
                      },
                    }));
                  }}
                  onInputChange={() => this.setState({ showAlert: false })}
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
                      onInput={this.handleNameInput}
                      name="name"
                      label="Zutat"
                      placeholder="Zutat"
                      sx={{ flex: 1 }}
                    />
                  )}
                  sx={{ width: {xs: "100%", xl: "100%"} }}
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
                  maxHeight: "100px",
                  bgcolor: "transparent",
                  position: "relative",
                  overflow: "auto",
                  paddingTop: "50px",
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
                        onClick={() => {
                          console.log("Deleting ingredient:", ingredient);
                          this.handleRemoveIngredient(ingredient.id);
                        }}
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
                      primary={`⪧ ${ingredient.quantity} ${ingredient.unit_name} / ${ingredient.grocery_name}`}
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
                rows={5}
                name="instruction"
                value={instruction}
                onChange={(e) =>
                  this.setState({
                    recipeData: {
                      ...this.state.recipeData,
                      instruction: e.target.value,
                    },
                  })
                }
                onInput={() => this.setState({ showAlert: false })}
                sx={{ height: "auto", maxHeight: "200px" }}
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
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "center",
                  gap: "10px",
                  paddingBottom: { xs: "30px" },
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
                    width: { xs: "100%", sm: "auto" },
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
                    width: { xs: "100%", sm: "auto" },
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
