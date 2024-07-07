import React, { Component } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FridgeContext from "../contexts/FridgeContext";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import AlertComponent from "../dialogs/AlertComponent";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import { Link } from "react-router-dom";

class Settings extends Component {
  static contextType = FridgeContext; // Definiert den Kontexttyp für den Zugriff auf den FridgeContext.

  constructor(props) {
    super(props);
    this.state = {
      groceries: [], // Array zur Speicherung von Lebensmitteln.
      measures: [], // Array zur Speicherung von Maßeinheiten.
      fridgeId: this.props.fridgeId, // Kühlschrank-ID aus den Eigenschaften.
      showAlertEdit: false, // Status zur Anzeige des Bearbeitungswarnhinweises.
      showAlertMeasureDelete: false, // Status zur Anzeige des Löschwarnhinweises für Maßeinheiten.
      showAlertGroceryDelete: false, // Status zur Anzeige des Löschwarnhinweises für Lebensmittel.
      popupGroceryOpen: false, // Status zur Anzeige des Lebensmittel-Popups.
      popupMeasureOpen: false, // Status zur Anzeige des Maßeinheiten-Popups.
      selectedGrocery: null, // Ausgewähltes Lebensmittel zum Bearbeiten.
      selectedMeasure: null, // Ausgewählte Maßeinheit zum Bearbeiten.
      GroceryList: [], // Liste aller Lebensmittel.
      household_id: this.props.householdId, // Haushalts-ID aus den Eigenschaften.
      user_id: this.props.userId, // Benutzer-ID aus den Eigenschaften.
      owner_id: null, // Eigentümer-ID des Haushalts.
    };
  }

  componentDidMount() {
    const { fridgeId } = this.state;
    this.getGroceryByFridgeId(fridgeId); // Lädt Lebensmittel basierend auf der Kühlschrank-ID.
    this.getMeausresByFridgeId(fridgeId); // Lädt Maßeinheiten basierend auf der Kühlschrank-ID.

    // Event-Listener, um Warnhinweise bei Klick auf das Dokument auszublenden.
    document.addEventListener("click", this.handleDocumentClick);
    this.loadGroceryStatements(); // Lädt alle Lebensmittel.
    this.getHouseholdById(this.state.household_id); // Lädt den Haushalt basierend auf der Haushalts-ID.
  }

