import React, { Component } from "react";
import TitleHH from "../household/TitleHousehold";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import Tooltip from "@mui/material/Tooltip";
// import PopupHousehold from "../household/PopupHousehold";
// import EditHouseholdPopup from "../household/EditHouseholdPopup";
import HouseholdDialog from "../household/HouseholdDialog";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
import HouseholdAnchor from "../household/HouseholdAnchor";
// import Alert from "@mui/material/Alert";

class Household extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // popupOpen: false,
      // householdCount: 0,
      // households: [],
      // householdName: "",
      // showAlert: false,
      // anchorEls: {},
      // openMenus: {},
      // currentlyEditing: null,
      // dialogopen: false,
      // householdIdToDelete: null, // New state to store householdId
    };

    this.emails = [
      "furkana.gs2002@gmail.com",
      "meayavuz@gmail.com",
      "baran2323a@gmail.com",
      "derzockerlp63@gmail.com",
      "sead.shat@gmail.com",
    ];
  }

  // openPopup = () => {
  //   this.setState({
  //     popupOpen: true,
  //     currentlyEditing: null,
  //   });
  // };

  // closePopup = () => {
  //   this.setState({ popupOpen: false, currentlyEditing: null });
  // };

  // handleChange = (event) => {
  //   this.setState({
  //     currentName: event.target.value,
  //     showAlert: false,
  //   });
  // };

  // handleCloseAlert = () => {
  //   this.setState({ showAlert: false });
  // };

  // handleClickOpenDialog = (householdId) => {
  //   this.setState({
  //     dialogopen: true,
  //     householdIdToDelete: householdId,
  //   });
  //   this.handleAnchorClose(householdId);
  // };

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

  // handleCreateHousehold = () => {
  //   const { currentName, currentlyEditing, households } = this.state;

  //   if (currentName.trim() === "") {
  //     this.setState({ showAlert: true });
  //     return;
  //   }

  //   if (currentlyEditing !== null) {
  //     // Edit existing household
  //     this.setState({
  //       households: this.updateHousehold({
  //         householdId: currentlyEditing,
  //         householdName: currentName,
  //         emails: [],
  //       }),
  //       popupOpen: false,
  //       currentName: "",
  //       showAlert: false,
  //       currentlyEditing: null,
  //     });
  //   } else {
  //     // Create new household
  //     const id = households.length + 1;
  //     console.log("new household");

  //     this.setState((prevState) => {
  //       const newHouseholds = [
  //         ...prevState.households,
  //         {
  //           householdId: id,
  //           householdName: currentName,
  //           emails: [],
  //         },
  //       ];
  //       const newOpenMenus = { ...prevState.openMenus, [id]: false };
  //       console.log(newHouseholds);

  //       return {
  //         householdCount: prevState.householdCount + 1,
  //         popupOpen: false,
  //         households: newHouseholds,
  //         currentName: "",
  //         showAlert: false,
  //         openMenus: newOpenMenus,
  //       };
  //     });
  //   }
  // };

  // updateHousehold(household) {
  //   const updatedHouseholds = this.state.households.map((e) => {
  //     if (household.householdId === e.householdId) {
  //       return household;
  //     }
  //     return e;
  //   });
  //   return updatedHouseholds;
  // }

  // handleAnchorClick = (householdId, event) => {
  //   this.setState((prevState) => {
  //     const newOpenMenus = { ...prevState.openMenus, [householdId]: true };
  //     const newAnchorEls = {
  //       ...prevState.anchorEls,
  //       [householdId]: event.target,
  //     };
  //     return {
  //       anchorEls: newAnchorEls,
  //       openMenus: newOpenMenus,
  //     };
  //   });
  // };

  // handleAnchorClose = (householdId) => {
  //   this.setState((prevState) => {
  //     const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
  //     return {
  //       openMenus: newOpenMenus,
  //     };
  //   });
  // };

  // handleAnchorEdit = (household) => {
  //   this.setState((prevState) => {
  //     const newOpenMenus = {
  //       ...prevState.openMenus,
  //       [household.householdId]: false,
  //     };
  //     return {
  //       currentlyEditing: household.householdId,
  //       currentName: household.householdName,
  //       openMenus: newOpenMenus,
  //     };
  //   });
  // };

  // handleAnchorDelete = (householdId) => {
  //   this.setState((prevState) => {
  //     const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
  //     const newHouseholds = prevState.households.filter(
  //       (h) => h.householdId !== householdId
  //     );
  //     return {
  //       households: newHouseholds,
  //       openMenus: newOpenMenus,
  //     };
  //   });
  // };

  render() {
    // const {
    // households,
    // showAlert,
    // currentlyEditing,
    // anchorEls,
    // openMenus,
    // dialogopen,
    // currentName,
    // } = this.state;

    const {
      households,
      anchorEls,
      openMenus,
      popupOpen,
      openPopup,
      showAlertComponent,
      dialogopen,
      isEditMode,
      householdName,
      // householdEmails,
    } = this.props;



    // const showAlertComponent = showAlert && (
    //   <Alert severity="error" sx={{ marginBottom: "20px" }}>
    //     Bitte geben Sie einen Haushaltsnamen ein!
    //   </Alert>
    // );

    return (
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
              Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
              deine Lebensmittel!
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
                  onClick={() => openPopup(false)}
                >
                  <AddHomeWorkRoundedIcon
                    sx={{ width: "75px", height: "auto" }}
                  />
                </Box>
              </Tooltip>
              <HouseholdAnchor
                households={households}
                handleAnchorClick={this.props.handleAnchorClick}
                handleAnchorClose={this.props.handleAnchorClose}
                handleAnchorEdit={this.props.handleAnchorEdit}
                handleClickOpenDialog={this.props.handleClickOpenDialog}
                anchorEls={anchorEls}
                openMenus={openMenus}
                openPopup={this.props.openPopup}
              />
            </Box>
            {popupOpen && (
              <HouseholdDialog
                isEditMode={isEditMode}
                householdName={householdName}
                // householdEmails={householdEmails}
                closePopup={this.props.closePopup}
                handleCreateObject={this.props.handleCreateObject}
                handleInvalid={this.props.handleInvalid}
                handleInput={this.props.handleInput}
                showAlertComponent={showAlertComponent}
                households={households}
                openPopup={this.props.openPopup}
              />
            )}
            {/* {popupOpen && (
              <PopupHousehold
                // handleChange={this.handleChange}
                handleInvalid={this.props.handleInvalid}
                handleInput={this.props.handleInput}
                handleCreateObject={this.props.handleCreateObject}
                // closePopup={this.closePopup}
                closePopup={this.props.closePopup}
                showAlertComponent={showAlertComponent}
              />
            )} */}
            {/* {currentlyEditing !== null && (
              <EditHouseholdPopup
                // handleChange={this.handleChange}
                handleChange={this.props.handleChange}
                handleCreateHousehold={this.handleCreateHousehold}
                closePopup={this.closePopup}
                emails={this.emails}
                currentName={currentName}
                // showAlert={this.state.props.showAlert}
              />
            )} */}
            {dialogopen && (
              <DeleteConfirmationDialog
                handleCloseDialog={this.handleCloseDialog}
                handleConfirmDelete={this.handleConfirmDelete}
              />
            )}
          </Box>
        </Box>
      </>
    );
  }
}

export default Household;
