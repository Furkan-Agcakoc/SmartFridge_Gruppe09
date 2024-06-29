import React, { Component } from "react";
import { Paper, Tooltip, Tab, Box, Link, Container, Chip } from "@mui/material";
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
import { useParams } from "react-router-dom";

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
      recipes: [],
      recipeIdToDelete: null,
      dialogopen: false,
      chipColor: null,
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
    const { householdId } = this.props.params; // HouseholdId aus den Props ziehen
    this.setState({ householdId });
    // console.log("HouseholdId von FridgePage", householdId);
    this.getFridgeByHouseholdId(householdId);
    this.getHouseholdNameById(householdId); // Den Haushaltsnamen laden
    // this.getGroceries(); // Lebensmittel laden
    this.getGroceryInFridgeId(householdId);
  }

  componentDidUpdate() {
    // console.log("Geändert", this.state.fridgeId);
  }
  // #####################APIS###########################

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
      console.log("updatedGroceryStatements ===>", updatedGroceryStatements);
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
    await this.getGroceryInFridgeId(fridgeId);
  };

  // #######################NO APIS###############################




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
        console.log("HouseholdID", householdID);

        // Extrahiere die fridge_id aus der Antwort und speichere sie in einer Variablen
        const fridgeId = response.id;

        // Logge die fridge_id zur Überprüfung

        // Aktualisiere den Zustand mit der fridge_id
        this.setState({ fridgeId: fridgeId });
        return fridgeId;
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
    console.log("Grocery-Popup opened");
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
    const { currentlyEditing, groceries } = this.state;

    if (currentlyEditing !== null) {
      const currentGrocery = groceries.find(
        (grocery) => grocery.groceryId === currentlyEditing
      );

      // Überprüfen, ob sich der Name oder die Menge geändert haben
      if (
        currentGrocery.groceryName === groceryData.name &&
        currentGrocery.groceryQuantity === groceryData.quantity &&
        currentGrocery.groceryUnit === groceryData.unit
      ) {
        this.setState({
          popupGroceryOpen: false,
          currentlyEditing: null,
        });
        return;
      }

      // Finden des Indexes eines existierenden Lebensmittels mit dem neuen Namen
      const existingGroceryIndex = groceries.findIndex(
        (grocery) => grocery.groceryName === groceryData.name
      );

      const updatedGroceries = groceries
        .map((grocery, index) => {
          if (grocery.groceryId === currentlyEditing) {
            if (existingGroceryIndex !== -1 && existingGroceryIndex !== index) {
              // Menge zum existierenden Lebensmittel addieren
              groceries[existingGroceryIndex].groceryQuantity =
                parseFloat(groceries[existingGroceryIndex].groceryQuantity) +
                parseFloat(groceryData.quantity);
              return null; // Mark for deletion
            } else {
              // Aktualisieren des bearbeiteten Lebensmittels
              return {
                ...grocery,
                groceryName: groceryData.name,
                groceryQuantity: groceryData.quantity,
                groceryUnit: groceryData.unit,
              };
            }
          }
          return grocery;
        })
        .filter((grocery) => grocery !== null); // Entfernen des markierten Lebensmittels

      this.setState({
        groceries: updatedGroceries,
        popupGroceryOpen: false,
        currentlyEditing: null,
      });
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

  handleAnchorEdit = (Id) => {
    console.log("Editing:", Id);
    this.setState(
      (prevState) => {
        const newOpenMenus = {
          ...prevState.openMenus,
          [Id]: false,
        };
        console.log(newOpenMenus);
        return {
          currentlyEditing: Id,
          openMenus: newOpenMenus,
          popupGroceryOpen: prevState.value === "1",
          popupRecipeOpen: prevState.value === "2",
        };
      },
      () => {
        if (this.state.value === "1") {
          this.handlePopupGroceryOpen(true, Id);
        } else if (this.state.value === "2") {
          this.handlePopupRecipeOpen(true, Id);
        }
      }
    );
  };

  handleAnchorDelete(Id) {
    console.log("Deleting ID:", Id);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [Id]: false };

      if (prevState.value === "1") {
        const newGroceries = prevState.groceries.filter(
          (g) => g.groceryId !== Id
        );
        return {
          groceries: newGroceries,
          openMenus: newOpenMenus,
        };
      } else if (prevState.value === "2") {
        const newRecipes = prevState.recipes.filter((r) => r.recipeId !== Id);
        return {
          recipes: newRecipes,
          openMenus: newOpenMenus,
        };
      }

      return { openMenus: newOpenMenus };
    });
  }

  handleConfirmDelete() {
    const { groceryIdToDelete, recipeIdToDelete, value } = this.state;
    console.log("App => Confirm delete");
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
    console.log("Recipe-Popup openedd");
    this.setState({
      popupRecipeOpen: true,
      isEditMode,
      currentlyEditing: recipe,
    });
  };

  handlePopupRecipeClose = () => {
    console.log("Recipe-Popup closed recipe recipe");
    this.setState({
      popupRecipeOpen: false,
      currentlyEditing: null,
    });
  };

  // handleAddGrocery = async () => {
  //   try {
  //     const groceryId = await this.getGroceryByName();
  //     const measureId = await this.getMeasureByName();
  //     await this.addGroceryStatement(groceryId, measureId);
  //   } catch (error) {
  //     console.error("Error in handleAddGrocery:", error);
  //   }
  // };

  // addGrocery = (newGroceryName) => {
  //   const { fridgeId } = this.state;
  //   const newGrocery = new GroceryBO(newGroceryName, fridgeId);

  //   SmartFridgeAPI.getAPI()
  //     .addGrocery(newGrocery)
  //     .then((grocery) => {
  //       this.setState((prevState) => ({
  //         foodOptions: [...prevState.foodOptions, grocery.getGroceryName()],
  //       }));
  //     });
  // };


  handleCreateRecipes = async (recipeData) => {
    console.log('Recipe Data after filling in FridgePage ===>', recipeData);
    const { currentlyEditing, recipes, fridgeId } = this.state;
    const userId = this.context.id;

    const {ingredients, groceryUnit, ...rest} = recipeData

    const newRecipeData = {
      ...rest,
      fridge_id: fridgeId,
      user_id: userId,
      id: 0
    }

    console.log('newRecipeData after filling in FridgePage ===>', newRecipeData);


    await SmartFridgeAPI.getAPI().addRecipe(newRecipeData)

    if (currentlyEditing !== null) {
      const updatedRecipes = this.updateRecipe({
        recipeId: currentlyEditing,
        recipeTitle: recipeData.title,
        recipeDuration: recipeData.duration,
        recipeServings: recipeData.servings,
        recipeInstructions: recipeData.instructions,
        recipeIngredients: recipeData.ingredients,
      });

      this.setState({
        recipes: updatedRecipes,
        popupRecipeOpen: false,
        currentlyEditing: null,
      });
    } else {
      const id = recipes.length + 1;

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

        return {
          recipeCount: prevState.recipeCount + 1,
          popupRecipeOpen: false,
          recipes: newRecipes,
          openMenus: newOpenMenus,
        };
      });
      console.log("Hier sind alle Rezepte ", recipes);
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

  handleAvailableRecipes = () => {
    this.setState({ chipColor: "primary.dark" });
    console.info("Available recipes clicked.");
  };

  handleAllRecipes = () => {
    this.setState({ chipColor: null });
    console.info("All recipes deleted.");
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
      chipColor,
      householdName,
    } = this.state;

    const { dialogOpen, dialogType } = this.props;

    const editingGrocery = currentlyEditing
      ? groceries.find((g) => g.groceryId === currentlyEditing)
      : null;

    const editingRecipe = currentlyEditing
      ? recipes.find((r) => r.recipeId === currentlyEditing)
      : null;

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: "200px",
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
            }}
          >
            <Paper
              sx={{
                width: "1000px",
                boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                backgroundColor: "background.default",
              }}
            >
              <FridgeSearchBar householdName={householdName} />
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
                    aria-label="Smart Fridge environment"
                    centered
                  >
                    <Tab
                      label="Kühlschrank"
                      value="1"
                      sx={{ width: "300px" }}
                    />
                    <Tab label="Rezepte" value="2" sx={{ width: "300px" }} />
                    <Tab label="Verwaltung" value="3" sx={{ width: "300px" }} />
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
                      flexDirection: "row",
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
                      measureName={this.measureName}
                      groceryName={this.groceryName}
                      groceryStatement={this.groceryStatement}
                      getGroceryInFridgeId={this.getGroceryInFridgeId} // Neue Prop hinzufügen
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
                        editingGrocery ? editingGrocery.groceryName : ""
                      }
                      groceryQuantity={
                        editingGrocery ? editingGrocery.groceryQuantity : ""
                      }
                      groceryUnit={
                        editingGrocery ? editingGrocery.groceryUnit : ""
                      }
                      handlePopupGroceryClose={this.handlePopupGroceryClose}
                      handleCreateGroceries={this.handleCreateGroceries}
                      foodOptions={groceries.map((g) => g.groceryName)} // pass foodOptions to GroceryDialog
                      refreshGroceryList={this.refreshGroceryList}
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
                    }}
                  >
                    <Container sx={{ m: "0", p: "0" }}>
                      <Chip
                        label="VERFÜGBARE REZEPTE"
                        sx={{
                          width: "200px",
                          position: "relative",
                          left: "-25px",
                          top: "-10px",
                          m: "0",
                          boxShadow: "10px",
                          bgcolor: chipColor,
                          color: "background.card",
                          fontWeight: "bold",
                          "&:hover": {
                            color: "success.dark",
                            backgroundColor: "success.gwhite",
                          },
                        }}
                        onClick={this.handleAvailableRecipes}
                        onDelete={this.handleAllRecipes}
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
                      handleAnchorClick={this.handleAnchorClick}
                      handleAnchorEdit={this.handleAnchorEdit}
                      handleAnchorClose={this.handleAnchorClose}
                      handleOpenDialog={this.props.handleOpenDialog}
                      setIdToDelete={this.setIdToDelete}
                      anchorEls={anchorEls}
                      openMenus={openMenus}
                    />
                  </TabPanel>
                  {popupRecipeOpen && (
                    <RecipeDialog
                      isEditMode={isEditMode}
                      recipeTitle={
                        editingRecipe ? editingRecipe.recipeTitle : ""
                      }
                      recipeDuration={
                        editingRecipe ? editingRecipe.recipeDuration : ""
                      }
                      recipeServings={
                        editingRecipe ? editingRecipe.recipeServings : ""
                      }
                      recipeInstructions={
                        editingRecipe ? editingRecipe.recipeInstructions : ""
                      }
                      recipeIngredients={
                        editingRecipe ? editingRecipe.recipeIngredients : ""
                      }
                      handlePopupRecipeClose={this.handlePopupRecipeClose}
                      handleCreateRecipes={this.handleCreateRecipes}
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
                      top: "-100px",
                    }}
                  >
                    <Settings />
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
