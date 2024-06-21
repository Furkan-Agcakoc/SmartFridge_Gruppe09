import React, { Component } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box, 
  TextField
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";

class AllGrocery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groceries: [],
      measures: [],
      inhabitants: [],
      editDialogOpen: false,
      editItem: null,
      editType: '',
      deleteConfirmationOpen: false,
      itemToDelete: null,
      deleteType: '',
    };
  }

  componentDidMount() {
    this.loadGroceries();
    this.loadMeasures();
  }

  loadGroceries = () => {
    SmartFridgeAPI.api.getGrocery().then((groceries) => {
      this.setState({ groceries });
    });
  };

  loadMeasures = () => {
    SmartFridgeAPI.api.getMeasure().then((measures) => {
      this.setState({ measures });
    });
  };

  loadInhabitants = () => {
    const householdId = 1; // Assuming a household ID is provided or derived from somewhere
    SmartFridgeAPI.api.getInhabitants(householdId).then((inhabitants) => {
      this.setState({ inhabitants });
    });
  };

  handleEditClick = (item, type) => {
    this.setState({
      editDialogOpen: true,
      editItem: { ...item },
      editType: type,
    });
  };

  handleDeleteClick = (itemId, type) => {
    this.setState({
      deleteConfirmationOpen: true,
      itemToDelete: { id: itemId, type: type },
    });
  };

  handleConfirmDelete = () => {
    const { itemToDelete, groceries, measures } = this.state;

    if (itemToDelete.type === 'grocery') {
      this.setState({
        groceries: groceries.filter((grocery) => grocery.id !== itemToDelete.id),
      });
    } else if (itemToDelete.type === 'measure') {
      this.setState({
        measures: measures.filter((measure) => measure.id !== itemToDelete.id),
      });
    }

    this.setState({
      deleteConfirmationOpen: false,
      itemToDelete: null,
    });
  };

  handleCancelDelete = () => {
    this.setState({
      deleteConfirmationOpen: false,
      itemToDelete: null,
    });
  };

  handleEditChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      editItem: {
        ...prevState.editItem,
        [name]: value,
      },
    }));
  };

  handleEditSave = () => {
    const { editItem, groceries, measures, editType } = this.state;

    if (editType === 'grocery') {
      this.setState({
        groceries: groceries.map((grocery) =>
          grocery.id === editItem.id ? editItem : grocery
        ),
      });
    } else if (editType === 'measure') {
      this.setState({
        measures: measures.map((measure) =>
          measure.id === editItem.id ? editItem : measure
        ),
      });
    }

    this.setState({
      editDialogOpen: false,
      editItem: null,
      editType: '',
    });
  };

  handleEditCancel = () => {
    this.setState({
      editDialogOpen: false,
      editItem: null,
      editType: '',
    });
  };
  
  render() {
    const { groceries, measures, inhabitants, editDialogOpen, editItem, deleteConfirmationOpen } = this.state;

    return (
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
        <Paper sx={{ width: "100%", maxWidth: "895px" }}>
          <Typography variant="h6" gutterBottom sx={{ padding: 2, fontWeight:"bold" }}>
            Haushaltsverwaltung
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Lebensmittel bearbeiten</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {groceries.map((grocery) => (
                  <ListItem key={grocery.id}>
                    <ListItemText
                      primary={`${grocery.grocery_name}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => this.handleEditClick(grocery, 'grocery')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteClick(grocery.id, 'grocery')}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography>Maßeinheiten bearbeiten</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {measures.map((measure) => (
                  <ListItem key={measure.id}>
                    <ListItemText
                      primary={`${measure.unit}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => this.handleEditClick(measure, 'measure')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteClick(measure.id, 'measure')}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography>Bewohner bearbeiten</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {inhabitants.map((inhabitant) => (
                  <ListItem key={inhabitant.userId}>
                    <ListItemText
                      primary={`${inhabitant.userName}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => this.handleEditClick(inhabitant, 'inhabitant')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteClick(inhabitant.userId, 'inhabitant')}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Paper>
        <Dialog open={editDialogOpen} onClose={this.handleEditCancel}>
          <DialogTitle>Bearbeiten</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Namen bearbeiten
            </DialogContentText>
            {editItem && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Name"
                  name="grocery_name"
                  value={editItem.grocery_name || editItem.unit}
                  onChange={this.handleEditChange}
                  fullWidth
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleEditCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={deleteConfirmationOpen} onClose={this.handleCancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancelDelete} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.handleConfirmDelete} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

export default AllGrocery;
