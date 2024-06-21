import React, { Component } from "react";
import {
  Paper,
  Button,
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
  DialogTitle
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

class AllGrocery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groceries: [
        { groceryId: 1, groceryName: "Milk" },
        { groceryId: 2, groceryName: "Eggs" },
      ],
      editDialogOpen: false,
      editGrocery: null,
    };
  }

  handleEditClick = (grocery) => {
    this.setState({
      editDialogOpen: true,
      editGrocery: { ...grocery },
    });
  };

  handleEditChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      editGrocery: {
        ...prevState.editGrocery,
        [name]: value,
      },
    }));
  };

  handleEditSave = () => {
    const { editGrocery, groceries } = this.state;
    this.setState({
      groceries: groceries.map((grocery) =>
        grocery.groceryId === editGrocery.groceryId ? editGrocery : grocery
      ),
      editDialogOpen: false,
      editGrocery: null,
    });
  };

  handleEditCancel = () => {
    this.setState({
      editDialogOpen: false,
      editGrocery: null,
    });
  };

  render() {
    const { groceries, editDialogOpen, editGrocery } = this.state;

    return (
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 3 }}>
        <Paper sx={{ width: "100%", maxWidth: "600px", mt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ padding: 2 }}>
            Grocery List
          </Typography>
          <List>
            {groceries.map((grocery) => (
              <ListItem key={grocery.groceryId}>
                <ListItemText
                  primary={`${grocery.groceryName}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => this.handleEditClick(grocery)}>
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
        <Dialog open={editDialogOpen} onClose={this.handleEditCancel}>
          <DialogTitle>Edit Grocery</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Edit the name of the grocery item.
            </DialogContentText>
            {editGrocery && (
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
                  value={editGrocery.groceryName}
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
      </Container>
    );
  }
}

export default AllGrocery;
