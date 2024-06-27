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
      console.log("Households updated", this.state.households);
    }
  }

  checkContext = () => {
    if (this.context) {
      this.getHouseholdsByUserId();
      const householdID = this.state.householdID;
      if (householdID) {
        this.getFridgeByHouseholdId(householdID);
      } else {
        console.log("Household ID is not set.");
      }
    } else {
      setTimeout(this.checkContext, 100); // wait 100ms then re-check
    }
  };

  getHouseholdsByUserId = () => {
    const user = this.context;
    console.log(user);

    SmartFridgeAPI.getAPI()
      .getHouseholdsByUserId(user.id)
      .then((households) => {
        console.log(households);
        this.setState({
          households: households,
        });
      });
  };

  getFridgeByHouseholdId = async (householdID) => {
    try {
      const response = await SmartFridgeAPI.getAPI().getFridgeHouseholdById(
        householdID
      );
      console.log("HouseholdID", householdID);

      // Extrahiere die fridge_id aus der Antwort und speichere sie in einer Variablen
      const fridge_id = response.id;

      // Logge die fridge_id zur Überprüfung
      console.log("Fridge ID", fridge_id);
      this.props.setFridgeId(fridge_id);

      // Hier kannst du die fridge_id weiter verarbeiten oder speichern
      // Zum Beispiel in einer globalen Variable, einem Zustand (bei Verwendung von React) oder lokalem Speicher
      return fridge_id;
    } catch (error) {
      console.error("Error fetching fridge by household ID:", error);
    }
  };


  getInhabitantsByHouseholdId = (household_id) => {
    SmartFridgeAPI.getAPI()
      .getInhabitantsByHouseholdId(household_id)
      .then((inhabitants) => {
        console.log(inhabitants);
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

    // Sicherstellen, dass der Kontext initialisiert ist
    if (!this.context || !this.context.id) {
      console.error("User context is not initialized.");
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
      householdBO.setID(currentlyEditing); // Setze die ID für das Update
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
    console.log(household_id);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [household_id]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [household_id]: event.target,
      };
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
        // householdIdToDelete: household_id,
      };
    });
    console.log(households);
    console.log(anchorEls);
    console.log(householdIdToDelete);
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
    console.log(this.state.inhabitants[household_id]);
    console.log(this.state.inhabitants);
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
            console.log("HouseholdPage => Household deleted", household_id);

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
                <Paper
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "200px",
                    height: "125px",
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
                    sx={{ width: "75px", height: "auto" }}
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
                getFridgeByHouseholdId={this.getFridgeByHouseholdId}
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
                household_id={editingHousehold ? editingHousehold.id : null} // Hier wird die household_id übergeben
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