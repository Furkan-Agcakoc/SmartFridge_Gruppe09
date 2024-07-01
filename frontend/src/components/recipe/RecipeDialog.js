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
      ingredientData: {
        amount: "",
        unit_name: "",
        grocery_name: "",
      },
      recipeData: {
        recipe_name: props.isEditMode ? props.recipe_name : "",
        duration: props.isEditMode ? props.duration : "",
        portion: props.isEditMode ? props.portion : "",
        instruction: props.isEditMode ? props.instruction : "",
        groceryUnit: ["g", "kg", "ml", "l", "Stück"],
        ingredients:
          props.isEditMode && props.ingredients
            ? props.ingredients
            : [],
      },
      foodOptions: props.foodOptions || [],
      measureOptions: props.measureOptions || [],
    };
  }

  componentDidMount() {
    this.getGrocery();
    this.getMeasure();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.recipe_name !== this.props.recipe_name ||
      prevProps.duration !== this.props.duration ||
      prevProps.portion !== this.props.portion ||
      prevProps.instruction !== this.props.instruction ||
      prevProps.ingredients !== this.props.ingredients
    ) {
      this.setState({
        recipeData: {
          recipe_name: this.props.recipe_name,
          duration: this.props.duration,
          portion: this.props.portion,
          instruction: this.props.instruction,
          groceryUnit: ["g", "kg", "ml", "l", "Stück"],
          ingredients: Array.isArray(this.props.ingredients)
            ? this.props.ingredients
            : [],
        },
      });
    }
  }

  handleAddIngredient = () => {
    const { ingredientData, recipeData } = this.state;
    if (ingredientData.amount && ingredientData.unit_name && ingredientData.grocery_name) {
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
    e.preventDefault();
    const form = e.target.closest("form");
    
    if (form.checkValidity()) {
      this.updateStateAndSubmit();
    } else {
      this.setState({ showAlert: true });
    }
  };

  updateStateAndSubmit = async () => {
    const { recipeData, foodOptions, measureOptions } = this.state;
  
    console.log("Form submitted: ", recipeData);
  
    const createdRecipe = await this.props.handleCreateRecipes(recipeData);
    const recipeId = createdRecipe.id;

    // Use a Set to keep track of new grocery names and measurement units to be added
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
  
    // Add new groceries
    for (const grocery of newGroceries) {
      try {
        await this.addGrocery(grocery);
        console.log("Grocery added successfully.");
      } catch (error) {
        console.error("Error adding grocery:", error);
      }
    }
  
    // Add new measurements
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
        const grocery_id = await SmartFridgeAPI.getAPI().getGroceryByName(ingredient.grocery_name);
        const measure_id = await SmartFridgeAPI.getAPI().getMeasureByName(ingredient.unit_name);
        const amount = ingredient.amount
  
        const groceryId = grocery_id.id;
        const measureId = measure_id.id;
  
        // Call the addRecipeInFridge method for each ingredient
        await this.addRecipeInFridge(groceryId, measureId, amount, recipeId);
        console.log(`Added ingredient ${ingredient.grocery_name} with measure ${ingredient.unit_name} to fridge.`);
      } catch (error) {
        console.error("Error adding ingredient to fridge:", error);
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
    const { groceryData, fridgeId } = this.state;
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


      //Change fridgeId
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
                        [name]: parseInt(value),
                      },
                    }));
                  }}
                  type="number"
                  inputProps={{ min: "1" }}
                  sx={{ width: "150px" }}
                />
                <Autocomplete
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
                      sx={{ width: "150px" }}
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
                  sx={{ width: "100%" }}
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
                      primary={`⪧ ${ingredient.amount} ${ingredient.unit_name} / ${ingredient.grocery_name}`}
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
