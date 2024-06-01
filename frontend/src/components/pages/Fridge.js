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
import PopupGrocery from "../grocery/PopupGrocery";
import FridgeSearchBar from "../FridgeSearchBar";
import PopupRecipe from "../recipe/PopupRecipe";

class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      popupOpen: false,
      groceryCount: 0,
      groceries: [],
      anchorEls: {},
      openMenus: {},
      currentNameGrocery: "",
      currentNameGrQuantity: "",
      currentNameGrUnit: "",
      currentlyEditing: null,
      dialogopen: false,
      groceryIdToDelete: null,
      groceryUnit: ["g", "kg", "ml", "l", "Stück"],
      groceryQuantity: null,

      recipeIdToDelete: null,
      recipesCount: 0,
      recipes: [],
      currentNameRecipe: "",
      currentNameReQuantity: "",
      currentNameReUnit: "",
      currentNameReDescription: "",

      showAlert: false,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  openPopup = () => {
    this.setState({
      popupOpen: true,
      currentlyEditing: null,
    });
  };

  closePopup = () => {
    this.setState({ popupOpen: false, currentlyEditing: null });
  };

  // handleChange = (event) => {
  //   this.setState({
  //     currentNameGrocery: event.target.value,
  //     currentNameGrUnit: event.target.value,
  //     currentNameGrQuantity: event.target.value,
  //     showAlert: false,
  //   });
  // };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  handleCreateGroceries = () => {
    const {
      currentNameGrocery,
      currentNameGrQuantity,
      currentNameGrUnit,
      currentlyEditing,
      groceries,
    } = this.state;

    if (
      currentNameGrocery.trim() === "" ||
      currentNameGrQuantity.trim() === "" ||
      currentNameGrUnit.trim() === ""
    ) {
      this.setState({ showAlert: true });
      console.log("Alarm");
      return;
    }

    if (currentlyEditing !== null) {
      // Edit existing household
      this.setState({
        groceries: this.updateGrocery({
          groceryId: currentlyEditing,
          groceryName: currentNameGrocery,
          groceryUnit: currentNameGrUnit,
          groceryQuantity: currentNameGrQuantity,
        }),
        popupOpen: false,
        currentNameGrocery: "",
        showAlert: false,
        currentlyEditing: null,
      });
    } else {
      // Create new household
      console.log("new grocery");
      const id = groceries.length + 1;
      console.log(id);
      this.setState((prevState) => {
        const newGrocery = [
          ...prevState.groceries,
          {
            groceryId: id,
            groceryName: currentNameGrocery,
            groceryUnit: currentNameGrUnit,
            groceryQuantity: currentNameGrQuantity,
          },
        ];
        console.log(newGrocery);
        const newOpenMenus = { ...prevState.openMenus, [id]: false };

        return {
          groceryCount: prevState.groceryCount + 1,
          popupOpen: false,
          groceries: newGrocery,
          currentNameGrocery: "",
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
    return updatedGroceries;
  }

  // handleCreateRecipes = (title) => {
  //   if (title.trim() === "") {
  //     this.setState({ showAlert: true });
  //   } else {
  //     this.setState((prevState) => ({
  //       recipesCount: prevState.recipesCount + 1,
  //       popupOpen: false,
  //       recipes: [...prevState.recipes, title],
  //       currentName: "",
  //       showAlert: false,
  //     }));
  //   }
  // };

  render() {
    const {
      value,
      groceries,
      recipes,
      popupOpen,
      showAlert,
      groceryUnit,
      groceryName,
      groceryQuantity,
      currentNameGrQuantity,
      currentNameGrUnit,
      currentNameGrocery,
    } = this.state;

    // const groceryBoxes = groceries.map((grocery, index) => (
    //   <Grocery currentNameGrocery={grocery.name} index={index} key={index} />
    // ));

    // const recipeBoxes = recipes.map((currentNameRecipe, index) => (
    //   <Recipe currentNameRecipe={currentNameRecipe} index={index} key={index} />
    // ));
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
                    <Link onClick={this.openPopup}>
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
                    {/* {groceryBoxes} */}
                  </TabPanel>
                  {popupOpen && (
                    <PopupGrocery
                      showAlert={showAlert}
                      handleCloseAlert={this.handleCloseAlert}
                      groceryUnit={groceryUnit}
                      groceryName={groceryName}
                      handleChange={this.handleChange}
                      handleCreateGroceries={this.handleCreateGroceries}
                      closePopup={this.closePopup}
                      showAlertComponent={showAlertComponent}
                      currentNameGrocery={currentNameGrocery}
                      currentNameGrQuantity={currentNameGrQuantity}
                      currentNameGrUnit={currentNameGrUnit}
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
                    <Link onClick={() => this.openPopup("recipe")}>
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
                    {/* {recipeBoxes} */}
                  </TabPanel>
                  {/* {popupOpen && (
                    <PopupRecipe
                      showAlert={showAlert}
                      handleCloseAlert={this.handleCloseAlert}
                      groceryUnit={groceryUnit}
                      handleChange={this.handleChange}
                      // handleCreateRecipes={this.handleCreateRecipes}
                      closePopup={this.closePopup}
                    />
                  )} */}
                </Container>
              </TabContext>
            </Paper>
          </Box>
        </Box>
      </>
    );
  }
}

export default Fridge;
