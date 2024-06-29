import React, { useEffect, useState } from "react";
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
import SmartFridgeAPI from "../../api/SmartFridgeAPI";

const Grocery = ({
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  anchorEls,
  openMenus,
  handleOpenDialog,
  setIdToDelete,
  fridgeId,
  getGroceryInFridgeId,
}) => {
  const [groceryStatements, setGroceryStatements] = useState([]);
  const [groceryNames, setGroceryNames] = useState({});
  const [measureNames, setMeasureNames] = useState({});
  const [error, setError] = useState(null);

  const handleDeleteClick = (groceryId) => {
    setIdToDelete(groceryId);
    handleOpenDialog(groceryId, "grocery");
    handleAnchorClose(groceryId);
  };

  useEffect(() => {
    const fetchGroceryStatements = async () => {
      try {
        const groceryStatements = await getGroceryInFridgeId(fridgeId);
        setGroceryStatements(groceryStatements);

        const groceryIds = groceryStatements.map(
          (statement) => statement.grocery_id
        );
        const unitIds = groceryStatements.map((statement) => statement.unit_id);

        const fetchGroceryNames = async () => {
          try {
            const groceryNamesPromises = groceryIds.map((id) =>
              SmartFridgeAPI.getAPI().getGroceryById(id)
            );
            const groceryNamesArray = await Promise.all(groceryNamesPromises);
            const namesMap = groceryNamesArray.flat().reduce((acc, grocery) => {
              acc[grocery.id] = grocery.grocery_name;
              return acc;
            }, {});
            setGroceryNames(namesMap);
          } catch (error) {
            console.error("Error fetching grocery names:", error);
            setError(error);
          }
        };

        const fetchMeasureNames = async () => {
          try {
            const measureNamesPromises = unitIds.map((id) =>
              SmartFridgeAPI.getAPI().getMeasureById(id)
            );
            const measureNamesArray = await Promise.all(measureNamesPromises);
            const measureMap = measureNamesArray
              .flat()
              .reduce((acc, measure) => {
                acc[measure.id] = measure.unit;
                return acc;
              }, {});
            setMeasureNames(measureMap);
          } catch (error) {
            console.error("Error fetching measure names:", error);
            setError(error);
          }
        };

        fetchGroceryNames();
        fetchMeasureNames();
      } catch (error) {
        console.error("Error fetching grocery statements:", error);
        setError(error);
      }
    };

    fetchGroceryStatements();
  }, [fridgeId, getGroceryInFridgeId]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    groceryStatements.map((grocery) => (
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
            {groceryNames[grocery.grocery_id]}
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
            {grocery.quantity} {measureNames[grocery.unit_id]}
          </Typography>
        </Container>
      </Paper>
    ))
  );
};

export default Grocery;
