import React, { Component } from "react";
import TitleHH from "../household/TitleHousehold";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import Tooltip from "@mui/material/Tooltip";
import HouseholdDialog from "../household/HouseholdDialog";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
import HouseholdAnchor from "../household/Household";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";

class HouseholdPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      isEditMode: false,
      households: [],
      householdCount: 0,
      currentlyEditing: null,
      anchorEls: {},
      openMenus: {},
      householdIdToDelete: null,
      inhabitants: {},
    };
  }

  updateHouseholdId = (newId) => {
    this.setState({ householdIdToDelete: newId });
  };

  openPopup = (isEditMode = false, household = null) => {
    this.setState({
      popupOpen: true,
      isEditMode,
      currentlyEditing: household,
    });
    console.log("HouseholdPage => Popup opened");
  };

  closePopup = () => {
    console.log("HouseholdPage => Popup closed");
    this.setState({
      popupOpen: false,
      currentlyEditing: null,
    });
  };

  handleCreateObject = (householdData) => {
    const { currentlyEditing, households } = this.state;

    if (currentlyEditing !== null) {
      SmartFridgeAPI.api
        .updateHousehold({
          id: currentlyEditing,
          household_name: householdData.householdName,
          inhabitants: householdData.inhabitants.map(
            (inhabitant) => inhabitant.id
          ),
        })
        .then((updatedHousehold) => {
          const updatedHouseholds = households.map((household) => {
            if (household.id === currentlyEditing) {
              return {
                ...household,
                householdName: householdData.householdName,
                inhabitants: householdData.inhabitants,
              };
            }
            return household;
          });

          this.setState({
            households: updatedHouseholds,
            popupOpen: false,
            currentlyEditing: null,
          });
        })
        .catch((error) => {
          console.error("Error updating household:", error);
        });
    } else {
      // const id = households.length + 1;
      console.log(householdData.householdName);
      SmartFridgeAPI.api
        .addHouseHold({
          household_name: householdData.householdName,
          // inhabitants: householdData.inhabitants.map(
          //   (inhabitant) => inhabitant.id
          // ),
        })
        .then(async (responseHouseholdBO) => {
          const promises = householdData.inhabitants.map((inhabitant) =>
            SmartFridgeAPI.api.addInhabitant(
              inhabitant.id,
              responseHouseholdBO.id
            )
          );
          await Promise.all(promises);
          console.log(responseHouseholdBO)

          const newHouseholds = [...households, responseHouseholdBO];
          const newOpenMenus = {
            ...this.state.openMenus,
            [responseHouseholdBO.id]: false,
          };
          console.log(households);
          console.log(newHouseholds, newOpenMenus);

          this.setState({
            householdCount: this.state.householdCount + 1,
            popupOpen: false,
            households: newHouseholds,
            openMenus: newOpenMenus,
            inhabitants: {...this.state.inhabitants, [responseHouseholdBO.id]: householdData.inhabitants},
          });
        })
        .catch((error) => {
          console.error("Error creating household:", error);
        });
    }
  };

  updateHousehold(household) {
    const updatedHouseholds = this.state.households.map((e) => {
      if (household.id === e.id) {
        return { ...e, ...household };
      }
      return e;
    });

    return updatedHouseholds;
  }

  handleAnchorClick = (householdId, event) => {
    const { householdIdToDelete, households, anchorEls } = this.state;
    console.log(householdId);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [householdId]: event.target,
      };
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
        // householdIdToDelete: householdId,
      };
    });
    console.log(households);
    console.log(anchorEls);
    console.log(householdIdToDelete);
  };

  handleAnchorClose = (householdId) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorEdit = (householdId) => {
    this.setState(
      (prevState) => {
        const newOpenMenus = {
          ...prevState.openMenus,
          [householdId]: false,
        };
        return {
          currentlyEditing: householdId,
          openMenus: newOpenMenus,
          popupOpen: true,
        };
      },
      () => {
        this.openPopup(true, householdId);
      }
    );
  };
  handleAnchorDelete = (householdId) => {
    SmartFridgeAPI.api
      .deleteHousehold(householdId)
      .then(() => {
        this.setState(
          (prevState) => {
            console.log("HouseholdPage => Household deleted", householdId);

            const newOpenMenus = {
              ...prevState.openMenus,
              [householdId]: false,
            };
            const newHouseholds = prevState.households.filter(
              (h) => h.id !== householdId
            );

            return {
              households: newHouseholds,
              openMenus: newOpenMenus,
            };
          },
          () => {
            // Callback after setState to ensure state is updated before logging
            console.log("Updated households list:", this.state.households);
          }
        );
      })
      .catch((error) => {
        console.error("Error deleting household:", error);
      });
  };

  handleConfirmDelete = () => {
    const { householdIdToDelete } = this.state;
    console.log("Household => Confirm delete");
    if (householdIdToDelete !== null) {
      this.handleAnchorDelete(householdIdToDelete);
    }
  };

  setHouseholdIdToDelete = (householdId) => {
    this.setState({ householdIdToDelete: householdId });
  };

  render() {
    const {
      households,
      anchorEls,
      openMenus,
      popupOpen,
      isEditMode,
      currentlyEditing,
      inhabitants,
    } = this.state;

    const { dialogOpen, dialogType, handleOpenDialog, handleCloseDialog } =
      this.props;

    const editingHousehold = currentlyEditing
      ? households.find((h) => h.id === currentlyEditing)
      : null;

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
                  onClick={() => this.openPopup(false)}
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
                anchorEls={anchorEls}
                openMenus={openMenus}
                handleOpenDialog={handleOpenDialog}
                householdIdToDelete={this.state.householdIdToDelete}
                setHouseholdIdToDelete={this.setHouseholdIdToDelete}
              />
            </Box>
            {popupOpen && (
              <HouseholdDialog
                isEditMode={isEditMode}
                householdName={
                  editingHousehold ? editingHousehold.household_name : ""
                }
                inhabitants={
                  editingHousehold ? inhabitants[editingHousehold.id] : []
                }
                closePopup={this.closePopup}
                handleCreateObject={this.handleCreateObject}
                households={households}
                openPopup={this.openPopup}
              />
            )}
            <DeleteConfirmationDialog
              dialogOpen={dialogOpen}
              dialogType={dialogType}
              handleCloseDialog={handleCloseDialog}
              handleConfirmDelete={this.handleConfirmDelete}
            />
          </Box>
        </Box>
      </>
    );
  }
}

export default HouseholdPage;
