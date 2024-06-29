import React from "react";
import {
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Container,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Grocery = ({
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  anchorEls,
  openMenus,
  handleOpenDialog,
  setIdToDelete,
  grocery,
  groceryStatements,
  measureNames,
  groceryNames,
}) => {
  const handleDeleteClick = (groceryId) => {
    setIdToDelete(groceryId);
    handleOpenDialog(groceryId, "grocery");
    handleAnchorClose(groceryId);
  };

  if (!groceryStatements || Object.keys(groceryStatements).length === 0) {
    return <div>Loading...</div>;
  }

  // console.log("measureNames in Grocery.js", measureNames);
  // console.log("groceryNames in Grocery.js", groceryNames);

  return groceryStatements.map((grocery) => (
    <Paper
      key={grocery.id}
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "primary.light",
        color: "background.default",
        width: "200px",
        maxWidth: "200px",
        height: "125px",
        borderRadius: "10px",
        "&:hover": { boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)" },
      }}
    >
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={openMenus[grocery.id] ? "long-menu" : undefined}
        aria-expanded={openMenus[grocery.id] ? "true" : undefined}
        aria-haspopup="true"
        onClick={(event) => handleAnchorClick(grocery.id, event)}
        style={{
          position: "absolute",
          top: "2px",
          right: "2px",
          width: "35px",
          height: "35px",
        }}
      >
        <MoreVertIcon sx={{ color: "background.default" }} />
      </IconButton>

      <Menu
        MenuListProps={{ "aria-labelledby": "long-button" }}
        anchorEl={anchorEls[grocery.id]}
        open={openMenus[grocery.id]}
        onClose={() => handleAnchorClose(grocery.id)}
      >
        <MenuItem
          onClick={() => handleAnchorEdit(grocery.id)}
          className="menu-item"
          disableRipple
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          Edit
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => handleDeleteClick(grocery.id)}
          className="menu-item"
          disableRipple
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "background.default",
            maxWidth: "200px",
          }}
        >
          {grocery.grocery_name}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "background.default",
            maxWidth: "200px",
          }}
        >
          {grocery.quantity} {grocery.unit_name}
        </Typography>
      </Container>
    </Paper>
  ));
};

export default Grocery;
