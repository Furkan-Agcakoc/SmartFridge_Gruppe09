import React, { Component } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  Button,
  IconButton,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import AlertComponent from "../dialogs/AlertComponent";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import UserContext from "../contexts/UserContext";

class HouseholdDialog extends Component {
  static contextType = UserContext; // Setzt den UserContext als Kontext für die Komponente.

  constructor(props) {
    super(props);
    this.state = {
      householdData: {
        household_name: props.isEditMode ? props.household_name : "",
        household_id: props.isEditMode ? props.household_id : null,
        inhabitants: props.isEditMode ? props.inhabitants : [],
      },
      allInhabitants: [],
      showAlert: false,
      contextLoaded: false,
    }; // Initialisiert den Zustand der Komponente.
  }

  componentDidMount() {
    const checkContext = () => {
      if (this.context) {
        this.setState({ contextLoaded: true });
        this.updateState(); // Überprüft den Kontext und aktualisiert den Zustand beim Mounten der Komponente.
      }
    };
    checkContext();
  }

  updateState = () => {
    this.fetchInhabitants();
    setTimeout(this.updateState, 30000); // Aktualisiert den Zustand alle 30 Sekunden.
  };

  fetchInhabitants = () => {
    this.getAvailableInhabitants();
    SmartFridgeAPI.getAPI()
      .getUser()
      .then((userBOs) => {
        const inhabitants = userBOs.map((user) => ({
          email: user.email,
          id: user.id,
        }));
        this.setState({ allInhabitants: inhabitants }); // Ruft alle Bewohner ab und setzt sie in den Zustand.
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Einwohnerdaten:", error);
      });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.household_name !== this.props.household_name ||
      prevProps.inhabitants !== this.props.inhabitants
    ) {
      this.setState({
        householdData: {
          household_name: this.props.household_name,
          inhabitants: this.props.inhabitants || [],
          household_id: this.props.household_id,
        },
      }); // Aktualisiert den Zustand, wenn sich die Props ändern.
    }

