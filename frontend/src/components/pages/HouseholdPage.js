import React, { Component, useContext } from "react";
import TitleHH from "../household/TitleHousehold";
import Typography from "@mui/material/Typography";
import { Box, Paper } from "@mui/material";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
import Tooltip from "@mui/material/Tooltip";
import HouseholdDialog from "../household/HouseholdDialog";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";
import HouseholdAnchor from "../household/Household";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import UserContext from "../contexts/UserContext";
import FridgeContext from "../contexts/FridgeContext";
import HouseholdBO from "../../api/HouseholdBO";

class HouseholdPage extends Component {
  static contextType = UserContext;

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
      inhabitants: [],
      fridgeDetails: null,
    };
  }

  componentDidMount() {
    this.checkContext();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.households !== this.state.households) {
    }
  }

  checkContext = () => {
    if (this.context) {
      this.getHouseholdsByUserId();
    } else {
      setTimeout(this.checkContext, 100);
    }
  };

  getHouseholdsByUserId = () => {
    const userId = this.context.id;
    SmartFridgeAPI.getAPI()
      .getHouseholdsByUserId(userId)
      .then((households) => {
        this.setState({
          households: households,
        });
      })
      .catch((error) => {
        console.error("Error fetching households:", error);
      });
  };

  getInhabitantsByHouseholdId = (household_id) => {
    SmartFridgeAPI.getAPI()
      .getInhabitantsByHouseholdId(household_id)
      .then((inhabitants) => {
        this.setState((prevState) => {
          return {
            inhabitants: {
              ...prevState.inhabitants,
              [household_id]: inhabitants,
            },
          };
        });
      });
  };

  updateHouseholdId = (newId) => {
    this.setState({ householdIdToDelete: newId });
  };

  openPopup = (isEditMode = false, household = null) => {
    this.setState({
      popupOpen: true,
      isEditMode,
      currentlyEditing: household,
    });
  };

  closePopup = () => {
    this.setState({
      popupOpen: false,
      currentlyEditing: null,
    });
  };

  handleCreateObject = (householdData) => {
    const { currentlyEditing, households } = this.state;

    if (!this.context || !this.context.id) {
      return;
    }

    let householdBO;
    let apiMethod;
    let successCallback;

    if (currentlyEditing !== null) {
      householdBO = new HouseholdBO(
        householdData.household_name,
        this.context.id
      );
      householdBO.setID(currentlyEditing);
      apiMethod = SmartFridgeAPI.getAPI().updateHousehold(householdBO);
      successCallback = (updatedHousehold) => {
        const updatedHouseholds = households.map((household) => {
          if (household.id === updatedHousehold.id) {
            return updatedHousehold;
          }
          return household;
        });

        const promises = householdData.inhabitants.map((inhabitant) =>
          SmartFridgeAPI.getAPI().addInhabitant(
            inhabitant.id,
            updatedHousehold.id
          )
        );

        Promise.all(promises).then(() => {
          const newInhabitants = {
            ...this.state.inhabitants,
            [updatedHousehold.id]: householdData.inhabitants,
          };

          this.setState({
            households: updatedHouseholds,
            popupOpen: false,
            currentlyEditing: null,
            inhabitants: newInhabitants,
          });
        });
      };
    } else {
      householdBO = new HouseholdBO(
        householdData.household_name,
        this.context.id
      );
      apiMethod = SmartFridgeAPI.getAPI().addHouseHold(householdBO);
      successCallback = (responseHouseholdBO) => {
        const promises = householdData.inhabitants.map((inhabitant) =>
          SmartFridgeAPI.getAPI().addInhabitant(
            inhabitant.id,
            responseHouseholdBO.id
          )
        );

        Promise.all(promises).then(() => {
          const newHouseholds = [...households, responseHouseholdBO];
          const newInhabitants = {
            ...this.state.inhabitants,
            [responseHouseholdBO.id]: householdData.inhabitants,
          };
          const newOpenMenus = {
            ...this.state.openMenus,
            [responseHouseholdBO.id]: false,
          };

          this.setState({
            householdCount: this.state.householdCount + 1,
            popupOpen: false,
            households: newHouseholds,
            openMenus: newOpenMenus,
            inhabitants: newInhabitants,
          });
        });
      };
    }

    apiMethod.then(successCallback).catch((error) => {
      console.error("Error handling household:", error);
    });
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

  handleAnchorClick = (household_id, event) => {
    const { householdIdToDelete, households, anchorEls } = this.state;
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [household_id]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [household_id]: event.target,
      };
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorClose = (household_id) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [household_id]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorEdit = (household_id) => {
    this.getInhabitantsByHouseholdId(household_id);

    this.setState(
      (prevState) => {
        const newOpenMenus = {
          ...prevState.openMenus,
          [household_id]: false,
        };
        return {
          currentlyEditing: household_id,
          openMenus: newOpenMenus,
          popupOpen: true,
        };
      },
      () => {
        this.openPopup(true, household_id);
      }
    );
  };

  handleAnchorDelete = (household_id) => {
    SmartFridgeAPI.getAPI()
      .deleteHousehold(household_id)
      .then(() => {
        this.setState(
          (prevState) => {
            const newOpenMenus = {
              ...prevState.openMenus,
              [household_id]: false,
            };
            const newHouseholds = prevState.households.filter(
              (h) => h.id !== household_id
            );

            return {
              households: newHouseholds,
              openMenus: newOpenMenus,
            };
          },
          () => {}
        );
      })
      .catch((error) => {
        console.error("Error deleting household:", error);
      });
  };

  handleConfirmDelete = () => {
    const { householdIdToDelete } = this.state;
    if (householdIdToDelete !== null) {
      this.handleAnchorDelete(householdIdToDelete);
    }
  };

  setHouseholdIdToDelete = (household_id) => {
    this.setState({ householdIdToDelete: household_id });
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
            padding: { xs: "10px" },
            top: { xs: "150px" },
            border: { xs: "1px solid green" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: {
                xs: "center",
                sm: "flex-start",
                md: "flex-start",
              },
              gap: { xs: "10px" },
              alignItems: { xs: "center" },
              width: { xs: "100%", sm: "1100px" },
              height: { xs: "auto", sm: "300px" },
              border: "1px solid green",
            }}
          >
            <Typography
              variant="h5"
              fontSize={{ xs: "20px", sm: "24.2px" }}
              textAlign={{ xs: "center" }}
              fontWeight={600}
              sx={{ color: "third.main", width: { xs: "100%", sm: "1000px" } }}
            >
              Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
              deine Lebensmittel!
            </Typography>

            <Box
              sx={{
                display: "flex",
                width: {xs: "325px", sm: "100%", md: "100%", lg: "100%", xl: "100%" },
                justifyContent: "flex-start",
                gap: { xs: "25px", sm: "20px", md: "50px" },
                maxWidth: "1000px",
                flexWrap: "wrap",
                paddingBottom: { xs: "50px", sm: "200px" },
                border: "1px solid red",

              }}
            >
              <Tooltip
                title="Neuen Haushalt hinzufügen"
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
                    backgroundColor: "background.default",
                    color: "primary.main",
                    "&:hover": {
                      color: "success.dark",
                      backgroundColor: "success.gwhite",
                      boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                    },
                  }}
                  onClick={() => this.openPopup(false)}
                >
                  <AddHomeWorkRoundedIcon
                    sx={{ width: { xs: "50px", sm: "75px" }, height: "auto" }}
                  />
                </Paper>
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
                household_name={
                  editingHousehold ? editingHousehold.household_name : ""
                }
                inhabitants={
                  editingHousehold ? inhabitants[editingHousehold.id] : []
                }
                household_id={editingHousehold ? editingHousehold.id : null}
                closePopup={this.closePopup}
                handleCreateObject={this.handleCreateObject}
                households={households}
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

const HouseholdPageWithFridgeContext = (props) => {
  const { setFridgeId } = useContext(FridgeContext);
  return <HouseholdPage {...props} setFridgeId={setFridgeId} />;
};

export default HouseholdPageWithFridgeContext;
