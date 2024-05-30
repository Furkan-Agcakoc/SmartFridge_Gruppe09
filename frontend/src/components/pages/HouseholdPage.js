import React, { Component } from "react";
import TitleHH from "../TitleHousehold";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import Tooltip from "@mui/material/Tooltip";
import PopupSignin from "../PopupSignin";
import PopupHousehold from "../PopupHousehold";
import EditHouseholdPopup from "../EditHouseholdPopup";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
import HouseholdAnchor from "../HouseholdAnchor";

class Household extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      householdCount: 0,
      households: [],
      currentName: "",
      firstName: "",
      lastName: "",
      nickname: "",
      showAlert: false,
      anchorEls: {},
      openMenus: {},
      currentlyEditing: null,
      dialogopen: false,
      householdIdToDelete: null, // New state to store householdId
      showSigninPopup: true
    };

    this.emails = [
      "furkana.gs2002@gmail.com",
      "meayavuz@gmail.com",
      "baran2323a@gmail.com",
      "derzockerlp63@gmail.com",
      "sead.shat@gmail.com",
    ];
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

  handleChange = (event) => {
    this.setState({
      currentName: event.target.value,
      showAlert: false,
    });
  };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  handleClickOpenDialog = (householdId) => {
    this.setState({
      dialogopen: true,
      householdIdToDelete: householdId,
    });
    this.handleAnchorClose(householdId);
  };

  handleCloseDialog = () => {
    this.setState({ dialogopen: false });
  };

  handleConfirmDelete = () => {
    const { householdIdToDelete } = this.state;
    if (householdIdToDelete !== null) {
      this.handleAnchorDelete(householdIdToDelete);
    }
    this.handleCloseDialog();
  };

  // handleSubmitNames = () => {
  //   const { firstName, lastName, nickname} = this.state;

  //   if (firstName.trim() === "" || lastName.trim() === "" || nickname.trim() === "") {
  //     this.setState({ showAlert: true });
  //     return;
  //   }
  // }

  handleCreateHousehold = () => {
    const { currentName, currentlyEditing, households } = this.state;

    if (currentName.trim() === "") {
      this.setState({ showAlert: true });
      return;
    }

    if (currentlyEditing !== null) {
      // Edit existing household
      this.setState({
        households: this.updateHousehold({
          householdId: currentlyEditing,
          householdName: currentName,
          emails: [],
        }),
        popupOpen: false,
        currentName: "",
        showAlert: false,
        currentlyEditing: null,
      });
    } else {
      // Create new household
      const id = households.length + 1;

      this.setState((prevState) => {
        const newHouseholds = [
          ...prevState.households,
          {
            householdId: id,
            householdName: currentName,
            emails: [],
          },
        ];
        const newOpenMenus = { ...prevState.openMenus, [id]: false };

        return {
          householdCount: prevState.householdCount + 1,
          popupOpen: false,
          households: newHouseholds,
          currentName: "",
          showAlert: false,
          openMenus: newOpenMenus,
        };
      });
    }
  };

  updateHousehold(household) {
    const updatedHouseholds = this.state.households.map((e) => {
      if (household.householdId === e.householdId) {
        return household;
      }
      return e;
    });
    return updatedHouseholds;
  }

  handleAnchorClick = (householdId, event) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [householdId]: event.target,
      };
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorClose = (householdId) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorEdit = (household) => {
    this.setState((prevState) => {
      const newOpenMenus = {
        ...prevState.openMenus,
        [household.householdId]: false,
      };
      return {
        currentlyEditing: household.householdId,
        currentName: household.householdName,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorDelete = (householdId) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
      const newHouseholds = prevState.households.filter(
        (h) => h.householdId !== householdId
      );
      return {
        households: newHouseholds,
        openMenus: newOpenMenus,
      };
    });
  };

  closeSigninPopup = () => {
    this.setState({ showSigninPopup: false });
  };

  


  handleCloseSigninPopup = () => {
    this.setState({
      showSigninPopup: false

    }, () => {
      document.body.style.backgroundColor = "";
    });
  };



  render() {
    const {
      households,
      popupOpen,
      showAlert,
      currentlyEditing,
      anchorEls,
      openMenus,
      dialogopen,
      showSigninPopup,
    } = this.state;

    return (
      <>
        {showSigninPopup ? (
          <PopupSignin showAlert={showAlert} onChange={this.handleChange} closeSignin={this.handleCloseSigninPopup}/>
        ) : (
          <>
            <TitleHH />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                top: "150px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: "10px",
                  alignItems: "center",
                  width: "1100px",
                  height: "300px",
                }}
              >
                <Typography
                  variant="h5"
                  fontSize={"24.2px"}
                  fontWeight={600}
                  sx={{ color: "third.main", width: "1000px" }}
                >
                  Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum
                  für deine Lebensmittel!
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "flex-start",
                    gap: "50px",
                    maxWidth: "1000px",
                    flexWrap: "wrap",
                    paddingBottom: "200px",
                  }}
                >
                  <Tooltip
                    title="Neuen Haushalt hinzufügen"
                    placement="bottom"
                    arrow
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "200px",
                        height: "125px",
                        borderRadius: "10px",
                        boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                        backgroundColor: "transparent",
                        color: "primary.main",
                        border: "3px solid #13a88a",
                        "&:hover": {
                          color: "success.dark",
                          backgroundColor: "rgba(29, 151, 35, 0.2)",
                          border: "3px solid #06871D",
                        },
                      }}
                      onClick={this.openPopup}
                    >
                      <AddHomeWorkRoundedIcon
                        sx={{ width: "75px", height: "auto" }}
                      />
                    </Box>
                  </Tooltip>
                  <HouseholdAnchor
                    households={households}
                    handleAnchorClick={this.handleAnchorClick}
                    handleAnchorClose={this.handleAnchorClose}
                    handleAnchorEdit={this.handleAnchorEdit}
                    handleClickOpenDialog={this.handleClickOpenDialog}
                    anchorEls={anchorEls}
                    openMenus={openMenus}
                  />
                </Box>
                {popupOpen && (
                  <PopupHousehold
                    handleChange={this.handleChange}
                    handleCreateHousehold={this.handleCreateHousehold}
                    closePopup={this.closePopup}
                    showAlert={showAlert}
                    emails={this.emails}
                  />
                )}
                {currentlyEditing !== null && (
                  <EditHouseholdPopup
                    handleChange={this.handleChange}
                    handleCreateHousehold={this.handleCreateHousehold}
                    closePopup={this.closePopup}
                    showAlert={showAlert}
                    emails={this.emails}
                    currentName={this.state.currentName}
                  />
                )}
                {dialogopen && (
                  <DeleteConfirmationDialog
                    handleCloseDialog={this.handleCloseDialog}
                    handleConfirmDelete={this.handleConfirmDelete}
                  />
                )}
              </Box>
            </Box>
          </>
        )}
      </>
    );
  }
}

export default Household;
