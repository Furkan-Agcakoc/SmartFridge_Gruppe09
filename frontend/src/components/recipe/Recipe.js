import React, { useState, useCallback, useEffect } from "react";
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
import ViewRecipe from "./ViewRecipe";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";

const Recipe = ({
  recipes,
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  anchorEls,
  openMenus,
  handleOpenDialog,
  setIdToDelete,
  refreshGroceryList,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailedIngredients, setDetailedIngredients] = useState([]);

  const handleRecipeClick = async (recipe) => {
    setSelectedRecipe(recipe);
    await fetchIngredients(recipe.id);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedRecipe(null);
    setDetailedIngredients([]);
  };

  const handleDeleteClick = (recipeId) => {
    setIdToDelete(recipeId);
    handleOpenDialog(recipeId, "recipe");
    handleAnchorClose(recipeId);
  };


  const fetchIngredients = useCallback(async (recipeId) => {
    if (recipeId) {
      const api = SmartFridgeAPI.getAPI();
      try {
        const groceryStatementBOs = await api.getGroceryInRecipeId(recipeId);
        const detailedIngredientsPromises = groceryStatementBOs.map(
          async (ingredient) => {
            const [grocery] = await api.getGroceryById(ingredient.grocery_id);
            const [measure] = await api.getMeasureById(ingredient.unit_id);
            return {
              ...ingredient,
              grocery_name: grocery.grocery_name,
              unit: measure.unit,
            };
          }
        );
        const detailedIngredientsResults = await Promise.all(
          detailedIngredientsPromises
        );
        setDetailedIngredients(detailedIngredientsResults);
        setDetailDialogOpen(true);
      } catch (error) {
        console.error("Error fetching ingredients:", error);
      }
    } else {
      console.error("Recipe or recipe ID is undefined");
    }
  }, []);

  useEffect(() => {
    if (selectedRecipe) {
      fetchIngredients(selectedRecipe.id);
    }
  }, [selectedRecipe, fetchIngredients]);

  return (
    <>
      {recipes.map((recipe) => (
        <Paper
          key={recipe.id}
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
          onClick={() => handleRecipeClick(recipe)}
        >
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenus[recipe.id] ? "long-menu" : undefined}
            aria-expanded={openMenus[recipe.id] ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => {
              event.stopPropagation();
              handleAnchorClick(recipe.id, event);
            }}
            style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              width: { xs: "25px", sm: "30px", md: "35px" },
              height: { xs: "25px", sm: "30px", md: "35px" },
              zIndex: 10,
            }}
          >
            <MoreVertIcon sx={{ color: "background.default" }} />
          </IconButton>

          <Menu
            MenuListProps={{ "aria-labelledby": "long-button" }}
            anchorEl={anchorEls[recipe.id] || null}
            open={openMenus[recipe.id] || false}
            onClose={(event) => {
              event.stopPropagation();
              handleAnchorClose(recipe.id);
            }}
          >
            <MenuItem
              onClick={(event) => {
                event.stopPropagation();
                handleAnchorEdit(recipe.id);
              }}
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
              onClick={(event) => {
                event.stopPropagation();
                handleDeleteClick(recipe.id);
              }}
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
                <DeleteIcon
                  sx={{ fontSize: { xs: "0.9rem", sm: "1.25rem" } }}
                />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              height: "125px",
              width: "200px",
            }}
            onClick={() => handleRecipeClick(recipe)}
          >
            <Typography
              variant="h5"
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "background.default",
                maxWidth: "200px",
                fontSize: {
                  xs: "1rem",
                  sm: "1.2rem",
                  md: "1.5rem",
                  xl: "1.5rem",
                },
              }}
            >
              {recipe.recipe_name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: "flex",
                justifyContent: "center",
                color: "background.default",
                maxWidth: "200px",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.9rem",
                  md: "1rem",
                  xl: "1rem",
                },
              }}
            >
              Dauer: {recipe.duration} Minuten
            </Typography>
          </Container>
        </Paper>
      ))}
      {detailDialogOpen && (
        <ViewRecipe
          open={detailDialogOpen}
          handleClose={handleDetailDialogClose}
          recipe={selectedRecipe}
          ingredients={detailedIngredients}
          refreshGroceryList={refreshGroceryList}
        />
      )}
    </>
  );
};

export default Recipe;
