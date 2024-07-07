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
}) => {
  const userContext = useContext(UserContext); // Verwendet den UserContext.
  const navigate = useNavigate(); // Verwendet den useNavigate-Hook für die Navigation.

  const handleDeleteClick = (householdId, event) => {
    event.stopPropagation(); // Verhindert das Auslösen des Box-Klickhandlers.
    setHouseholdIdToDelete(householdId); // Setzt die ID des zu löschenden Haushalts.
    handleOpenDialog(householdId, "household"); // Öffnet den Bestätigungsdialog.
    handleAnchorClose(householdId); // Schließt das Menü.
  };

  const handleEditClick = (householdId, event) => {
    event.stopPropagation(); // Verhindert das Auslösen des Box-Klickhandlers.
    handleAnchorEdit(householdId); // Bearbeitet den Haushalt.
  };

  const handleBoxClick = (householdId) => {
    navigate(`/home/${householdId}`); // Navigiert zur Haushalt-Seite.
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
        width: { xs: "150px", sm: "175px", md: "200px" },
        maxWidth: "200px",
        height: { xs: "100px", sm: "110px", md: "125px" },
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
            event.stopPropagation();
            handleAnchorClick(household.id, event);
          }}
          sx={{
            position: "absolute",
            top: "2px",
            right: "2px",
            width: { xs: "25px", sm: "30px", md: "35px" },
            height: { xs: "25px", sm: "30px", md: "35px" },
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
        onClose={(event) => {
          event.stopPropagation();
          handleAnchorClose(household.id);
        }}
        sx={{
          zIndex: 2,
        }}
      >
        <MenuItem
          onClick={(event) => {
            event.stopPropagation();
            handleEditClick(household.id, event);
          }}
          disableRipple
          sx={{ zIndex: 2, fontSize: { xs: "0.7rem", sm: "1rem" } }}
        >
          <ListItemIcon
            sx={{
              zIndex: 2,
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
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteClick(household.id, event);
          }}
          disableRipple
          sx={{ zIndex: 2, fontSize: { xs: "0.7rem", sm: "1rem" } }}
        >
          <ListItemIcon
            sx={{
              zIndex: 2,
              minWidth: { xs: "0px", sm: "40px" },
              display: { xs: "none", sm: "flex" },
            }}
          >
            <DeleteIcon sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }} />
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
          fontSize: { xs: "1rem", sm: "1.2rem", md: "1.5rem", xl: "1.5rem" },
        }}
      >
        {household.household_name}
      </Typography>
    </Paper>
  ));
};

export default Household;
