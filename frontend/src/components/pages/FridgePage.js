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
// import Recipe from "../recipe/Recipe";
// import Grocery from "../grocery/Grocery";
// import PopupGrocery from "../grocery/PopupGrocery";
import FridgeSearchBar from "../FridgeSearchBar";
import AddGroceryPopup from "../grocery/AddGroceryPopup";

class FridgePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      popupOpen: false,
      showAlert: false,

      // Grocery Props
      groceryCount: 0,
      groceries: [],
      currentGrocery: "",
      currentGroceryQuantity: "",
      currentGroceryUnit: "",
      groceryUnit: ["g", "kg", "ml", "l", "Stück"],
      groceryIdToDelete: null,
      // Recipe Props

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
    this.setState({
      value: newValue,
    });
  }

  handlePopupOpen = () => {
    this.setState({
      popupOpen: true,
      currentlyEditing: null,
    });
  };

  handlePopupClose = () => {
    this.setState({
      popupOpen: false,
      currentlyEditing: null,
    });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showAlert: false,
    });
  };

  handleCreateGroceries = () => {
    const { currentGrocery, currentGroceryQuantity, currentGroceryUnit } =
      this.state;

    console.log(currentGrocery, currentGroceryQuantity, currentGroceryUnit);

    if (
      currentGrocery.trim() === "" ||
      currentGroceryQuantity.trim() === "" ||
      currentGroceryUnit.trim() === ""
    ) {
      this.setState({
        showAlert: true,
      });
      console.log("Grocery not created");
    } else {
      console.log("Grocery created");
      // Hier können Sie den Code zum Erstellen des neuen Grocery einfügen
      this.setState({
        popupOpen: false, // Popup schließen
        currentGrocery: "", // Eingabefelder zurücksetzen
        currentGroceryQuantity: "",
        currentGroceryUnit: "",
      });
    }
  };

  render() {
    const {
      value,
      popupOpen,
      showAlert,
      groceryUnit,
      currentGrocery,
      currentGroceryQuantity,
      currentGroceryUnit,
    } = this.state;

    const showAlertComponent = showAlert && (
      <Alert severity="error" sx={{ marginBottom: "20px" }}>
        Bitte füllen Sie alle Felder aus!
      </Alert>
    );

    const showPopupComponent = popupOpen && (
      <AddGroceryPopup
        handlePopupClose={this.handlePopupClose}
        showAlertComponent={showAlertComponent}
        groceryUnit={groceryUnit}
        handleCreateGroceries={this.handleCreateGroceries}
        currentGrocery={currentGrocery}
        currentGroceryQuantity={currentGroceryQuantity}
        currentGroceryUnit={currentGroceryUnit}
        handleChange={this.handleChange}
      />
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
                    <Link onClick={this.handlePopupOpen}>
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
                  {showPopupComponent}
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
                    <Link onClick={this.handlePopupOpen}>
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
