import React, { Component } from "react";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Modal,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groceries: [],
      measures: [],
      modalOpenGrocery: false,
      modalOpenMeasure: false,
      selectedGrocery: null,
      selectedMeasure: null,
      editedGroceryName: "",
      editedMeasureName: "",
    };
  }

  componentDidMount() {
    SmartFridgeAPI.getAPI()
      .getGrocery()
      .then((groceryBOs) => {
        this.setState({ groceries: groceryBOs });
      })
      .catch((error) => {
        console.error("Error fetching groceries:", error);
      });
    SmartFridgeAPI.getAPI()
      .getMeasure()
      .then((measureBOs) => {
        this.setState({ measures: measureBOs });
      })
      .catch((error) => {
        console.error("Error fetching measures:", error);
      });
  }

  deleteGrocery = (grocery) => {
    SmartFridgeAPI.getAPI()
      .deleteGrocery(grocery.id)
      .then(() => {
        const { groceries } = this.state;
        const updatedGroceries = groceries.filter((g) => g.id !== grocery.id);
        this.setState({ groceries: updatedGroceries });
      })
      .catch((error) => {
        console.error("Fehler beim Löschen:", error);
      });
  };

  deleteMeasure = (measure) => {
    SmartFridgeAPI.getAPI()
      .deleteMeasure(measure.id)
      .then(() => {
        const { measures } = this.state;
        const updatedMeasures = measures.filter((m) => m.id !== measure.id);
        this.setState({ measures: updatedMeasures });
      })
      .catch((error) => {
        console.error("Fehler beim Löschen:", error);
      });
  };

  handleOpenGroceryModal = (grocery) => {
    this.setState({
      modalOpenGrocery: true,
      selectedGrocery: grocery,
      editedGroceryName: grocery.grocery_name,
    });
  };

  handleCloseGroceryModal = () => {
    this.setState({
      modalOpenGrocery: false,
      selectedGrocery: null,
      editedGroceryName: "",
    });
  };

  handleOpenMeasureModal = (measure) => {
    this.setState({
      modalOpenMeasure: true,
      selectedMeasure: measure,
      editedMeasureName: measure.unit,
    });
  };

  handleCloseMeasureModal = () => {
    this.setState({
      modalOpenMeasure: false,
      selectedMeasure: null,
      editedMeasureName: "",
    });
  };

  handleEditGroceryChange = (event) => {
    this.setState({ editedGroceryName: event.target.value });
  };

  handleEditMeasureChange = (event) => {
    this.setState({ editedMeasureName: event.target.value });
  };

  handleUpdateGrocery = () => {
    const { selectedGrocery, editedGroceryName, groceries } = this.state;

    if (selectedGrocery !== null) {
      SmartFridgeAPI.getAPI()
        .updateGrocery({
          id: selectedGrocery.id,
          grocery_name: editedGroceryName,
        })
        .then((updatedGrocery) => {
          const updatedGroceries = groceries.map((grocery) =>
            grocery.id === selectedGrocery.id
              ? { ...grocery, grocery_name: editedGroceryName }
              : grocery
          );

          this.setState({
            groceries: updatedGroceries,
            modalOpenGrocery: false,
            selectedGrocery: null,
            editedGroceryName: "",
          });
        })
        .catch((error) => {
          console.error("Error updating grocery:", error);
        });
    }
  };

  handleUpdateMeasure = () => {
    const { selectedMeasure, editedMeasureName, measures } = this.state;

    if (selectedMeasure !== null) {
      SmartFridgeAPI.getAPI()
        .updateMeasure({
          id: selectedMeasure.id,
          unit: editedMeasureName,
        })
        .then((updatedMeasure) => {
          const updatedMeasures = measures.map((measure) =>
            measure.id === selectedMeasure.id
              ? { ...measure, unit: editedMeasureName }
              : measure
          );

          this.setState({
            measures: updatedMeasures,
            modalOpenMeasure: false,
            selectedMeasure: null,
            editedMeasureName: "",
          });
        })
        .catch((error) => {
          console.error("Error updating measure:", error);
        });
    }
  };

  render() {
    const {
      groceries,
      measures,
      modalOpenGrocery,
      modalOpenMeasure,
      editedGroceryName,
      editedMeasureName,
    } = this.state;

    return (
      <>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            mt: 2,
          }}
        >
          <Paper>
            <Typography variant="h5" sx={{ ml: 1, p: 2, fontWeight: "bold" }}>
              Haushalt verwalten
            </Typography>
            <Accordion sx={{ minWidth: "850px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ ml: 1, fontWeight: "bold" }}>
                  Lebensmittel bearbeiten
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}
              >
                <List sx={{ width: "600px" }}>
                  {groceries.map((grocery) => (
                    <ListItem
                      key={grocery.id}
                      sx={{
                        m: "5px",
                        boxShadow: 2,
                        borderRadius: "10px",
                      }}
                    >
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => this.handleOpenGroceryModal(grocery)}
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
                            onClick={() => this.deleteGrocery(grocery)}
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
            <Accordion sx={{ minWidth: "850px" }}>
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
                <List sx={{ width: "600px" }}>
                  {measures.map((measure) => (
                    <ListItem
                      key={measure.id}
                      sx={{
                        m: "5px",
                        boxShadow: 2,
                        borderRadius: "10px",
                      }}
                    >
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => this.handleOpenMeasureModal(measure)}
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
                            onClick={() => this.deleteMeasure(measure)}
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
         {/* Modal für Lebensmittel */}
    <Modal open={modalOpenGrocery} onClose={this.handleCloseGroceryModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "20px",
        }}
      >
        <Typography variant="h6" component="h2" fontWeight={"bold"}>
          Lebensmittel bearbeiten
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          value={editedGroceryName}
          onChange={this.handleEditGroceryChange}
        />
        <Container
          sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleUpdateGrocery}
            sx={{
              mt: 2,
              width: "125px",
              "&:hover": {
                bgcolor: "primary.dark",
                color: "background.default",
              },
            }}
          >
            Speichern
          </Button>
          <Button
            variant="contained"
            onClick={this.handleCloseGroceryModal}
            sx={{
              mt: 2,
              ml: 2,
              width: "125px",
              color: "primary.dark",
              bgcolor: "rgba(0, 50, 0, 0.1)",
              "&:hover": {
                bgcolor: "grey",
                color: "background.default",
              },
            }}
          >
            Abbrechen
          </Button>
        </Container>
      </Box>
    </Modal>

    {/* Modal für Einheiten */}
    <Modal open={modalOpenMeasure} onClose={this.handleCloseMeasureModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: "20px",
        }}
      >
        <Typography variant="h6" component="h2" fontWeight={"bold"}>
          Einheit bearbeiten
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Einheit"
          value={editedMeasureName}
          onChange={this.handleEditMeasureChange}
        />
        <Container
          sx={{ display: "flex", justifyContent: "center", m: 0, p: 0 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleUpdateMeasure}
            sx={{
              mt: 2,
              width: "125px",
              "&:hover": {
                bgcolor: "primary.dark",
                color: "background.default",
              },
            }}
          >
            Speichern
          </Button>
          <Button
            variant="contained"
            onClick={this.handleCloseMeasureModal}
            sx={{
              mt: 2,
              ml: 2,
              width: "125px",
              color: "primary.dark",
              bgcolor: "rgba(0, 50, 0, 0.1)",
              "&:hover": {
                bgcolor: "grey",
                color: "background.default",
              },
            }}
          >
            Abbrechen
          </Button>
        </Container>
      </Box>
    </Modal>
      </>
    );
  }
}

export default Settings;
