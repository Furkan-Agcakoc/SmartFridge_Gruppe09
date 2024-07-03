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
        width: { xs: "150px", sm: "175px", md: "200px" },
        maxWidth: "200px",
        height: { xs: "100px", sm: "110px", md: "125px" },
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
        sx={{
          position: "absolute",
          top: "2px",
          right: "2px",
          width: { xs: "25px", sm: "30px", md: "35px" },
          height: { xs: "25px", sm: "30px", md: "35px" },
        }}
      >
        <MoreVertIcon sx={{ color: "background.default" }} />
      </IconButton>

      <Menu
        MenuListProps={{ "aria-labelledby": "long-button" }}
        anchorEl={anchorEls[grocery.id] || null}
        open={openMenus[grocery.id] || false}
        onClose={() => handleAnchorClose(grocery.id)}
      >
        <MenuItem
          onClick={() => handleAnchorEdit(grocery.id)}
          className="menu-item"
          disableRipple
          sx={{ fontSize: { xs: "0.7rem", sm: "1rem" } }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: "0px", sm: "40px" },
              display: { xs: "none", sm: "flex" },
            }}
          >
            <EditIcon sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }} />
          </ListItemIcon>
          Edit
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => handleDeleteClick(grocery.id)}
          className="menu-item"
          disableRipple
          sx={{ fontSize: { xs: "0.7rem", sm: "1rem" } }}
        >
          <ListItemIcon
            sx={{
              minWidth: { xs: "0px", sm: "40px" },
              display: { xs: "none", sm: "flex" },
            }}
          >
            <DeleteIcon sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }} />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          maxWidth: "200px",
          padding: 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "center",
            color: "background.default",
            width: "100%",
            fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem", xl: "1.5rem" },
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
            width: "100%",
            fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem", xl: "1.2rem" },
          }}
        >
          {grocery.quantity} {grocery.unit_name}
        </Typography>
      </Container>
    </Paper>
  ));
};

export default Grocery;
