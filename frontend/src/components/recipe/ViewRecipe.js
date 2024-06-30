import React from "react";
import {
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const ViewRecipe = ({ open, handleClose, recipe, ingredients }) => {
  if (!recipe) return null;

  console.log('ViewRecipe ===>', recipe);
  console.log('Detailed ingredients ===>', ingredients);

  return (
    <Paper sx={{}}>
      <Dialog
        scroll="paper"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "100%", 
            height: "auto", 
            position: "absolute",
            transform: "translate(0%, 0%)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {recipe.recipe_name}
          <DialogActions>
            <Button onClick={handleClose}>
              <CloseRoundedIcon />
            </Button>
          </DialogActions>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            <strong>Dauer:</strong> {recipe.duration} Minuten
          </Typography>
          <Typography variant="body1">
            <strong>Portionen:</strong> {recipe.portion}
          </Typography>
          <Typography variant="body1">
            <strong>Zubereitung:</strong>
          </Typography>
          <Typography variant="body2" paragraph>
            {recipe.instruction}
          </Typography>
          <Typography variant="body1">
            <strong>Zutaten:</strong>
          </Typography>
          <List>
            {ingredients.map((ingredient, index) => (
              <ListItem key={index}>
                <ListItemText
                  style={{ lineHeight: 1, margin: 0 }}
                  primary={`⪧  ${ingredient.quantity} ${ingredient.unit} / ${ingredient.grocery_name}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Button color="primary">Let him cook</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ViewRecipe;
