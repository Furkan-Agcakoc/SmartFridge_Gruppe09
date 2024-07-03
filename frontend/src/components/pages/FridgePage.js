import React, { Component } from "react";
import {
  Paper,
  Tooltip,
  Tab,
  Box,
  Link,
  Container,
  Button,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import FlatwareRoundedIcon from "@mui/icons-material/FlatwareRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";
import Recipe from "../recipe/Recipe";
import Grocery from "../grocery/Grocery";
import FridgeSearchBar from "../FridgeSearchBar";
import GroceryDialog from "../grocery/GroceryDialog";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
import RecipeDialog from "../recipe/RecipeDialog";
import Settings from "../household/Settings";
import UserContext from "../contexts/UserContext";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import AlertComponent from "../dialogs/AlertComponent";
import { useParams } from "react-router-dom";
import RecipeBO from "../../api/RecipeBO";

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let params = useParams();
    return <Component {...props} params={params} />;
  }

  return ComponentWithRouterProp;
}

class FridgePage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      popupGroceryOpen: false,
      groceryCount: 0,
      groceries: [],
      groceryIdToDelete: null,
      isEditMode: false,
      currentlyEditing: null,
      anchorEls: {},
      openMenus: {},
      popupRecipeOpen: false,
      recipeCount: 0,
      allRecipes: [], //Hier werden alle Rezepte gespeichert
      recipes: [], //Hier werden alle Rezepte gespeichert, die in der Fridge enthalten sind
      availableRecipes: [],
      showRecipeAlert: false,
      recipeIdToDelete: null,
      dialogopen: false,
      households: [],
      householdId: null,
      fridgeId: null,
      householdName: "",
      groceryStatements: {},
      groceryName: {},
      measureName: {},
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setIdToDelete = this.setIdToDelete.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleAnchorDelete = this.handleAnchorDelete.bind(this);
  }

  componentDidMount() {
    const { householdId, fridgeId } = this.props.params; // Extract householdId and fridgeId from props
    this.setState({ householdId, fridgeId }, () => {
      // Callback function to ensure state is updated before making API calls
      this.getFridgeByHouseholdId(householdId);
      this.getHouseholdNameById(householdId); // Load household name
      this.getGroceryInFridgeId(householdId);
      this.loadRecipeList();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.fridgeId !== this.state.fridgeId) {
      this.loadRecipeList();
    }
  }
  // #####################APIs###########################

  loadRecipeList = async () => {
    try {
      const allRecipes = await SmartFridgeAPI.getAPI().getRecipe();
      this.setState({ allRecipes });
      console.log("allRecipes", allRecipes);

      // Fetch recipes by fridge ID after getting all recipes
      const { fridgeId } = this.state;
      if (fridgeId) {
        this.loadRecipeByFridgeId(fridgeId);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  loadRecipeByFridgeId = (fridgeId) => {
    SmartFridgeAPI.getAPI()
      .getRecipeByFridgeId(fridgeId)
      .then((recipes) => {
        this.setState({ recipes });
        console.log("recipes", this.state.recipes);
      })
      .catch((error) => {
        console.error("Error fetching recipes by fridge ID:", error);
      });
  };

  getGroceryInFridgeId = async (fridgeId) => {
    try {
      const groceryStatements =
        await SmartFridgeAPI.getAPI().getGroceryInFridgeId(fridgeId);

      const updatedGroceryStatements = await Promise.all(
        groceryStatements.map(async (statement) => {
          try {
            const groceryResponse = await this.getGroceryById(
              statement.grocery_id
            );
            const measureResponse = await this.getMeasureById(
              statement.unit_id
            );

            const grocery = Array.isArray(groceryResponse)
              ? groceryResponse[0]
              : groceryResponse;
            const measure = Array.isArray(measureResponse)
              ? measureResponse[0]
              : measureResponse;

            return {
              ...statement,
              grocery_name: grocery?.grocery_name ?? "Unknown",
              unit_name: measure?.unit ?? "Unknown",
            };
          } catch (error) {
            console.error("Error processing statement:", statement, error);
            return {
              ...statement,
              grocery_name: "Unknown",
              unit_name: "Unknown",
            };
          }
        })
      );
      this.setState({ updatedGroceryStatements });
    } catch (error) {
      // console.error("Error fetching grocery statements:", error);
    }
  };

  getGroceryById = async (groceryId) => {
    try {
      const grocery = await SmartFridgeAPI.getAPI().getGroceryById(groceryId);
      return grocery;
    } catch (error) {
      console.error("Error fetching grocery:", error);
    }
  };

  getMeasureById = async (measureId) => {
    try {
      const measure = await SmartFridgeAPI.getAPI().getMeasureById(measureId);
      return measure;
    } catch (error) {
      console.error("Error fetching measure:", error);
    }
  };

  refreshGroceryList = async () => {
    const { fridgeId } = this.state;
    this.setState({
      showRecipeAlert: false,
    });
    await this.getGroceryInFridgeId(fridgeId);
  };

  getRecipeContentByFridgeId = async () => {
    const { recipes, fridgeId } = this.state;

    if (recipes.length === 0) {
      this.setState({
        availableRecipes: "Es gibt keine Rezepte im Kühlschrank!",
        showRecipeAlert: true,
      });
      return;
    }

    const availableRecipes =
      await SmartFridgeAPI.getAPI().getRecipeContentByFridgeId(fridgeId);

    let formattedMessage = availableRecipes.join("<br />");

    this.setState({
      availableRecipes: formattedMessage,
      showRecipeAlert: true,
    });
  };
  // #######################NO APIs###############################

  groceryStatement(statement) {
    console.log("Statement von Fridgepage", statement);
    const quantity = statement.map((statement) => statement.quantity);
    console.log("Quantity", quantity);
  }

  groceryName(groceryName) {
    console.log("GroceryName von Fridgepage", groceryName);
    // console.log(groceryName.grocery.grocery_name);
  }

  measureName(measureName) {
    console.log("MeasureName von Fridgepage", measureName);
  }

  getHouseholdNameById = (householdId) => {
    SmartFridgeAPI.getAPI()
      .getHouseholdById(householdId)
      .then((household) => {
        this.setState({ householdName: household.household_name });
      })
      .catch((error) => {
        console.error("Error fetching household name:", error);
      });
  };

  getFridgeByHouseholdId = (householdID) => {
    SmartFridgeAPI.getAPI()
      .getFridgeByHouseholdId(householdID)
      .then((response) => {
        const fridgeId = response.id;
        this.setState({ fridgeId }, () => {
          this.loadRecipeList();
        });
      })
      .catch((error) => {
        console.error("Error fetching fridge by household ID:", error);
      });
  };

  handleTabChange(event, newValue) {
    console.log("Tab changed:", newValue);
    this.setState({
      value: newValue,
    });
  }

  handlePopupGroceryOpen = (isEditMode = false, grocery = null) => {
    console.log("Grocery-Popup opened", grocery);
    this.setState({
      popupGroceryOpen: true,
      isEditMode,
      currentlyEditing: grocery,
    });
  };

  handlePopupGroceryClose = () => {
    console.log("Grocery-Popup closed");
    this.setState({
      popupGroceryOpen: false,
      currentlyEditing: null,
    });
  };

  handleCreateGroceries = (groceryData) => {
    const { currentlyEditing, groceries, updatedGroceryStatements } =
      this.state;
    console.log("groceryData in handleCreateGroceries", groceryData);

    if (currentlyEditing !== null) {
      const updatedGroceries = updatedGroceryStatements.map((grocery) => {
        if (grocery.id === currentlyEditing.id) {
          return {
            ...grocery,
            grocery_name: groceryData.name,
            quantity: groceryData.quantity,
            unit_name: groceryData.unit,
          };
        }
        return grocery;
      });

      this.setState(
        {
          groceries: updatedGroceries,
          popupGroceryOpen: false,
          currentlyEditing: null,
        },
        () => {
          console.log("Updated groceries:", this.state.groceries);
        }
      );

      console.log("Updated grocery ===>", updatedGroceries);
    } else {
      // Hinzufügen eines neuen Lebensmittels, wenn es im Bearbeitungsmodus nicht existiert
      const existingGrocery = groceries.find(
        (grocery) => grocery.groceryName === groceryData.name
      );

      if (existingGrocery) {
        // Menge zum existierenden Lebensmittel addieren
        const updatedGroceries = groceries.map((grocery) => {
          if (grocery.groceryName === groceryData.name) {
            return {
              ...grocery,
              groceryQuantity:
                parseFloat(grocery.groceryQuantity) +
                parseFloat(groceryData.quantity),
            };
          }
          return grocery;
        });

        this.setState({
          groceries: updatedGroceries,
          popupGroceryOpen: false,
          currentlyEditing: null,
        });
      } else {
        const id = groceries.length + 1;
        this.setState((prevState) => {
          const newGroceries = [
            ...prevState.groceries,
            {
              groceryId: id,
              groceryName: groceryData.name,
              groceryQuantity: groceryData.quantity,
              groceryUnit: groceryData.unit,
            },
          ];
          const newOpenMenus = { ...prevState.openMenus, [id]: false };

          return {
            groceryCount: prevState.groceryCount + 1,
            popupGroceryOpen: false,
            groceries: newGroceries,
            openMenus: newOpenMenus,
          };
        });
      }
    }
  };

  updateGrocery = (grocery) => {
    const updatedGroceries = this.state.groceries.map((e) => {
      if (grocery.groceryId === e.groceryId) {
        return grocery;
      }
      return e;
    });
    console.log("Grocery updated:", updatedGroceries);
    return updatedGroceries;
  };

  handleAnchorClick = (Id, event) => {
    console.log("Anchor clicked for grocery ID:", Id);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [Id]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [Id]: event.target,
      };
      console.log("newOpenMenus:", newOpenMenus);
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorClose = (Id) => {
    console.log("Anchor closed:", Id);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [Id]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  fetchIngredients = async (recipeId) => {
    if (recipeId) {
      const api = SmartFridgeAPI.getAPI();
      try {
        const groceryStatementBOs = await api.getGroceryInRecipeId(recipeId);
        const detailedIngredientsPromises = groceryStatementBOs.map(
          async (ingredient) => {
            const groceryResponse = await this.getGroceryById(
              ingredient.grocery_id
            );
            const measureResponse = await this.getMeasureById(
              ingredient.unit_id
            );

            const grocery = Array.isArray(groceryResponse)
              ? groceryResponse[0]
              : groceryResponse;
            const measure = Array.isArray(measureResponse)
              ? measureResponse[0]
              : measureResponse;

            return {
              ...ingredient,
              grocery_name: grocery?.grocery_name ?? "Unknown",
              unit_name: measure?.unit ?? "Unknown",
            };
          }
        );
        const detailedIngredientsResults = await Promise.all(
          detailedIngredientsPromises
        );
        return detailedIngredientsResults;
      } catch (error) {
        console.error("Error fetching ingredients:", error);
        return [];
      }
    } else {
      console.error("Recipe or recipe ID is undefined");
      return [];
    }
  };

  handleAnchorEdit = async (Id) => {
    console.log("Editing:", Id);
    const grocery = this.state.updatedGroceryStatements.find(
      (g) => g.id === Id
    );
    const recipe = this.state.recipes.find((g) => g.id === Id);

    if (recipe) {
      const ingredients = await this.fetchIngredients(Id);

      console.log("Ingredients ====>", ingredients);
      recipe.ingredients = ingredients;
    }

    this.setState(
      (prevState) => {
        const newOpenMenus = {
          ...prevState.openMenus,
          [Id]: false,
        };
        return {
          currentlyEditing: recipe,
          openMenus: newOpenMenus,
          popupGroceryOpen: prevState.value === "1",
          popupRecipeOpen: prevState.value === "2",
        };
      },
      () => {
        if (this.state.value === "1") {
          this.handlePopupGroceryOpen(true, grocery);
        } else if (this.state.value === "2") {
          this.handlePopupRecipeOpen(true, recipe);
        }
      }
    );
  };

  deleteGroceryStatement = async (groceryStatementID) => {
    try {
      await SmartFridgeAPI.getAPI().deleteGroceryStatement(groceryStatementID);
      this.setState((prevState) => ({
        updatedGroceryStatements: prevState.updatedGroceryStatements.filter(
          (statement) => statement.id !== groceryStatementID
        ),
      }));
    } catch (error) {
      console.error("Error deleting grocery statement:", error);
    }
  };

  deleteRecipe = async (recipeID) => {
    try {
      const groceryStatementsPromise =
        await SmartFridgeAPI.getAPI().getGroceryInRecipeId(recipeID);
      const groceryStatements = await groceryStatementsPromise;

      console.log("groceryStatements =>", groceryStatements);

      const deletePromises = groceryStatements.map((statement) =>
        SmartFridgeAPI.getAPI().deleteGroceryStatement(statement.id)
      );
      await Promise.all(deletePromises);

      await SmartFridgeAPI.getAPI().getGroceryInRecipeId(recipeID);
      await SmartFridgeAPI.getAPI().deleteRecipe(recipeID);

      this.setState((prevState) => ({
        recipes: prevState.recipes.filter((recipe) => recipe.id !== recipeID),
      }));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  handleAnchorDelete = async (Id) => {
    try {
      if (this.state.value === "1") {
        await this.deleteGroceryStatement(Id);
      } else if (this.state.value === "2") {
        await this.deleteRecipe(Id);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  handleConfirmDelete() {
    const { groceryIdToDelete, recipeIdToDelete, value } = this.state;
    console.log("App => Confirm delete");

    console.log("groceryIdToDelete", groceryIdToDelete);
    if (value === "1" && groceryIdToDelete !== null) {
      this.handleAnchorDelete(groceryIdToDelete);
    } else if (value === "2" && recipeIdToDelete !== null) {
      this.handleAnchorDelete(recipeIdToDelete);
    }
  }

  setIdToDelete(Id) {
    this.setState((prevState) => ({
      groceryIdToDelete: prevState.value === "1" ? Id : null,
      recipeIdToDelete: prevState.value === "2" ? Id : null,
    }));
  }

  handlePopupRecipeOpen = (isEditMode = false, recipe = null) => {
    console.log("Recipe-Popup opened");
    this.setState({
      popupRecipeOpen: true,
      isEditMode,
      currentlyEditing: recipe,
      showRecipeAlert: false,
    });
  };

  handlePopupRecipeClose = () => {
    console.log("Recipe-Popup closed recipe recipe");
    this.setState({
      popupRecipeOpen: false,
      currentlyEditing: null,
    });
  };

  handleCreateRecipes = async (recipeData) => {
    const { currentlyEditing, fridgeId, recipes } = this.state;
    const userId = this.context.id;
  
    const { ingredients, groceryUnit, ...rest } = recipeData;
  
    const newRecipeData = new RecipeBO(
      rest.recipe_name,
      rest.duration,
      rest.portion,
      rest.instruction,
      userId,
      fridgeId,
      currentlyEditing ? currentlyEditing.id : null
    );
  
    let createdRecipe;
  
    if (currentlyEditing) {
      createdRecipe = await SmartFridgeAPI.getAPI().updateRecipe(newRecipeData);
  
      console.log("createdRecipe variable after Update ====>", createdRecipe);
  
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === createdRecipe.id ? createdRecipe : recipe
      );
  
      console.log("updatedRecipes variable after Update ====>", createdRecipe);
  
      this.setState({
        recipes: updatedRecipes,
        popupRecipeOpen: false,
        currentlyEditing: null,
      });
    } else {
      createdRecipe = await SmartFridgeAPI.getAPI().addRecipe(newRecipeData);
      const newRecipes = [
        ...recipes,
        {
          recipeId: createdRecipe.id,
          recipe_name: createdRecipe.recipe_name,
          duration: createdRecipe.duration,
          portion: createdRecipe.portion,
          instruction: createdRecipe.instruction,
          ingredients: createdRecipe.ingredients,
        },
      ];
      this.setState({
        recipes: newRecipes,
        popupRecipeOpen: false,
        currentlyEditing: null,
      });
    }
    this.loadRecipeList();
    return createdRecipe;
  };
  

  
  updateRecipe = (recipe) => {
    const updatedRecipes = this.state.recipes.map((e) => {
      if (recipe.recipeId === e.recipeId) {
        return recipe;
      }
      return e;
    });
    console.log("Recipe updated:", updatedRecipes);
    return updatedRecipes;
  };
  

  updateRecipe = (recipe) => {
    const updatedRecipes = this.state.recipes.map((e) => {
      if (recipe.recipeId === e.recipeId) {
        return recipe;
      }
      return e;
    });
    console.log("Recipe updated:", updatedRecipes);
    return updatedRecipes;
  };

  handleAvailableRecipes = () => {
    console.log("Verfügbare Rezepte");
    this.getRecipeContentByFridgeId();
  };

  render() {
    const {
      value,
      popupGroceryOpen,
      popupRecipeOpen,
      groceries,
      anchorEls,
      openMenus,
      currentlyEditing,
      recipes,
      isEditMode,
      householdName,
      showRecipeAlert,
    } = this.state;

    const { dialogOpen, dialogType } = this.props;
    const editingRecipe = currentlyEditing;

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: { xs: "100px", md: "200px" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              border: "none",
              width: { xs: "90%", md: "1100px" },
              height: "auto",
              padding: { xs: "0px 10px 30px 10px", md: "0px 50px 30px 50px" },
            }}
          >
            <Paper
              sx={{
                width: { xs: "100%", md: "1000px" },
                boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                backgroundColor: "background.default",
              }}
            >
              <FridgeSearchBar householdName={householdName} />
              <TabContext
                value={value}
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "row",
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={this.handleTabChange}
                    aria-label="Smart Fridge environment"
                    centered
                  >
                    <Tab
                      label="Kühlschrank"
                      value="1"
                      sx={{ width: { xs: "auto", md: "300px" } }}
                    />
                    <Tab
                      label="Rezepte"
                      value="2"
                      sx={{ width: { xs: "auto", md: "300px" } }}
                    />
                    <Tab
                      label="Verwaltung"
                      value="3"
                      sx={{ width: { xs: "auto", md: "300px" } }}
                    />
                  </TabList>
                </Box>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TabPanel
                    value="1"
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "baseline",
                      marginTop: "10px",
                      marginBottom: "-40px",
                      gap: "30px",
                      width: "100%",
                      maxWidth: "895px",
                    }}
                  >
                    <Link onClick={() => this.handlePopupGroceryOpen(false)}>
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
                            width: { xs: "150px", sm: "200px" },
                            height: { xs: "100px", sm: "125px" },
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
                              width: { xs: "50px", sm: "75px" },
                              height: "auto",
                              position: "absolute",
                            }}
                          />
                          <LoupeRoundedIcon
                            sx={{
                              width: { xs: "20px", sm: "30px" },
                              height: "auto",
                              transform: "scaleX(-1)",
                              position: "relative",
                              top: { xs: "-25px", sm: "-38px" },
                              left: { xs: "20px", sm: "33px" },
                            }}
                          />
                        </Paper>
                      </Tooltip>
                    </Link>
                    <Grocery
                      measureName={this.measureName}
                      groceryName={this.groceryName}
                      groceryStatement={this.groceryStatement}
                      getGroceryInFridgeId={this.getGroceryInFridgeId}
                      fridgeId={this.state.fridgeId}
                      groceries={groceries}
                      handleAnchorClick={this.handleAnchorClick}
                      handleAnchorClose={this.handleAnchorClose}
                      handleAnchorEdit={this.handleAnchorEdit}
                      anchorEls={anchorEls}
                      openMenus={openMenus}
                      setIdToDelete={this.setIdToDelete}
                      handleOpenDialog={this.props.handleOpenDialog}
                      groceryStatements={this.state.updatedGroceryStatements}
                    />
                  </TabPanel>
                  {popupGroceryOpen && (
                    <GroceryDialog
                      fridgeId={this.state.fridgeId}
                      isEditMode={isEditMode}
                      groceryName={
                        currentlyEditing ? currentlyEditing.grocery_name : ""
                      }
                      groceryQuantity={
                        currentlyEditing ? currentlyEditing.quantity : ""
                      }
                      groceryUnit={
                        currentlyEditing ? currentlyEditing.unit_name : ""
                      }
                      handlePopupGroceryClose={this.handlePopupGroceryClose}
                      handleCreateGroceries={this.handleCreateGroceries}
                      foodOptions={groceries.map((g) => g.groceryName)}
                      refreshGroceryList={this.refreshGroceryList}
                      curentGroceryId={
                        this.state.currentlyEditing
                          ? this.state.currentlyEditing.id
                          : null
                      }
                    />
                  )}
                  <DeleteConfirmationDialog
                    dialogOpen={dialogOpen}
                    dialogType={dialogType}
                    handleCloseDialog={this.props.handleCloseDialog}
                    handleConfirmDelete={this.handleConfirmDelete}
                  />
                </Container>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TabPanel
                    value="2"
                    sx={{
                      display: "flex",
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
                    }}
                  >
                    <Container sx={{ m: "0", p: "0" }}>
                      <Button
                        variant="text"
                        sx={{
                          border: "1px solid green",
                          fontSize: {
                            xs: "0.55rem",
                            sm: "0.8rem",
                            md: "0.8rem",
                            lg: "0.8rem",
                            xl: "0.9rem",
                          },
                          width: {
                            xs: "130px",
                            sm: "200px",
                            md: "200px",
                            lg: "200px",
                            xl: "200px",
                          },

                          boxShadow: "10px",
                          bgcolor: "primary.main",
                          color: "background.card",
                          fontWeight: "bold",
                          "&:hover": {
                            color: "success.dark",
                            backgroundColor: "success.gwhite",
                          },
                        }}
                        onClick={this.handleAvailableRecipes}
                      >
                        Verfügbare Rezepte
                      </Button>
                      <AlertComponent
                        showAlert={showRecipeAlert}
                        alertType="availableRecipes"
                        severity="info"
                        customMessage={this.state.availableRecipes}
                        onClose={() =>
                          this.setState({ showRecipeAlert: false })
                        }
                      />
                    </Container>

                    <Link onClick={() => this.handlePopupRecipeOpen(false)}>
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
                            width: { xs: "150px", sm: "200px" },
                            height: { xs: "100px", sm: "125px" },
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
                      handleAnchorClick={this.handleAnchorClick}
                      handleAnchorEdit={this.handleAnchorEdit}
                      handleAnchorClose={this.handleAnchorClose}
                      handleOpenDialog={this.props.handleOpenDialog}
                      setIdToDelete={this.setIdToDelete}
                      anchorEls={anchorEls}
                      openMenus={openMenus}
                      refreshGroceryList={this.refreshGroceryList}
                      showRecipeAlert={this.state.showRecipeAlert}
                    />
                  </TabPanel>
                  {popupRecipeOpen && (
                    <RecipeDialog
                      fridgeId={this.state.fridgeId}
                      isEditMode={isEditMode}
                      recipeId={currentlyEditing ? currentlyEditing.id : null}
                      recipeTitle={
                        editingRecipe ? editingRecipe.recipe_name : ""
                      }
                      recipeDuration={
                        editingRecipe ? editingRecipe.duration : ""
                      }
                      recipeServings={
                        editingRecipe ? editingRecipe.portion : ""
                      }
                      recipeInstructions={
                        editingRecipe ? editingRecipe.instruction : ""
                      }
                      recipeIngredients={
                        editingRecipe ? editingRecipe.ingredients : []
                      }
                      handlePopupRecipeClose={this.handlePopupRecipeClose}
                      handleCreateRecipes={this.handleCreateRecipes}
                      refreshRecipeList={this.loadRecipeList}
                    />
                  )}
                  <DeleteConfirmationDialog
                    dialogOpen={dialogOpen}
                    dialogType={dialogType}
                    handleCloseDialog={this.props.handleCloseDialog}
                    handleConfirmDelete={this.handleConfirmDelete}
                  />
                </Container>
                <Container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TabPanel
                    value="3"
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      flexWrap: "wrap",
                      justifyContent: "baseline",
                      marginTop: "10px",
                      marginLeft: "0px",
                      marginBottom: "0px",
                      gap: "30px",
                      width: "100%",
                      maxWidth: "895px",
                      position: "relative",
                      top: "-100px",
                    }}
                  >
                    <Settings fridgeId={this.state.fridgeId} />
                  </TabPanel>
                </Container>
              </TabContext>
            </Paper>
          </Box>
        </Box>
      </>
    );
  }
}

export default withRouter(FridgePage);
