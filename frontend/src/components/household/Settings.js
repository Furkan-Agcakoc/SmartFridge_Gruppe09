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

class Settings extends Component {
  static contextType = FridgeContext;

  constructor(props) {
    super(props);
    this.state = {
      groceries: [],
      measures: [],
      fridgeId: this.props.fridgeId,
      showAlertGroceryDelete: false,
      showAlertMeasureDelete: false,
      showAlertEdit: false,
      popupGroceryOpen: false,
      popupMeasureOpen: false,
      selectedGrocery: null,
      selectedMeasure: null,
      GroceryList: [],
    };
    console.log("Constructor - Fridge ID:", this.state.fridgeId);
  }

  componentDidMount() {
    const { fridgeId } = this.state;
    this.getGroceryByFridgeId(fridgeId);
    this.getMeausresByFridgeId(fridgeId);

    // Event listener to hide alerts on document click
    document.addEventListener("click", this.handleDocumentClick);
    this.loadGroceryStatements();
  }

  componentWillUnmount() {
    // Clean up the event listener
    document.removeEventListener("click", this.handleDocumentClick);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.GroceryList !== this.state.GroceryList) {
      console.log("GroceryList ===>", this.state.GroceryList);
    }
  }

  handleDocumentClick = () => {
    this.setState({
      showAlertGroceryDelete: false,
      showAlertMeasureDelete: false,
    });
  };

  handleClick = (e) => {
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      this.handleSave();
    } else {
      this.setState({ showAlertEdit: true });
    }
  };

  handleSave = () => {
    const { selectedGrocery, selectedMeasure, popupGroceryOpen } = this.state;
    const name = document.getElementById("outlined-required").value;

    if (popupGroceryOpen) {
      const updatedGrocery = { ...selectedGrocery, grocery_name: name };
      this.updateGrocery(updatedGrocery);
    } else {
      const updatedMeasure = { ...selectedMeasure, unit: name };
      this.updateMeasure(updatedMeasure);
    }
  };

  getGroceryByFridgeId = async (fridgeId) => {
    const groceries = await SmartFridgeAPI.getAPI().getGroceryByFridgeId(
      fridgeId
    );
    console.log(groceries);
    this.setState({
      groceries: groceries,
    });
  };

  getMeausresByFridgeId = async (fridgeId) => {
    const measures = await SmartFridgeAPI.getAPI().getMeasureByFridgeId(
      fridgeId
    );
    console.log(measures);
    this.setState({
      measures: measures,
    });
  };

  deleteGrocery = async (groceryId) => {
    await SmartFridgeAPI.getAPI()
      .deleteGrocery(groceryId)
      .then(() => {
        this.setState((prevState) => ({
          groceries: prevState.groceries.filter(
            (grocery) => grocery.id !== groceryId
          ),
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
          ),
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

  editGrocery = (groceryId) => {
    const selectedGrocery = this.state.groceries.find(
      (grocery) => grocery.id === groceryId
    );
    this.setState({
      popupGroceryOpen: true,
      selectedGrocery,
    });
  };

  editMeasure = (measureId) => {
    const selectedMeasure = this.state.measures.find(
      (measure) => measure.id === measureId
    );
    this.setState({
      popupMeasureOpen: true,
      selectedMeasure,
    });
  };

  updateGrocery = async (grocery) => {
    try {
      const updatedGrocery = await SmartFridgeAPI.getAPI().updateGrocery(
        grocery
      );
      this.props.refreshGroceryList()
      this.setState((prevState) => ({
        groceries: prevState.groceries.map((g) =>
          g.id === updatedGrocery.id ? updatedGrocery : g
        ),
        popupGroceryOpen: false,
        selectedGrocery: null,
      }));
    } catch (error) {
      this.setState({ showAlertEdit: true });
    }
  };

  // {
  //   "id": 0,
  //   "firstname": "string",
  //   "lastname": "string",
  //   "nickname": "string",
  //   "email": "string",
  //   "google_user_id": "string"
  // }

  updateMeasure = async (measure) => {
    try {
      const updatedMeasure = await SmartFridgeAPI.getAPI().updateMeasure(
        measure
      );
      this.props.refreshGroceryList()
      this.setState((prevState) => ({
        measures: prevState.measures.map((m) =>
          m.id === updatedMeasure.id ? updatedMeasure : m
        ),
        popupMeasureOpen: false,
        selectedMeasure: null,
      }));
    } catch (error) {
      this.setState({ showAlertEdit: true });
    }
  };

  handleDeleteGrocery = (groceryId) => (e) => {
    const isExisting = this.state.GroceryList.some(grocery => grocery.grocery_id === groceryId)
    if (isExisting) {
      alert('Grocery is already in use');
      return;
    }

    e.stopPropagation();
    this.deleteGrocery(groceryId);
  };

  loadGroceryStatements = async () => {
    const Groceries = await SmartFridgeAPI.getAPI().getGroceryStatement()
    console.log('Groceries after fetch ===>', Groceries)
    this.setState({ GroceryList: Groceries });
  }

  handleDeleteMeasure = (measureId) => (e) => {
    e.stopPropagation();
    this.deleteMeasure(measureId);
  };

  handleEditGrocery = (groceryId) => (e) => {
    e.stopPropagation();
    this.editGrocery(groceryId);
  };

  handleEditMeasure = (measureId) => (e) => {
    e.stopPropagation();
    this.editMeasure(measureId);
  };

  handlePopupGroceryClose = () => {
    this.setState({ popupGroceryOpen: false, selectedGrocery: null });
  };

  handlePopupMeasureClose = () => {
    this.setState({ popupMeasureOpen: false, selectedMeasure: null });
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
      GroceryList,
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
                  Lebensmittel bearbeiten{" "}
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}
              >
                <List
                  sx={{
                    width: { xs: "100%", sm: "600px" },
                    marginBottom: "30px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <AlertComponent
                    showAlert={showAlertGroceryDelete}
                    alertType="SettingsGroceryDelete"
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
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                  Einheit bearbeiten
                </Typography>
              </AccordionSummary>

              <AccordionDetails
                sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}
              >
                <List
                  sx={{
                    width: { xs: "100%", sm: "600px" },
                    marginBottom: "30px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <AlertComponent
                    showAlert={showAlertMeasureDelete}
                    alertType="SettingsMeasureDelete"
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
                  showAlert={this.state.showAlertEdit}
                  alertType="SettingsEdit"
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
