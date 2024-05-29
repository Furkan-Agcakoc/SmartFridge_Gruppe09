import React, { Component } from "react";
import { Paper, Tooltip, Tab, Box, Link, Container } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import FlatwareRoundedIcon from "@mui/icons-material/FlatwareRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";
import Recipe from "./Recipe";
import PopupRecipe from "./PopupRecipe";
import Grocerie from "./Grocerie";
import PopupGrocerie from "./PopupGrocerie";
import FridgeSearchBar from "./FridgeSearchBar";

class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      popupOpen: false,
      popupType: "",
      groceriesCount: 0,
      groceries: [],
      recipesCount: 0,
      recipes: [],
      currentName: "",
      showAlert: false,
      measurements: ["g", "kg", "ml", "l", "Stück"],
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  openPopup = (type) => {
    this.setState({
      popupOpen: true,
      popupType: type,
    });
  };

  closePopup = () => {
    this.setState({ popupOpen: false, showAlert: false });
  };

  handleCreateGroceries = (customMeasurement) => {
    if (this.state.currentName.trim() === "") {
      this.setState({ showAlert: true });
    } else {
      const newGrocerie = {
        name: this.state.currentName,
        measurement: customMeasurement,
      };
      this.setState((prevState) => ({
        groceriesCount: prevState.groceriesCount + 1,
        popupOpen: false,
        groceries: [...prevState.groceries, newGrocerie],
        currentName: "",
        showAlert: false,
      }));
    }
  };

  handleCreateRecipes = (title) => {
    if (title.trim() === "") {
      this.setState({ showAlert: true });
    } else {
      this.setState((prevState) => ({
        recipesCount: prevState.recipesCount + 1,
        popupOpen: false,
        recipes: [...prevState.recipes, title],
        currentName: "",
        showAlert: false,
      }));
    }
  };

  handleChange = (event) => {
    this.setState({
      currentName: event.target.value,
      showAlert: false,
    });
  };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const {
      value,
      groceries,
      recipes,
      popupOpen,
      showAlert,
      measurements,
      popupType,
    } = this.state;

    const groceryBoxes = groceries.map((grocerie, index) => (
      <Grocerie currentName={grocerie.name} index={index} key={index} />
    ));

    const recipeBoxes = recipes.map((currentName, index) => (
      <Recipe currentName={currentName} index={index} key={index} />
    ));

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
                    <Link onClick={() => this.openPopup("grocerie")}>
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
                    {groceryBoxes}
                  </TabPanel>
                  {popupOpen && popupType === "grocerie" && (
                    <PopupGrocerie
                      showAlert={showAlert}
                      handleCloseAlert={this.handleCloseAlert}
                      measurements={measurements}
                      handleChange={this.handleChange}
                      handleCreateGroceries={this.handleCreateGroceries}
                      closePopup={this.closePopup}
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
                    {recipeBoxes}
                  </TabPanel>
                  {popupOpen && popupType === "recipe" && (
                    <PopupRecipe
                      showAlert={showAlert}
                      handleCloseAlert={this.handleCloseAlert}
                      measurements={measurements}
                      handleChange={this.handleChange}
                      handleCreateRecipes={this.handleCreateRecipes}
                      closePopup={this.closePopup}
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

export default Fridge;
