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
import FridgeBar from "../FridgeBar";
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
      allRecipes: [], // Alle Rezepte werden hier gespeichert
      recipes: [], // Rezepte, die im Kühlschrank enthalten sind, werden hier gespeichert
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
      ownerName: "",
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.setIdToDelete = this.setIdToDelete.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleAnchorDelete = this.handleAnchorDelete.bind(this);
  }

  // Komponenten-Lebenszyklusmethode zum Laden der Anfangsdaten
  componentDidMount() {
    const { householdId, fridgeId } = this.props.params;
    this.setState({ householdId, fridgeId }, () => {
      this.getFridgeByHouseholdId(householdId);
      this.getHouseholdNameById(householdId);
      this.getGroceryInFridgeId(householdId);
      this.loadRecipeList();
    });
  }

  // Komponenten-Lebenszyklusmethode zum Aktualisieren der Daten, wenn sich die fridgeId ändert
  componentDidUpdate(prevProps, prevState) {
    if (prevState.fridgeId !== this.state.fridgeId) {
      this.loadRecipeList();
    }
  }

  // Alle Rezepte laden
  loadRecipeList = async () => {
    try {
      const allRecipes = await SmartFridgeAPI.getAPI().getRecipe();
      this.setState({ allRecipes });

      const { fridgeId } = this.state;
      if (fridgeId) {
        this.loadRecipeByFridgeId(fridgeId);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Rezepte:", error);
    }
  };

  // Rezepte nach Kühlschrank-ID laden
  loadRecipeByFridgeId = (fridgeId) => {
    SmartFridgeAPI.getAPI()
      .getRecipeByFridgeId(fridgeId)
      .then((recipes) => {
        this.setState({ recipes });
      })
      .catch((error) => {
        console.error(
          "Fehler beim Abrufen der Rezepte nach Kühlschrank-ID:",
          error
        );
      });
  };

  // Lebensmittel im Kühlschrank nach Kühlschrank-ID abrufen
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
              grocery_name: grocery?.grocery_name ?? "Unbekannt",
              unit_name: measure?.unit ?? "Unbekannt",
            };
          } catch (error) {
            console.error(
              "Fehler beim Verarbeiten der Aussage:",
              statement,
              error
            );
            return {
              ...statement,
              grocery_name: "Unbekannt",
              unit_name: "Unbekannt",
            };
          }
        })
      );
      this.setState({ updatedGroceryStatements });
    } catch (error) {
      console.error("Fehler beim Abrufen der Lebensmittelangaben:", error);
    }
  };

  // Lebensmittel nach ID abrufen
  getGroceryById = async (groceryId) => {
    try {
      const grocery = await SmartFridgeAPI.getAPI().getGroceryById(groceryId);
      return grocery;
    } catch (error) {
      console.error("Fehler beim Abrufen des Lebensmittels:", error);
    }
  };

  // Einheit nach ID abrufen
  getMeasureById = async (measureId) => {
    try {
      const measure = await SmartFridgeAPI.getAPI().getMeasureById(measureId);
      return measure;
    } catch (error) {
      console.error("Fehler beim Abrufen der Einheit:", error);
    }
  };

  // Die Lebensmittelliste aktualisieren
  refreshGroceryList = async () => {
    const { fridgeId } = this.state;
    this.setState({
      showRecipeAlert: false,
    });
    await this.getGroceryInFridgeId(fridgeId);
  };

  // Rezeptinhalt nach Kühlschrank-ID abrufen
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

  // Menge aus der Lebensmittelangabe extrahieren
  groceryStatement(statement) {
    const quantity = statement.map((statement) => statement.quantity);
    return quantity;
  }

  getHouseholdNameById = (householdId) => {
    SmartFridgeAPI.getAPI()
      .getHouseholdById(householdId)
      .then((households) => {
        const household = households[0];
        this.setState({
          householdName: household.household_name,
          ownerId: household.owner_id,
        });
        return household.owner_id;
      })
      .then((ownerId) =>
        SmartFridgeAPI.getAPI()
          .getUserById(ownerId)
          .then((users) => {
            const user = users[0];
            this.setState({ ownerName: user.firstname });
          })
      )
      .catch((error) => {
        console.error(
          "Fehler beim Abrufen des Haushaltsnamens oder Benutzers:",
          error
        );
      });
  };

  // Kühlschrank nach Haushalts-ID abrufen
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
        console.error(
          "Fehler beim Abrufen des Kühlschranks nach Haushalts-ID:",
          error
        );
      });
  };

  // Tab-Wechsel handhaben
  handleTabChange(event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  // Lebensmittel-Popup öffnen
  handlePopupGroceryOpen = (isEditMode = false, grocery = null) => {
    this.setState({
      popupGroceryOpen: true,
      isEditMode,
      currentlyEditing: grocery,
    });
  };

  // Lebensmittel-Popup schließen
  handlePopupGroceryClose = () => {
    this.setState({
      popupGroceryOpen: false,
      currentlyEditing: null,
    });
  };

  // Lebensmittel erstellen oder aktualisieren
  handleCreateGroceries = (groceryData) => {
    const { currentlyEditing, groceries, updatedGroceryStatements } =
      this.state;

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

      this.setState({
        groceries: updatedGroceries,
        popupGroceryOpen: false,
        currentlyEditing: null,
      });
    } else {
      // Neues Lebensmittel hinzufügen, wenn nicht im Bearbeitungsmodus
      const existingGrocery = groceries.find(
        (grocery) => grocery.groceryName === groceryData.name
      );

      if (existingGrocery) {
        // Menge zum vorhandenen Lebensmittel hinzufügen
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

  // Lebensmittelzustand aktualisieren
  updateGrocery = (grocery) => {
    const updatedGroceries = this.state.groceries.map((e) => {
      if (grocery.groceryId === e.groceryId) {
        return grocery;
      }
      return e;
    });
    return updatedGroceries;
  };

  // Ankerklick für Menüs handhaben
  handleAnchorClick = (Id, event) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [Id]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [Id]: event.target,
      };
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  // Anker schließen für Menüs
  handleAnchorClose = (Id) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [Id]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  // Zutaten für ein Rezept abrufen
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
              grocery_name: grocery?.grocery_name ?? "Unbekannt",
              unit_name: measure?.unit ?? "Unbekannt",
            };
          }
        );
        const detailedIngredientsResults = await Promise.all(
          detailedIngredientsPromises
        );
        return detailedIngredientsResults;
      } catch (error) {
        console.error("Fehler beim Abrufen der Zutaten:", error);
        return [];
      }
    } else {
      console.error("Rezept oder Rezept-ID ist undefiniert");
      return [];
    }
  };

  // Anker bearbeiten für Lebensmittel oder Rezept
  handleAnchorEdit = async (Id) => {
    const grocery = this.state.updatedGroceryStatements.find(
      (g) => g.id === Id
    );
    const recipe = this.state.recipes.find((g) => g.id === Id);

    if (recipe) {
      const ingredients = await this.fetchIngredients(Id);

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

  // Lebensmittelangabe löschen
  deleteGroceryStatement = async (groceryStatementID) => {
    try {
      await SmartFridgeAPI.getAPI().deleteGroceryStatement(groceryStatementID);
      this.setState((prevState) => ({
        updatedGroceryStatements: prevState.updatedGroceryStatements.filter(
          (statement) => statement.id !== groceryStatementID
        ),
      }));
    } catch (error) {
      console.error("Fehler beim Löschen der Lebensmittelangabe:", error);
    }
  };

  // Rezept löschen
  deleteRecipe = async (recipeID) => {
    try {
      const groceryStatementsPromise =
        await SmartFridgeAPI.getAPI().getGroceryInRecipeId(recipeID);
      const groceryStatements = await groceryStatementsPromise;

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
      console.error("Fehler beim Löschen des Rezepts:", error);
    }
  };

  // Anker löschen für Lebensmittel oder Rezept
  handleAnchorDelete = async (Id) => {
    try {
      if (this.state.value === "1") {
        await this.deleteGroceryStatement(Id);
      } else if (this.state.value === "2") {
        await this.deleteRecipe(Id);
      }
    } catch (error) {
      console.error("Fehler beim Löschen des Elements:", error);
    }
  };

  // Bestätigen der Löschung von Lebensmitteln oder Rezept
  handleConfirmDelete() {
    const { groceryIdToDelete, recipeIdToDelete, value } = this.state;

    if (value === "1" && groceryIdToDelete !== null) {
      this.handleAnchorDelete(groceryIdToDelete);
    } else if (value === "2" && recipeIdToDelete !== null) {
      this.handleAnchorDelete(recipeIdToDelete);
    }
  }

  // Zu löschende ID für Lebensmittel oder Rezept festlegen
  setIdToDelete(Id) {
    this.setState((prevState) => ({
      groceryIdToDelete: prevState.value === "1" ? Id : null,
      recipeIdToDelete: prevState.value === "2" ? Id : null,
    }));
  }

  // Rezept-Popup öffnen
  handlePopupRecipeOpen = (isEditMode = false, recipe = null) => {
    this.setState({
      popupRecipeOpen: true,
      isEditMode,
      currentlyEditing: recipe,
      showRecipeAlert: false,
    });
  };

  // Rezept-Popup schließen
  handlePopupRecipeClose = () => {
    this.setState({
      popupRecipeOpen: false,
      currentlyEditing: null,
    });
  };

  // Rezepte erstellen oder aktualisieren
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

      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === createdRecipe.id ? createdRecipe : recipe
      );

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

  // Rezeptzustand aktualisieren
  updateRecipe = (recipe) => {
    const updatedRecipes = this.state.recipes.map((e) => {
      if (recipe.recipeId === e.recipeId) {
        return recipe;
      }
      return e;
    });
    return updatedRecipes;
  };

  // Verfügbare Rezepte handhaben
  handleAvailableRecipes = () => {
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
      ownerName,
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
              <FridgeBar householdName={householdName} ownerName={ownerName} />
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
                      justifyContent: "flex-start",
                      marginTop: "10px",
                      marginBottom: "0px",
                      px: "0px",
                      gap: "25px",
                      width: {
                        xs: "120%",
                        sm: "90%",
                        md: "895px",
                        lg: "895px",
                        xl: "100%",
                      },
                    }}
                  >
                    <Container
                      sx={{
                        display: { xs: "flex" },
                        justifyContent: { xs: "flex-start" },
                        alignItems: { xs: "center" },
                        flexWrap: { xs: "wrap" },
                        px: { xs: "0px" },
                        gap: { xs: "25px" },
                        width: { xs: "329px", sm: "85%", md: "80%", xl: "93%" },
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
                              width: { xs: "150px", sm: "175px", md: "200px" },
                              height: { xs: "100px", sm: "110px", md: "125px" },
                              borderRadius: "10px",
                              backgroundColor: "background.paper",
                              color: "primary.main",
                              "&:hover": {
                                color: "success.dark",
                                boxShadow:
                                  "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                                backgroundColor: "success.gwhite",
                              },
                            }}
                          >
                            <KitchenRoundedIcon
                              sx={{
                                width: { xs: "50px", sm: "60px", md: "75px" },
                                height: "auto",
                                position: "absolute",
                              }}
                            />
                            <LoupeRoundedIcon
                              sx={{
                                width: { xs: "20px", sm: "25px", md: "30px" },
                                height: "auto",
                                transform: "scaleX(-1)",
                                position: "relative",
                                top: { xs: "-25px", sm: "-30px", md: "-38px" },
                                left: { xs: "23px", sm: "28px", md: "34px" },
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
                    </Container>
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
                      groceryStatements={this.state.updatedGroceryStatements}
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
                      justifyContent: "flex-start",
                      marginTop: "10px",
                      marginBottom: "0px",
                      px: "0px",
                      gap: "25px",
                      width: {
                        xs: "120%",
                        sm: "90%",
                        md: "895px",
                        lg: "895px",
                        xl: "100%",
                      },
                      position: "relative",
                      top: "-75px",
                    }}
                  >
                    <Container
                      sx={{
                        display: { xs: "flex" },
                        justifyContent: { xs: "flex-start" },
                        alignItems: { xs: "center" },
                        flexWrap: { xs: "wrap" },
                        px: { xs: "0px" },
                        gap: { xs: "25px" },
                        width: {
                          xs: "329px",
                          sm: "85%",
                          md: "80%",
                          xl: "93%",
                        },
                      }}
                    >
                      <Button
                        variant="text"
                        sx={{
                          px: "0px",
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
                          m: "0px",
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
                    <Container
                      sx={{
                        display: { xs: "flex" },
                        justifyContent: { xs: "flex-start" },
                        alignItems: { xs: "center" },
                        flexWrap: { xs: "wrap" },
                        px: { xs: "0px" },
                        gap: { xs: "25px" },
                        width: {
                          xs: "329px",
                          sm: "85%",
                          md: "80%",
                          xl: "93%",
                        },
                      }}
                    >
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
                              width: {
                                xs: "150px",
                                sm: "175px",
                                md: "200px",
                              },
                              height: {
                                xs: "100px",
                                sm: "110px",
                                md: "125px",
                              },
                              borderRadius: "10px",
                              backgroundColor: "background.paper",
                              color: "primary.main",
                              "&:hover": {
                                color: "success.dark",
                                boxShadow:
                                  "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                                backgroundColor: "success.gwhite",
                              },
                            }}
                          >
                            <ImportContactsRoundedIcon
                              sx={{
                                width: { xs: "50px", sm: "60px", md: "75px" },
                                height: "auto",
                                position: "absolute",
                              }}
                            />
                            <LoupeRoundedIcon
                              sx={{
                                width: { xs: "20px", sm: "25px", md: "30px" },
                                height: "auto",
                                transform: "scaleX(-1)",
                                position: "relative",
                                top: {
                                  xs: "-20px",
                                  sm: "-24px",
                                  md: "-30px",
                                },
                                left: { xs: "35px", sm: "45px", md: "54px" },
                              }}
                            />
                            <FlatwareRoundedIcon
                              sx={{
                                width: { xs: "15px", sm: "20px", md: "25px" },
                                height: "auto",
                                position: "relative",
                                top: { xs: "1px", sm: "1.5px", md: "2px" },
                                left: {
                                  xs: "-0.5px",
                                  sm: "-0.75px",
                                  md: "-1px",
                                },
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
                    </Container>
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
                    <Settings
                      fridgeId={this.state.fridgeId}
                      refreshGroceryList={this.refreshGroceryList}
                      householdId={this.state.householdId}
                      userId={this.context.id}
                    />
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
