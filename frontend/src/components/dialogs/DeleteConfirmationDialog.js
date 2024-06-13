import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";

// Texts for different dialog types
const dialogTexts = {
  household: {
    title: "Haushalt löschen",
    description:
      "Sind Sie sicher, dass Sie diesen Haushalt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  },
  grocery: {
    title: "Einkaufsliste löschen",
    description:
      "Sind Sie sicher, dass Sie diese Einkaufsliste löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  },
  recipe: {
    title: "Rezept löschen",
    description:
      "Sind Sie sicher, dass Sie dieses Rezept löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  },
};

const DeleteConfirmationDialog = ({
  dialogOpen,
  dialogType,
  handleCloseDialog,
  handleConfirmDelete,
  // handleConfirmDeleteHousehold,
  // handleConfirmDeleteGrocery,
}) => {
  const dialogText = dialogTexts[dialogType] || {};

  // const handleClickDelete = (id) => {
  //   if (dialogType === 'grocery') {
  //     handleConfirmDeleteGrocery(id);
  //   } else if (dialogType === 'household') {
  //     handleConfirmDeleteHousehold(id);
  //   } else {
  //     console.error('handleConfirmDelete function is not defined');
  //   }
  // };

  const handleClickDelete = () => {
    handleConfirmDelete();
    handleCloseDialog();
  };

  return (
    <Dialog
      open={dialogOpen}
      TransitionComponent={Slide}
      keepMounted
      onClose={handleCloseDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{dialogText.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {dialogText.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Abbrechen</Button>
        <Button onClick={handleClickDelete}>Löschen</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
