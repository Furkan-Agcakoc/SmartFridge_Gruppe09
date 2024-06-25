import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UserContext from "../contexts/UserContext";

const Household = ({
  households,
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  anchorEls,
  openMenus,
  setHouseholdIdToDelete,
  handleOpenDialog,
  getFridgeByHouseholdId

}) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const handleDeleteClick = (householdId, event) => {
    event.stopPropagation(); // Prevents triggering the Box click handler
    setHouseholdIdToDelete(householdId);
    handleOpenDialog(householdId, "household");
    handleAnchorClose(householdId);
  };

  const handleEditClick = (householdId, event) => {
    event.stopPropagation(); // Prevents triggering the Box click handler
    handleAnchorEdit(householdId);
  };

  const handleBoxClick = (householdId) => {
    navigate(`/home/${householdId}`);
    getFridgeByHouseholdId(householdId);   
  };

  return households.map((household) => (
    <Paper
      key={household.id}
      onClick={() => handleBoxClick(household.id)}
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
        zIndex: 1,
        "&:hover": { boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)" },
      }}
    >
      {household.owner_id === userContext.id && (
        <IconButton
          aria-label="more"
          aria-controls={openMenus[household.id] ? "long-menu" : undefined}
          aria-expanded={openMenus[household.id] ? "true" : undefined}
          aria-haspopup="true"
          onClick={(event) => {
            event.stopPropagation(); // Prevents triggering the Box click handler
            handleAnchorClick(household.id, event);
          }}
          style={{
            position: "absolute",
            top: "2px",
            right: "2px",
            width: "35px",
            height: "35px",
            zIndex: 2,
          }}
        >
          <MoreVertIcon sx={{ color: "background.default" }} />
        </IconButton>
      )}

      <Menu
        MenuListProps={{ "aria-labelledby": "long-button" }}
        anchorEl={anchorEls[household.id]}
        open={openMenus[household.id] || false}
        onClose={() => handleAnchorClose(household.id)}
        sx={{ zIndex: 2 }}
      >
        <MenuItem
          onClick={(event) => handleEditClick(household.id, event)}
          disableRipple
          sx={{ zIndex: 2 }}
        >
          <ListItemIcon sx={{ zIndex: 2 }}>
            <EditIcon />
          </ListItemIcon>
          Edit
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={(event) => handleDeleteClick(household.id, event)}
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
        {household.household_name}
      </Typography>
    </Paper>
  ));
};

export default Household;
