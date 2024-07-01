import React, { useState, useCallback, useEffect } from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Container,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ViewRecipe from './ViewRecipe';
import SmartFridgeAPI from '../../api/SmartFridgeAPI';

const Recipe = ({
  recipes,
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  anchorEls,
  openMenus,
  handleOpenDialog,
  setIdToDelete,
  refreshGroceryList
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailedIngredients, setDetailedIngredients] = useState([]);


  const handleRecipeClick = async (recipe) => {
    setSelectedRecipe(recipe);
    await fetchIngredients(recipe.recipeId);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedRecipe(null);
    setDetailedIngredients([]);
  };

  const handleDeleteClick = (recipeId) => {
    setIdToDelete(recipeId);
    handleOpenDialog(recipeId, 'recipe');
    handleAnchorClose(recipeId);
  };

  const fetchIngredients = useCallback(async (recipeId) => {
    if (recipeId) {
      const api = SmartFridgeAPI.getAPI();
      try {
        const groceryStatementBOs = await api.getGroceryInRecipeId(recipeId);
        const detailedIngredientsPromises = groceryStatementBOs.map(async (ingredient) => {
          const [grocery] = await api.getGroceryById(ingredient.grocery_id);
          const [measure] = await api.getMeasureById(ingredient.unit_id);
          return {
            ...ingredient,
            grocery_name: grocery.grocery_name,
            unit: measure.unit,
          };
        });
        const detailedIngredientsResults = await Promise.all(detailedIngredientsPromises);
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
          key={recipe.recipeId}
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'primary.light',
            color: 'background.default',
            width: '200px',
            maxWidth: '200px',
            height: '125px',
            borderRadius: '10px',
            '&:hover': { boxShadow: '3px 3px 6px 2px rgba(0, 0, 0, 0.25)' },
          }}
          onClick={() => handleRecipeClick(recipe)}
        >
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenus[recipe.id] ? 'long-menu' : undefined}
            aria-expanded={openMenus[recipe.id] ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(event) => handleAnchorClick(recipe.id, event)}
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '35px',
              height: '35px',
            }}
          >
            <MoreVertIcon sx={{ color: 'background.default' }} />
          </IconButton>

          <Menu
            MenuListProps={{ 'aria-labelledby': 'long-button' }}
            anchorEl={anchorEls[recipe.id]}
            open={openMenus[recipe.id]}
            onClose={() => handleAnchorClose(recipe.id)}
          >
            <MenuItem
              onClick={() => handleAnchorEdit(recipe.id)}
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
              onClick={() => handleDeleteClick(recipe.id)}
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
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              height:"125px",
              width:"200px",
              // pmarginBottom:"100px",
            }}
            onClick={() => handleRecipeClick(recipe)}
          >
            <Typography
              variant="h5"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                color: 'background.default',
                maxWidth: '200px',
              }}
            >
              {recipe.recipe_name}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                color: 'background.default',
                maxWidth: '200px',
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
