import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Grcoery = ({
  groceries,
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  handleClickOpenDialog,
  anchorEls,
  openMenus,
}) => {
  return groceries.map((grocery) => (
    <Box
      key={grocery.groceryId}
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
        boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
        "&:hover": { border: "0.1px solid #13a88a" },
      }}
    >
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={openMenus[grocery.groceryId] ? "long-menu" : undefined}
        aria-expanded={openMenus[grocery.groceryId] ? "true" : undefined}
        aria-haspopup="true"
        onClick={(event) => handleAnchorClick(grocery.groceryId, event)}
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
        anchorEl={anchorEls[grocery.groceryId]}
        open={openMenus[grocery.groceryId]}
        onClose={() => handleAnchorClose(grocery.groceryId)}
      >
        <MenuItem
          onClick={() => handleAnchorEdit(grocery)}
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
          onClick={() => handleClickOpenDialog(grocery.groceryId)}
          className="menu-item"
          disableRipple
        >
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
      <Typography
        variant="h5"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "background.default",
          width: "200px",
          maxWidth: "200px",
          height: "125px",
        }}
      >
        {grocery.groceryName}
      </Typography>
    </Box>
  ));
};

export default Grcoery;
