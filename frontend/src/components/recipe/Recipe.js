import React, { useState } from 'react';
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

const Recipe = ({
  recipes,
  handleAnchorClick,
  handleAnchorClose,
  handleAnchorEdit,
  anchorEls,
  openMenus,
  handleOpenDialog,
  setIdToDelete,
}) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  console.log("Recipes in recipe component", recipes)


  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setDetailDialogOpen(true);
  };

  const handleDetailDialogClose = () => {
    setDetailDialogOpen(false);
    setSelectedRecipe(null);
  };

  const handleDeleteClick = (recipeId) => {
    setIdToDelete(recipeId);
    handleOpenDialog(recipeId, 'recipe');
    handleAnchorClose(recipeId);
  };

  return (
    <>
      {recipes.map((recipe) => (
        <Paper
          key={recipe.id}
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
      <ViewRecipe
        open={detailDialogOpen} 
        handleClose={handleDetailDialogClose} 
        recipe={selectedRecipe}
      />
    </>
  );
};

export default Recipe;
//Wo steht dass wenn handleRecipeClick ausgeführt wird und setdetaildialog auf true wird, dass ViewRecipe angezeigt wird?