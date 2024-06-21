import React, { Component } from "react";
import {
  Paper,
  TextField,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

class AllGrocery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groceries: [
        { groceryId: 1, groceryName: "Milk" },
        { groceryId: 2, groceryName: "Eggs" },
      ],
      measures: [
        { measureId: 1, measureName: "Kilogram" },
        { measureId: 2, measureName: "Liter" },
      ],
      editDialogOpen: false,
      editItem: null,
      editType: '',
      deleteConfirmationOpen: false,
      itemToDelete: null,
      deleteType: '',
    };
  }

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
        groceries: groceries.filter((grocery) => grocery.groceryId !== itemToDelete.id),
      });
    } else if (itemToDelete.type === 'measure') {
      this.setState({
        measures: measures.filter((measure) => measure.measureId !== itemToDelete.id),
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
          grocery.groceryId === editItem.groceryId ? editItem : grocery
        ),
      });
    } else if (editType === 'measure') {
      this.setState({
        measures: measures.map((measure) =>
          measure.measureId === editItem.measureId ? editItem : measure
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
    const { groceries, measures, editDialogOpen, editItem, deleteConfirmationOpen } = this.state;

    return (
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
        <Paper sx={{ width: "100%", maxWidth: "895px" }}>
          <Typography variant="h6" gutterBottom sx={{ padding: 2 }}>
            Lists
          </Typography>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>All Groceries</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {groceries.map((grocery) => (
                  <ListItem key={grocery.groceryId}>
                    <ListItemText
                      primary={`${grocery.groceryName}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => this.handleEditClick(grocery, 'grocery')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteClick(grocery.groceryId, 'grocery')}>
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
              <Typography>All Measures</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {measures.map((measure) => (
                  <ListItem key={measure.measureId}>
                    <ListItemText
                      primary={`${measure.measureName}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="edit" onClick={() => this.handleEditClick(measure, 'measure')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => this.handleDeleteClick(measure.measureId, 'measure')}>
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
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edit the name of the item.
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
                  name="groceryName"
                  value={editItem.groceryName || editItem.measureName}
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
