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
      modalOpen: false,
      selectedGrocery: null,
      editedGroceryName: "",
    };
  }

  componentDidMount() {
    SmartFridgeAPI.api
      .getGrocery()
      .then((groceryBOs) => {
        this.setState({ groceries: groceryBOs });
      })
      .catch((error) => {
        console.error("Error fetching groceries:", error);
      });
    SmartFridgeAPI.api
      .getMeasure()
      .then((measureBOs) => {
        this.setState({ measures: measureBOs });
      })
      .catch((error) => {
        console.error("Error fetching measures:", error);
      });
  }

  deleteGrocery = (grocery) => {
    SmartFridgeAPI.api
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
    SmartFridgeAPI.api
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

  handleOpenModal = (grocery) => {
    this.setState({
      modalOpen: true,
      selectedGrocery: grocery,
      editedGroceryName: grocery.grocery_name,
    });
  };

  handleCloseModal = () => {
    this.setState({ modalOpen: false, selectedGrocery: null, editedGroceryName: "" });
  };

  handleEditChange = (event) => {
    this.setState({ editedGroceryName: event.target.value });
  };

  handleUpdateGrocery = () => {
    const { selectedGrocery, editedGroceryName, groceries } = this.state;

    if (selectedGrocery !== null) {
      SmartFridgeAPI.api
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
            modalOpen: false,
            selectedGrocery: null,
            editedGroceryName: "",
          });
        })
        .catch((error) => {
          console.error("Error updating grocery:", error);
        });
    }
  };

  render() {
    const { groceries, measures, modalOpen, editedGroceryName } = this.state;

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
            <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
              Haushalt verwalten
            </Typography>
            <Accordion sx={{ minWidth: "850px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Lebensmittel bearbeiten
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {groceries.map((grocery) => (
                    <ListItem key={grocery.id}>
                      <ListItemText primary={grocery.grocery_name} />
                      <Container sx={{ gap: "10px" }}>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => this.handleOpenModal(grocery)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => this.deleteGrocery(grocery)}
                          >
                            <DeleteIcon />
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
                <Typography sx={{ fontWeight: "bold" }}>
                  Einheit bearbeiten
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {measures.map((measure) => (
                    <ListItem key={measure.id}>
                      <ListItemText primary={measure.unit} />
                      <Container sx={{ display: "flex", gap: "10px" }}>
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                           
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => this.deleteMeasure(measure)}
                          >
                            <DeleteIcon />
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
        <Modal open={modalOpen} onClose={this.handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" component="h2">
              Lebensmittel bearbeiten
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              value={editedGroceryName}
              onChange={this.handleEditChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleUpdateGrocery}
              sx={{ mt: 2 }}
            >
              Speichern
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.handleCloseModal}
              sx={{ mt: 2, ml: 2 }}
            >
              Abbrechen
            </Button>
          </Box>
        </Modal>
      </>
    );
  }
}

export default Settings;