    if (!prevState.contextLoaded && this.state.contextLoaded) {
      this.getAvailableInhabitants(); // Ruft verfügbare Bewohner ab, wenn der Kontext geladen ist.
    }
  }

  handleClick = (e) => {
    const { householdData } = this.state;
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      this.props.handleCreateObject(householdData); // Überprüft die Gültigkeit des Formulars und erstellt ein Haushaltsobjekt.
    } else {
      this.setState({ showAlert: true }); // Zeigt eine Warnung an, wenn das Formular ungültig ist.
    }
  };

  getAvailableInhabitants = () => {
    const { allInhabitants, householdData } = this.state;
    const currentInhabitantsIds =
      householdData?.inhabitants?.map((inhabitant) => inhabitant.id) || [];
    return allInhabitants.filter(
      (inhabitant) =>
        !currentInhabitantsIds.includes(inhabitant.id) &&
        (this.context && this.context.id
          ? inhabitant.id !== this.context.id
          : true)
    ); // Filtert die verfügbaren Bewohner basierend auf aktuellen Bewohnern und dem Benutzerkontext.
  };

  getInhabitantById = (id) => {
    return this.state.allInhabitants.find((inhabitant) => inhabitant.id === id); // Findet einen Bewohner anhand der ID.
  };

  deleteInhabitantByUserIdHouseholdId = (userId, household_id) => {
    SmartFridgeAPI.getAPI()
      .deleteInhabitant(userId, household_id)
      .then(() => {
        this.setState((prevState) => {
          const updatedInhabitants = prevState.householdData.inhabitants.filter(
            (inh) => inh.id !== userId
          );
          return {
            householdData: {
              ...prevState.householdData,
              inhabitants: updatedInhabitants,
            },
          }; // Entfernt einen Bewohner aus dem Haushalt.
        });
      })
      .catch((error) => {
        console.error("Fehler beim Löschen des Bewohners:", error);
      });
  };

  handleDeleteInhabitant = (inhabitant) => {
    this.setState((prevState) => ({
      householdData: {
        ...prevState.householdData,
        inhabitants: prevState.householdData.inhabitants.filter(
          (inh) => inh.id !== inhabitant.id
        ),
      },
    })); // Entfernt einen Bewohner aus dem Zustand.
  };

  getHouseholdsByUserId = () => {
    const user = this.context;
    SmartFridgeAPI.getAPI()
      .getHouseholdsByUserId(user.id)
      .then((households) => {
        this.setState({
          households: households,
        }); // Ruft Haushaltsdaten des Benutzers ab und setzt sie in den Zustand.
      });
  };

  render() {
    const { closePopup, isEditMode } = this.props;

    const {
      householdData: { household_name, inhabitants, household_id },
      showAlert,
    } = this.state;

    const availableInhabitants = this.getAvailableInhabitants();

    return (
      <>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            width: { xs: "90%", sm: "90%", md: "1100px" },
            position: "fixed",
            zIndex: 2,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          component="form"
          noValidate
        >
          <Paper
            action="Haushalt"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: { xs: "20px", sm: "20px", md: "0 30px 50px 30px" },
              borderRadius: "50px",
              fontSize: "18px",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                marginBottom: "20px",
                marginTop: "20px",
                fontWeight: 600,
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              {isEditMode ? "Haushalt bearbeiten" : "Haushalt hinzufügen"}
            </Typography>
            <AlertComponent showAlert={showAlert} alertType="household" />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "10px",
              }}
            >
              <TextField
                required
                value={household_name}
                onChange={(e) =>
                  this.setState({
                    householdData: {
                      ...this.state.householdData,
                      household_name: e.target.value,
                    },
                  })
                }
                onInput={() => this.setState({ showAlert: false })}
                id="outlined-required"
                name="household_name"
                label="Haushaltsname"
                placeholder="Haushaltsname"
                InputLabelProps={{ style: { fontSize: "15px" } }}
              />
              <Autocomplete
                options={availableInhabitants}
                getOptionLabel={(option) => option.email}
                value={inhabitants}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                multiple
                onChange={(event, value) => {
                  this.setState((prevState) => ({
                    householdData: {
                      ...prevState.householdData,
                      inhabitants: value,
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="inhabitant"
                    label="Bewohner hinzufügen"
                    placeholder="Bewohner hinzufügen"
                    InputLabelProps={{ style: { fontSize: "15px" } }}
                  />
                )}
                renderTags={() => null}
              />
              <Box sx={{ mt: { xs: 1, sm: 2, md: 3 } }}>
                {inhabitants &&
                  inhabitants.length > 0 &&
                  inhabitants.map((inhabitant) => (
                    <Box
                      key={inhabitant.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 0",
                      }}
                    >
                      <Typography>{inhabitant.email}</Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          this.deleteInhabitantByUserIdHouseholdId(
                            inhabitant.id,
                            household_id
                          )
                        }
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
                top: "25px",
                mb: { xs: "20px", sm: "20px", md: "0px" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  paddingBottom: { xs: "10px" },
                  width: { xs: "100%", sm: "80%", md: "50%" }, // Adjust this as needed
                }}
              >
                <Button
                  variant="contained"
                  endIcon={
                    <CheckCircleOutlineRoundedIcon
                      sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    />
                  }
                  onClick={this.handleClick}
                  sx={{
                    flex: 1,
                    color: "success.dark",
                    bgcolor: "rgba(29, 151, 35, 0.2)",
                    border: "2px solid #06871d",
                    "&:hover": {
                      bgcolor: "success.dark",
                      color: "background.default",
                    },
                  }}
                >
                  {isEditMode ? "Speichern" : "Hinzufügen"}
                </Button>
                <Button
                  variant="contained"
                  endIcon={
                    <HighlightOffRoundedIcon
                      sx={{ display: { xs: "none", sm: "inline-flex" } }}
                    />
                  }
                  onClick={closePopup}
                  sx={{
                    flex: 1,
                    bgcolor: "rgba(197, 0, 0, 0.1)",
                    color: "error.main",
                    border: "2px solid #c50000 ",
                    "&:hover": {
                      bgcolor: "error.main",
                      color: "background.default",
                    },
                  }}
                >
                  Abbrechen
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </>
    );
  }
}

export default HouseholdDialog;
