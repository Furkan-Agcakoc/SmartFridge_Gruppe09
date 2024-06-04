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
import Grocery from "../grocery/Grocery";
// import PopupGrocery from "../grocery/PopupGrocery";
import FridgeSearchBar from "../FridgeSearchBar";
import AddGroceryPopup from "../grocery/AddGroceryPopup";
import EditGroceryPopup from "../grocery/EditGroceryPopup";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";

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
      recipeCount: 0,
      recipes: [],
      currentRecipe: "",
      
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

  handlePopupOpen = () => {
    console.log("Popup opened");
    this.setState({
      popupOpen: true,
      currentlyEditing: null,
    });
  };

  handlePopupClose = () => {
    console.log("Popup closed");
    this.setState({
      popupOpen: false,
      currentlyEditing: null,
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

  handleClickOpenDialog = (groceryId) => {
    console.log("Dialog opened for grocery ID:", groceryId);
    this.setState({
      dialogopen: true,
      groceryIdToDelete: groceryId,
    });
    this.handleAnchorClose(groceryId);
  };

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

  handleCreateGroceries = () => {
    const {
      currentGrocery,
      currentGroceryQuantity,
      currentGroceryUnit,
      groceries,
      currentlyEditing,
    } = this.state;

    console.log(
      "Creating grocery:",
      currentGrocery,
      currentGroceryQuantity,
      currentGroceryUnit
    );

    if (
      currentGrocery.trim() === "" ||
      currentGroceryQuantity.trim() === "" ||
      currentGroceryUnit.trim() === ""
    ) {
      this.setState({
        showAlert: true,
      });
      console.log("Grocery not created");
      return;
    }

    if (currentlyEditing !== null) {
      console.log("Editing grocery ID:", currentlyEditing);
      // Edit existing grocery
      this.setState({
        groceries: this.updateGrocery({
          groceryId: currentlyEditing,
          groceryName: currentGrocery,
          groceryQuantity: currentGroceryQuantity,
          groceryUnit: currentGroceryUnit,
        }),
        popupOpen: false,
        currentGrocery: "",
        currentGroceryQuantity: "",
        currentGroceryUnit: "",
        showAlert: false,
        currentlyEditing: null,
      });
    } else {
      const id = groceries.length + 1;
      console.log("Grocery created");
      // Hier können Sie den Code zum Erstellen des neuen Grocery einfügen
      this.setState((prevState) => {
        const newGroceries = [
          ...prevState.groceries,
          {
            groceryId: id,
            groceryName: currentGrocery,
            groceryQuantity: currentGroceryQuantity,
            groceryUnit: currentGroceryUnit,
          },
        ];
        const newOpenMenus = { ...prevState.openMenus, [id]: false };
        console.log(newGroceries);
        console.log(newOpenMenus);

        return {
          groceryCount: prevState.groceryCount + 1,
          popupOpen: false,
          groceries: newGroceries,
          currentGrocery: "",
          currentGroceryQuantity: "",
          currentGroceryUnit: "",
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
        currentGrocery: grocery.groceryName,
        currentGroceryQuantity: grocery.groceryQuantity,
        currentGroceryUnit: grocery.groceryUnit,
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
      popupOpen,
      showAlert,
      groceryUnit,
      currentGrocery,
      currentGroceryQuantity,
      currentGroceryUnit,
      groceries,
      anchorEls,
      openMenus,
      currentlyEditing,
      dialogopen,
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
                    <Grocery
                      groceries={groceries}
                      handleAnchorClick={this.handleAnchorClick}
                      handleAnchorClose={this.handleAnchorClose}
                      handleAnchorEdit={this.handleAnchorEdit}
                      handleClickOpenDialog={this.handleClickOpenDialog}
                      anchorEls={anchorEls}
                      openMenus={openMenus}
                    ></Grocery>
                  </TabPanel>
                  {popupOpen && (
                    <AddGroceryPopup
                      handlePopupClose={this.handlePopupClose}
                      showAlertComponent={showAlertComponent}
                      groceryUnit={this.state.groceryUnit}
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
                      handlePopupClose={this.handlePopupClose}
                      showAlert={showAlert}
                      groceryUnit={groceryUnit}
                      currentGrocery={currentGrocery}
                      currentGroceryQuantity={currentGroceryQuantity}
                      currentGroceryUnit={currentGroceryUnit}
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
                    {/* <Recipe></Recipe> */}
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
