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

const HouseholdList = ({
  households,
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  anchorEls,
  openMenus,
  handleOpenDialog,
}) => {
  const handleEditClick = (householdId) => {
    handleOpenDialog("household", householdId);
    handleAnchorClose(householdId);
  };

  return households.map((household) => (
    <Box
      key={household.householdId}
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
        aria-controls={
          openMenus[household.householdId] ? "long-menu" : undefined
        }
        aria-expanded={openMenus[household.householdId] ? "true" : undefined}
        aria-haspopup="true"
        onClick={(event) => handleAnchorClick(household.householdId, event)}
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
        anchorEl={anchorEls[household.householdId]}
        open={openMenus[household.householdId]}
        onClose={() => handleAnchorClose(household.householdId)}
      >
        <MenuItem
          onClick={() => handleAnchorEdit(household.householdId)}
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
          onClick={() => handleEditClick(household.householdId)}
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
        {household.householdName}
      </Typography>
    </Box>
  ));
};

export default HouseholdList;