  componentWillUnmount() {
    // Entfernt den Event-Listener bei der Demontage des Komponenten.
    document.removeEventListener("click", this.handleDocumentClick);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.GroceryList !== this.state.GroceryList) {
      // Aktion, wenn sich die GroceryList ändert.
    }
  }

  handleClick = (e) => {
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      this.handleSave(); // Speichert die Änderungen, wenn das Formular gültig ist.
    } else {
      this.setState({ showAlertEdit: true }); // Zeigt einen Warnhinweis an, wenn das Formular ungültig ist.
    }
  };

  handleSave = () => {
    const { selectedGrocery, selectedMeasure, popupGroceryOpen } = this.state;
    const name = document.getElementById("outlined-required").value;

    if (popupGroceryOpen) {
      const updatedGrocery = { ...selectedGrocery, grocery_name: name };
      this.updateGrocery(updatedGrocery); // Aktualisiert das ausgewählte Lebensmittel.
    } else {
      const updatedMeasure = { ...selectedMeasure, unit: name };
      this.updateMeasure(updatedMeasure); // Aktualisiert die ausgewählte Maßeinheit.
    }
  };

  getGroceryByFridgeId = async (fridgeId) => {
    const groceries = await SmartFridgeAPI.getAPI().getGroceryByFridgeId(
      fridgeId
    );
    this.setState({
      groceries: groceries, // Setzt die geladenen Lebensmittel in den Zustand.
    });
  };

  getMeausresByFridgeId = async (fridgeId) => {
    const measures = await SmartFridgeAPI.getAPI().getMeasureByFridgeId(
      fridgeId
    );
    this.setState({
      measures: measures, // Setzt die geladenen Maßeinheiten in den Zustand.
    });
  };

  editGrocery = (groceryId) => {
    const selectedGrocery = this.state.groceries.find(
      (grocery) => grocery.id === groceryId
    );
    this.setState({
      popupGroceryOpen: true, // Öffnet das Lebensmittel-Popup.
      selectedGrocery, // Setzt das ausgewählte Lebensmittel in den Zustand.
    });
  };

  editMeasure = (measureId) => {
    const selectedMeasure = this.state.measures.find(
      (measure) => measure.id === measureId
    );
    this.setState({
      popupMeasureOpen: true, // Öffnet das Maßeinheiten-Popup.
      selectedMeasure, // Setzt die ausgewählte Maßeinheit in den Zustand.
    });
  };

  updateGrocery = async (grocery) => {
    try {
      const updatedGrocery = await SmartFridgeAPI.getAPI().updateGrocery(
        grocery
      );
      this.props.refreshGroceryList();
      this.setState((prevState) => ({
        groceries: prevState.groceries.map((g) =>
          g.id === updatedGrocery.id ? updatedGrocery : g
        ), // Aktualisiert die Lebensmittel in der Liste.
        popupGroceryOpen: false, // Schließt das Lebensmittel-Popup.
        selectedGrocery: null, // Setzt das ausgewählte Lebensmittel zurück.
      }));
    } catch (error) {
      this.setState({ showAlertEdit: true }); // Zeigt einen Warnhinweis bei Fehlern an.
    }
  };

  updateMeasure = async (measure) => {
    try {
      const updatedMeasure = await SmartFridgeAPI.getAPI().updateMeasure(
        measure
      );
      this.props.refreshGroceryList();
      this.setState((prevState) => ({
        measures: prevState.measures.map((m) =>
          m.id === updatedMeasure.id ? updatedMeasure : m
        ), // Aktualisiert die Maßeinheiten in der Liste.
        popupMeasureOpen: false, // Schließt das Maßeinheiten-Popup.
        selectedMeasure: null, // Setzt die ausgewählte Maßeinheit zurück.
      }));
    } catch (error) {
      this.setState({ showAlertEdit: true }); // Zeigt einen Warnhinweis bei Fehlern an.
    }
  };

  loadGroceryStatements = async () => {
    const Groceries = await SmartFridgeAPI.getAPI().getGroceryStatement();
    this.setState({ GroceryList: Groceries }); // Lädt und setzt die Lebensmittel in den Zustand.
  };

  deleteGrocery = async (groceryId) => {
    await SmartFridgeAPI.getAPI()
      .deleteGrocery(groceryId)
      .then(() => {
        this.setState((prevState) => ({
          groceries: prevState.groceries.filter(
            (grocery) => grocery.id !== groceryId
          ), // Entfernt das Lebensmittel aus der Liste.
        }));
      })
      .catch((error) => {
        // Fehlerbehandlung
        if (error.response && error.response.status === 403) {
          // Spezifische Fehlermeldung anzeigen, wenn das Löschen verboten ist
          alert("Dieses Lebensmittel kann nicht gelöscht werden.");
        } else {
          // Allgemeine Fehlermeldung anzeigen
          this.setState({ showAlertGroceryDelete: true });
        }
      });
  };

  deleteMeasure = async (measureId) => {
    await SmartFridgeAPI.getAPI()
      .deleteMeasure(measureId)
      .then(() => {
        this.setState((prevState) => ({
          measures: prevState.measures.filter(
            (measure) => measure.id !== measureId
          ), // Entfernt die Maßeinheit aus der Liste.
        }));
      })
      .catch((error) => {
        // Fehlerbehandlung
        if (error.response && error.response.status === 403) {
          // Spezifische Fehlermeldung anzeigen, wenn das Löschen verboten ist
          alert("Diese Maßnahme kann nicht gelöscht werden.");
        } else {
          // Allgemeine Fehlermeldung anzeigen
          this.setState({ showAlertMeasureDelete: true });
        }
      });
  };

  handleDeleteGrocery = (groceryId) => (e) => {
    const isExisting = this.state.GroceryList.some(
      (grocery) => grocery.grocery_id === groceryId
    );
    if (isExisting) {
      this.setState({ showAlertGroceryDelete: true }); // Zeigt einen Warnhinweis, wenn das Lebensmittel existiert.
      return;
    }

    e.stopPropagation();
    this.deleteGrocery(groceryId); // Löscht das Lebensmittel.
  };

  handleDeleteMeasure = (measureId) => (e) => {
    const isExisting = this.state.GroceryList.some(
      (measure) => measure.unit_id === measureId
    );
    if (isExisting) {
      this.setState({ showAlertMeasureDelete: true }); // Zeigt einen Warnhinweis, wenn die Maßeinheit existiert.
      return;
    }

    e.stopPropagation();
    this.deleteMeasure(measureId); // Löscht die Maßeinheit.
  };

  handleEditGrocery = (groceryId) => (e) => {
    e.stopPropagation();
    this.editGrocery(groceryId); // Bearbeitet das ausgewählte Lebensmittel.
  };

  handleEditMeasure = (measureId) => (e) => {
    e.stopPropagation();
    this.editMeasure(measureId); // Bearbeitet die ausgewählte Maßeinheit.
  };

  handlePopupGroceryClose = () => {
    this.setState({ popupGroceryOpen: false, selectedGrocery: null }); // Schließt das Lebensmittel-Popup.
  };

  handlePopupMeasureClose = () => {
    this.setState({ popupMeasureOpen: false, selectedMeasure: null }); // Schließt das Maßeinheiten-Popup.
  };

  deleteInhabitant = async () => {
    const { user_id } = this.state;
    const household_id = this.state.household_id;
    const updateInhabitant = await SmartFridgeAPI.getAPI().deleteInhabitant(
      user_id,
      household_id
    );
    return updateInhabitant; // Löscht den Bewohner aus dem Haushalt.
  };

  getHouseholdById = async (householdId) => {
    const household = await SmartFridgeAPI.getAPI().getHouseholdById(
      householdId
    );
    // Sicherstellen, dass das Array existiert und nicht leer ist
    if (household && household.length > 0) {
      const owner_id = household[0].owner_id;
      this.setState({ household, owner_id }); // Setzt den Haushalt und die Eigentümer-ID.
    } else {
      console.error("No household data found");
    }

    return household; // Gibt den Haushalt zurück.
  };

  render() {
    const {
      groceries,
      measures,
      showAlertGroceryDelete,
      showAlertMeasureDelete,
      popupGroceryOpen,
      popupMeasureOpen,
      selectedGrocery,
      selectedMeasure,
      showAlertEdit,
      user_id,
      owner_id,
    } = this.state;

    return (
      <>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            width: {
              xs: "100%",
              sm: "100%",
              md: "100%",
              lg: "100%",
              xl: "100%",
            },
          }}
        >
          <Paper
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: "100%",
                lg: "100%",
                xl: "100%",
              },
            }}
          >
            <Typography variant="h5" sx={{ ml: 1, p: 2, fontWeight: "bold" }}>
              Haushalt verwalten
            </Typography>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                  Lebensmittel
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}
              >
                <List
                  sx={{
                    width: { xs: "100%", sm: "600px" },
                    marginBottom: "30px",
                    mx: "5px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <AlertComponent
                    showAlert={showAlertGroceryDelete}
                    alertType="SettingsGroceryDelete"
                    onClose={() =>
                      this.setState({ showAlertGroceryDelete: false })
                    }
                  />
                  {groceries.map((grocery) => (
                    <ListItem
                      key={grocery.id}
                      sx={{
                        m: "5px",
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "100%",
                          lg: "100%",
                          xl: "100%",
                        },
                        boxShadow: 2,
                        borderRadius: "10px",
                      }}
                    >
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={this.handleEditGrocery(grocery.id)}
                        sx={{
                          m: "5px",
                          boxShadow: 2,
                          bgcolor: "background.white",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "background.default",
                          },
                        }}
                      >
                        <EditIcon sx={{ width: "18px", height: "auto" }} />
                      </IconButton>
                      <ListItemText primary={grocery.grocery_name} />
                      <Container sx={{ display: "flex", gap: "10px" }}>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={this.handleDeleteGrocery(grocery.id)}
                            sx={{
                              m: "5px",
                              color: "error.main",
                              boxShadow: 2,
                              "&:hover": {
                                bgcolor: "error.main",
                                color: "background.default",
                              },
                            }}
                          >
                            <DeleteIcon
                              sx={{ width: "18px", height: "auto" }}
                            />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </Container>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                  Einheiten
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}
              >
                <List
                  sx={{
                    width: { xs: "100%", sm: "600px" },
                    marginBottom: "30px",
                    mx: "5px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <AlertComponent
                    showAlert={showAlertMeasureDelete}
                    alertType="SettingsMeasureDelete"
                    onClose={() =>
                      this.setState({ showAlertMeasureDelete: false })
                    }
                  />
                  {measures.map((measure) => (
                    <ListItem
                      key={measure.id}
                      sx={{
                        m: "5px",
                        boxShadow: 2,
                        borderRadius: "10px",
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "100%",
                          lg: "100%",
                          xl: "100%",
                        },
                      }}
                    >
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={this.handleEditMeasure(measure.id)}
                        sx={{
                          m: "5px",
                          boxShadow: 2,
                          bgcolor: "background.white",
                          "&:hover": {
                            bgcolor: "primary.main",
                            color: "background.default",
                          },
                        }}
                      >
                        <EditIcon sx={{ width: "18px", height: "auto" }} />
                      </IconButton>
                      <ListItemText primary={measure.unit} />
                      <Container sx={{ display: "flex", gap: "10px" }}>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={this.handleDeleteMeasure(measure.id)}
                            sx={{
                              m: "5px",
                              color: "error.main",
                              boxShadow: 2,
                              "&:hover": {
                                bgcolor: "error.main",
                                color: "background.default",
                              },
                            }}
                          >
                            <DeleteIcon
                              sx={{ width: "18px", height: "auto" }}
                            />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </Container>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            {owner_id !== user_id && (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3-content"
                  id="panel3-header"
                >
                  <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                    Haushaltsaufenthalt
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Link to="/household">
                    <Button
                      onClick={this.deleteInhabitant}
                      variant="contained"
                      endIcon={<DeleteForeverRoundedIcon />}
                      sx={{
                        marginBottom: "15px",
                        width: "100%",
                        bgcolor: "rgba(197, 0, 0, 0.1)",
                        color: "error.main",
                        border: "2px solid #c50000 ",
                        "&:hover": {
                          bgcolor: "error.main",
                          color: "background.default",
                        },
                      }}
                    >
                      Haushalt verlassen
                    </Button>
                  </Link>
                  <Container
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h7"
                      sx={{ fontSize: "9pt", color: "grey" }}
                    >
                      Sorgt für die Entziehung der Zugriffsrechte in diesem
                      Haushalt!
                    </Typography>
                  </Container>
                </AccordionDetails>
              </Accordion>
            )}
          </Paper>
        </Container>
        {(popupGroceryOpen || popupMeasureOpen) && (
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              component="form"
              noValidate
              sx={{
                width: { xs: "80%", sm: "80%", md: "85%", xl: "1100px" },
                height: "auto",
                position: "fixed",
                top: { xs: "20%", sm: "35%" },
                zIndex: 2,
              }}
            >
              <Paper
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  padding: { xs: "20px", sm: "0 30px 50px 30px" },
                  borderRadius: "40px",
                  fontSize: "17px",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    fontWeight: 600,
                    color: "text.primary",
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                  }}
                >
                  {popupGroceryOpen
                    ? "Lebensmittel bearbeiten"
                    : "Einheit bearbeiten"}
                </Typography>
                <AlertComponent
                  showAlert={showAlertEdit}
                  alertType="SettingsEdit"
                  onClose={() => this.setState({ showAlertEdit: false })}
                />
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
                    onInput={() => this.setState({ showAlertEdit: false })}
                    id="outlined-required"
                    name={popupGroceryOpen ? "groceryName" : "measureName"}
                    label={
                      popupGroceryOpen
                        ? "Lebensmittelname angeben"
                        : "Einheitname angeben"
                    }
                    placeholder={
                      popupGroceryOpen ? "Lebensmittelname" : "Einheitname"
                    }
                    InputLabelProps={{ style: { fontSize: "15px" } }}
                    defaultValue={
                      popupGroceryOpen
                        ? selectedGrocery
                          ? selectedGrocery.grocery_name
                          : ""
                        : selectedMeasure
                        ? selectedMeasure.unit
                        : ""
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    position: "relative",
                    top: "25px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "center",
                      gap: "10px",
                      paddingBottom: { xs: "30px" },
                    }}
                  >
                    <Button
                      type="button"
                      variant="contained"
                      endIcon={<CheckCircleOutlineRoundedIcon />}
                      onClick={this.handleClick}
                      sx={{
                        color: "success.dark",
                        bgcolor: "rgba(29, 151, 35, 0.2)",
                        border: "2px solid #06871d",
                        "&:hover": {
                          bgcolor: "success.dark",
                          color: "background.default",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Speichern
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<HighlightOffRoundedIcon />}
                      onClick={
                        popupGroceryOpen
                          ? this.handlePopupGroceryClose
                          : this.handlePopupMeasureClose
                      }
                      sx={{
                        bgcolor: "rgba(197, 0, 0, 0.1)",
                        color: "error.main",
                        border: "2px solid #c50000 ",
                        "&:hover": {
                          bgcolor: "error.main",
                          color: "background.default",
                        },
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Abbrechen
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </>
    );
  }
}

export default Settings;
