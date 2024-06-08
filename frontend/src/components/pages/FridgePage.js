import React, { Component } from "react";
import {
  Paper,
  Tooltip,
  Tab,
  Box,
  Link,
  Container,
  Alert,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import FlatwareRoundedIcon from "@mui/icons-material/FlatwareRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";
import Recipe from "../recipe/Recipe";
import Grocery from "../grocery/Grocery";
// import PopupGrocery from "../grocery/PopupGrocery";
import FridgeSearchBar from "../FridgeSearchBar";
import AddGroceryPopup from "../grocery/AddGroceryPopup";
import EditGroceryPopup from "../grocery/EditGroceryPopup";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
import AddRecipePopup from "../recipe/AddRecipePopup";
import EditRecipePopup from "../recipe/EditRecipePopup";

class FridgePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      showAlert: false,

      // Grocery Props
      groceryCount: 0,
      groceries: [],
      groceryIdToDelete: null,
      popupGroceryOpen: false,
      // Recipe Props
      recipeCount: 0,
      recipes: [],
      recipeIdToDelete: null,
      popupRecipeOpen: false,
      currentlyEditingRecipe: null,

      // Edit Props
      anchorEls: {},
      openMenus: {},
      currentlyEditing: null,
      dialogopen: false,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  //   handleChange = (event) => {
  //     const { name, value } = event.target;
  //     this.setState({
  //       [name]: value,
  //       showAlert: false,
  //     });
  //   };

  handleTabChange(event, newValue) {
    console.log("Tab changed:", newValue);
    this.setState({
      value: newValue,
    });
  }

  handlePopupGroceryOpen = () => {
    console.log("Grocery-Popup opened");
    this.setState({
      popupGroceryOpen: true,
      currentlyEditing: null,
    });
  };

  handlePopupGroceryClose = () => {
    console.log("Grocery-Popup closed von edit");
    this.setState({
      popupGroceryOpen: false,
      currentlyEditing: null,
    });
  };

  handlePopupRecipeOpen = () => {
    console.log("Recipe-Popup opened");
    this.setState({
      popupRecipeOpen: true,
      currentlyEditingRecipe: null,
    });
  };

  handlePopupRecipeClose = () => {
    console.log("Recipe-Popup closed recipe recipe");
    this.setState({
      popupRecipeOpen: false,
      currentlyEditingRecipe: null,
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    // console.log("Input changed:", name, value);
    this.setState({
      [name]: value,
      showAlert: false,
    });
  };

  // handleClickOpenDialog = (Id, type) => {
  //   console.log("Dialog opened for grocery ID:", Id);
  //   this.setState({
  //     dialogopen: true,
  //     groceryIdToDelete: Id,
  //   });
  //   this.handleAnchorClose(Id);
  // };

  handleCloseDialog = () => {
    console.log("Dialog closed");
    this.setState({ dialogopen: false });
  };

  handleConfirmDelete = () => {
    const { groceryIdToDelete } = this.state;
    console.log("Confirm delete for grocery ID:", groceryIdToDelete);
    if (groceryIdToDelete !== null) {
      this.handleAnchorDelete(groceryIdToDelete);
    }
    this.handleCloseDialog();
  };

  handleCreateGroceries = (currentGrocery) => {
    const { groceries, currentlyEditing } = this.state;

    if (currentlyEditing !== null) {
      console.log("Editing grocery ID:", currentlyEditing);
      // Edit existing grocery
      this.setState({
        groceries: this.updateGrocery({
          groceryId: currentlyEditing,
          groceryName: currentGrocery.name,
          groceryQuantity: currentGrocery.quantity,
          groceryUnit: currentGrocery.unit,
        }),
        popupGroceryOpen: false,
        currentGrocery: {
          name: "",
          quantity: "",
          unit: "",
        },
        showAlert: false,
        currentlyEditing: null,
      });
    } else {
      const id = groceries.length + 1;
      console.log("Creating grocery:", groceries);
      // Code to create a new grocery
      this.setState((prevState) => {
        const newGroceries = [
          ...prevState.groceries,
          {
            groceryId: id,
            groceryName: currentGrocery.name,
            groceryQuantity: currentGrocery.quantity,
            groceryUnit: currentGrocery.unit,
          },
        ];
        const newOpenMenus = { ...prevState.openMenus, [id]: false };
        console.log(newGroceries);
        console.log(newOpenMenus);

        return {
          groceryCount: prevState.groceryCount + 1,
          popupGroceryOpen: false,
          groceries: newGroceries,
          currentGrocery: {
            name: "",
            quantity: "",
            unit: "",
          },
          showAlert: false,
          openMenus: newOpenMenus,
        };
      });
    }
  };

  updateGrocery(grocery) {
    const updatedGroceries = this.state.groceries.map((e) => {
      if (grocery.groceryId === e.groceryId) {
        return grocery;
      }
      return e;
    });
    console.log("Grocery updated:", updatedGroceries);
    return updatedGroceries;
  }

  handleAnchorClick = (groceryId, event) => {
    console.log("Anchor clicked for grocery ID:", groceryId);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [groceryId]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [groceryId]: event.target,
      };
      console.log("newOpenMenus:", newOpenMenus);
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorClose = (groceryId) => {
    console.log("Anchor closed for grocery ID:", groceryId);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [groceryId]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorEdit = (grocery) => {
    console.log("Editing grocery:", grocery);
    this.setState((prevState) => {
      const newOpenMenus = {
        ...prevState.openMenus,
        [grocery.groceryId]: false,
      };
      console.log(newOpenMenus);
      return {
        currentlyEditing: grocery.groceryId,
        currentGrocery: {
          name: grocery.groceryName,
          quantity: grocery.groceryQuantity,
          unit: grocery.groceryUnit,
        },
        openMenus: newOpenMenus,
      };
    });
  };

  handleCreateRecipes = (recipeData) => {
    const { recipes, currentlyEditingRecipe } = this.state;

    if (currentlyEditingRecipe !== null) {
      console.log("Editing recipe ID:", currentlyEditingRecipe);
      // Edit existing recipe
      this.setState({
        recipes: this.updateRecipe({
          recipeId: currentlyEditingRecipe,
          recipeTitle: recipeData.title,
          recipeDuration: recipeData.duration,
          recipeServings: recipeData.servings,
          recipeInstructions: recipeData.instructions,
          recipeIngredients: recipeData.ingredients,
        }),
        popupRecipeOpen: false,
        currentIngredient: {
          amount: "",
          unit: "",
          name: "",
        },
        recipeData: {
          title: "",
          duration: "",
          servings: "",
          instructions: "",
        },
        showAlert: false,
        currentlyEditingRecipe: null,
      });
      console.log("Rezeptenliste von Edit: ", recipes);
    } else {
      const id = recipes.length + 1;
      console.log("Unsere bisherigen Rezepte:", recipes);
      // Code to create a new recipe
      this.setState((prevState) => {
        const newRecipes = [
          ...prevState.recipes,
          {
            recipeId: id,
            recipeTitle: recipeData.title,
            recipeDuration: recipeData.duration,
            recipeServings: recipeData.servings,
            recipeInstructions: recipeData.instructions,
            recipeIngredients: recipeData.ingredients,
          },
        ];
        const newOpenMenus = { ...prevState.openMenus, [id]: false };
        console.log("Hier sind alle Rezepte ",newRecipes);
        console.log(newOpenMenus);

        return {
          recipeCount: prevState.recipeCount + 1,
          popupRecipeOpen: false,
          recipes: newRecipes,
          currentIngredient: {
            amount: "",
            unit: "",
            name: "",
          },
          recipeData: {
            title: "",
            duration: "",
            servings: "",
            instructions: "",
          },
          showAlert: false,
          openMenus: newOpenMenus,
        };
      });
    }
  };

  updateRecipe(recipe) {
    const updatedRecipes = this.state.recipes.map((e) => {
      if (recipe.recipeId === e.recipeId) {
        return recipe;
      }
      return e;
    });
    console.log("Recipe updated:", updatedRecipes);
    return updatedRecipes;
  }

  handleAnchorClickRecipe = (recepyId, event) => {
    console.log("Anchor clicked for grocery ID:", recepyId);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [recepyId]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [recepyId]: event.target,
      };
      console.log("newOpenMenus:", newOpenMenus);
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorCloseRecipe = (recepyId) => {
    console.log("Anchor closed for grocery ID:", recepyId);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [recepyId]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorEditRecipe = (recipe) => {
    console.log("Editing recipe:", recipe);
    console.log(this.state.recipeData);
    this.setState((prevState) => {
      const newOpenMenus = {
        ...prevState.openMenus,
        [recipe.recipeId]: false,
      };
      // Log the previous state
      console.log("Previous state:", prevState);
      // Log the new openMenus object
      console.log("New openMenus:", newOpenMenus);
      // Log the values being set for currentlyEditingRecipe and other states
      console.log("Currently editing recipe ID:", recipe.recipeId);
      console.log("Current ingredient:", {
        amount: recipe.recipeIngredientsAmount,
        unit: recipe.recipeIngredientsUnit,
        name: recipe.recipeIngredientsName,
      });
      console.log("Rezeptenliste: ", recipe);
      console.log("Recipe data:", {
        title: recipe.recipeTitle,
        duration: recipe.recipeDuration,
        servings: recipe.recipeServings,
        instructions: recipe.recipeInstructions,
        ingredients: recipe.recipeIngredients,
      });

      return {
        currentlyEditingRecipe: recipe.recipeId,
        currentIngredient: {
          amount: recipe.recipeIngredientsAmount,
          unit: recipe.recipeIngredientsUnit,
          name: recipe.recipeIngredientsName,
        },
        recipeData: {
          title: recipe.recipeTitle,
          duration: recipe.recipeDuration,
          servings: recipe.recipeServings,
          instructions: recipe.recipeInstructions,
          ingredients: recipe.recipeIngredients,
        },
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorDelete = (groceryId) => {
    console.log("Deleting grocery ID:", groceryId);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [groceryId]: false };
      const newGroceries = prevState.groceries.filter(
        (g) => g.groceryId !== groceryId
      );
      return {
        groceries: newGroceries,
        openMenus: newOpenMenus,
      };
    });
  };

  render() {
    const {
      value,
      popupGroceryOpen,
      popupRecipeOpen,
      showAlert,
      groceryUnit,
      currentGrocery,
      groceries,
      anchorEls,
      openMenus,
      currentlyEditing,
      currentlyEditingRecipe,
      dialogopen,
      recipes,
      currentIngredient,
      recipeData,
    } = this.state;

    const showAlertComponent = showAlert && (
      <Alert severity="error" sx={{ marginBottom: "20px" }}>
        Bitte füllen Sie alle Felder aus!
      </Alert>
    );

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: "200px",
            // border: "5px solid blue",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              border: "none",
              width: "1100px",
              height: "auto",
              padding: "0px 50px 30px 50px",
              // border: "5px solid red",
            }}
          >
            <Paper
              sx={{
                width: "1000px",
                boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                backgroundColor: "background.default",
              }}
            >
              <FridgeSearchBar></FridgeSearchBar>
              <TabContext
                value={value}
                sx={{
                  width: "1100px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "row",
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={this.handleTabChange}
                    aria-label="Smart Fridge enviorment"
                    centered
                  >
                    <Tab
                      label="Lebensmittel"
                      value="1"
                      sx={{ width: "400px" }}
                    />
                    <Tab label="Rezepte" value="2" sx={{ width: "400px" }} />
                  </TabList>
                </Box>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    // border: "5px solid red",
                  }}
                >
                  <TabPanel
                    value="1"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "baseline",
                      marginTop: "10px",
                      // marginLeft: "0px",
                      marginBottom: "-40px",
                      gap: "30px",
                      width: "100%",
                      maxWidth: "895px",
                      // border: "5px solid violet",
                    }}
                  >
                    <Link onClick={this.handlePopupGroceryOpen}>
                      <Tooltip
                        title="Neues Lebensmittel hinzufügen"
                        placement="bottom"
                        arrow
                      >
                        <Paper
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "200px",
                            height: "125px",
                            borderRadius: "10px",
                            backgroundColor: "background.paper",
                            color: "primary.main",
                            "&:hover": {
                              color: "success.dark",
                              boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                              backgroundColor: "success.gwhite",
                            },
                          }}
                        >
                          <KitchenRoundedIcon
                            sx={{
                              width: "75px",
                              height: "auto",
                              position: "absolute",
                            }}
                          />
                          <LoupeRoundedIcon
                            sx={{
                              width: "30px",
                              height: "auto",
                              transform: "scaleX(-1)",
                              position: "relative",
                              top: "-38px",
                              left: "33px",
                            }}
                          />
                        </Paper>
                      </Tooltip>
                    </Link>
                    <Grocery
                      groceries={groceries}
                      handleAnchorClick={this.handleAnchorClick}
                      handleAnchorClose={this.handleAnchorClose}
                      handleAnchorEdit={this.handleAnchorEdit}
                      handleClickOpenDialog={this.props.handleClickOpenDialog}
                      anchorEls={anchorEls}
                      openMenus={openMenus}
                    ></Grocery>
                  </TabPanel>
                  {popupGroceryOpen && (
                    <AddGroceryPopup
                      handlePopupGroceryClose={this.handlePopupGroceryClose}
                      showAlertComponent={showAlertComponent}
                      groceryUnit={groceryUnit}
                      handleCreateGroceries={this.handleCreateGroceries}
                      // currentGrocery={currentGrocery}
                      // currentGroceryQuantity={currentGroceryQuantity}
                      // currentGroceryUnit={currentGroceryUnit}
                      handleChange={this.handleChange}
                    />
                  )}
                  {currentlyEditing !== null && (
                    <EditGroceryPopup
                      handleChange={this.handleChange}
                      handleCreateGroceries={this.handleCreateGroceries}
                      handlePopupGroceryClose={this.handlePopupGroceryClose}
                      showAlert={showAlert}
                      groceryUnit={groceryUnit}
                      currentGrocery={currentGrocery}
                    />
                  )}
                  {dialogopen && (
                    <DeleteConfirmationDialog
                      handleCloseDialog={this.handleCloseDialog}
                      handleConfirmDelete={this.handleConfirmDelete}
                    />
                  )}
                </Container>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    // border: "5px solid red",
                  }}
                >
                  <TabPanel
                    value="2"
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "baseline",
                      marginTop: "10px",
                      marginLeft: "0px",
                      marginBottom: "0px",
                      gap: "30px",
                      width: "100%",
                      maxWidth: "895px",
                      position: "relative",
                      top: "-18px",
                      // border: "5px solid violet",
                    }}
                  >
                    <Link onClick={this.handlePopupRecipeOpen}>
                      <Tooltip
                        title="Neues Rezept hinzufügen"
                        placement="bottom"
                        arrow
                      >
                        <Paper
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "200px",
                            height: "125px",
                            borderRadius: "10px",
                            backgroundColor: "background.paper",
                            color: "primary.main",
                            "&:hover": {
                              color: "success.dark",
                              boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                              backgroundColor: "success.gwhite",
                            },
                          }}
                        >
                          <ImportContactsRoundedIcon
                            sx={{
                              width: "75px",
                              height: "auto",
                              position: "absolute",
                            }}
                          />
                          <LoupeRoundedIcon
                            sx={{
                              width: "30px",
                              height: "auto",
                              transform: "scaleX(-1)",
                              position: "relative",
                              top: "-30px",
                              left: "54px",
                            }}
                          />
                          <FlatwareRoundedIcon
                            sx={{
                              width: "25px",
                              height: "auto",
                              position: "relative",
                              top: "2px",
                              left: "-1px",
                            }}
                          />
                        </Paper>
                      </Tooltip>
                    </Link>
                    <Recipe
                      recipes={recipes}
                      handleAnchorClickRecipe={this.handleAnchorClickRecipe}
                      handleAnchorEditRecipe={this.handleAnchorEditRecipe}
                      handleAnchorCloseRecipe={this.handleAnchorCloseRecipe}
                      handleClickOpenDialog={this.props.handleClickOpenDialog}
                      anchorEls={anchorEls}
                      openMenus={openMenus}
                    ></Recipe>
                  </TabPanel>
                  {popupRecipeOpen && (
                    <AddRecipePopup
                      handlePopupRecipeClose={this.handlePopupRecipeClose}
                      groceryUnit={groceryUnit}
                      showAlertComponent={showAlertComponent}
                      handleCreateRecipes={this.handleCreateRecipes}
                      handleChange={this.handleChange}
                      currentIngredient={currentIngredient}
                      recipeData={recipeData}
                    />
                  )}
                  {currentlyEditingRecipe !== null && (
                    <EditRecipePopup
                      handlePopupRecipeClose={this.handlePopupRecipeClose}
                      handleCreateRecipes={this.handleCreateRecipes}
                      currentIngredient={currentIngredient}
                      recipeData={recipeData}
                    />
                  )}
                </Container>
              </TabContext>
            </Paper>
          </Box>
        </Box>
      </>
    );
  }
}

export default FridgePage;
