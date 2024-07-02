import React, { useState, useEffect } from "react";
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
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import AlertComponent from "../dialogs/AlertComponent"; // Import AlertComponent

const ViewRecipe = ({
  open,
  handleClose,
  recipe,
  ingredients,
  refreshGroceryList,
}) => {
  const [nickname, setNickname] = useState("");
  const [showAlert, setShowAlert] = useState(false); // State to control alert visibility

  useEffect(() => {
    const getUserNickname = async () => {
      if (recipe?.user_id) {
        try {
          const users = await SmartFridgeAPI.getAPI().getUserById(
            recipe.user_id
          );
          const user = users[0];
          setNickname(user.nickname);
        } catch (error) {
          console.error("Error fetching user nickname:", error);
        }
      }
    };

    getUserNickname();
  }, [recipe?.user_id]);

  if (!recipe) return null;

  //How do I know whether the recipe has been cooked?
  //Funktioniert nicht ganz noch nicht hinbekommen

  const handleOnCookRecipe = async () => {
    if (recipe.id && recipe.fridge_id) {
      try {
        const response = await SmartFridgeAPI.getAPI().cookRecipe(
          recipe.id,
          recipe.fridge_id
        );
        console.log("Response:", response);
        if (response === "Rezept gekocht") {
          setShowAlert(true);
        } else {
          setShowAlert(true);
        }
        refreshGroceryList();
        handleClose();
        console.log("Recipe cooked successfully!");
      } catch (error) {
        console.error("Error cooking recipe:", error);
        setShowAlert(true); // Show alert on error
      }
    } else {
      console.error("Recipe ID or Fridge ID is undefined");
    }
  };

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
            fontWeight: "bold",
          }}
        >
          {recipe.recipe_name} von {nickname}
          <DialogActions>
            <Button onClick={handleClose}>
              <CloseRoundedIcon />
            </Button>
          </DialogActions>
        </DialogTitle>
        <DialogContent>
          <AlertComponent showAlert={showAlert} alertType="noGroceriesToCook" />
          <Typography>
            <strong>Dauer:</strong> {recipe.duration} Minuten
          </Typography>
          <Typography>
            <strong>Portionen:</strong> {recipe.portion}
          </Typography>
          <Typography>
            <strong>Zubereitung:</strong>
          </Typography>
          <Typography paragraph>{recipe.instruction}</Typography>
          <Typography>
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
          <Button
            sx={{
              bgcolor: "primary.main",
              color: "background.paper",
              boxShadow: 1,
              "&:hover": {
                color: "success.dark",
                boxShadow: 3,
                backgroundColor: "success.gwhite",
              },
            }}
            onClick={handleOnCookRecipe}
          >
            Zubereiten
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ViewRecipe;
