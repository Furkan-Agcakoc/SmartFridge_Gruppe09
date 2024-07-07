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

const dialogTexts = {
  household: {
    title: "Haushalt löschen?",
    description:
      "Sind Sie sicher, dass Sie diesen Haushalt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  },
  grocery: {
    title: "Lebensmittel löschen?",
    description:
      "Sind Sie sicher, dass Sie dieses Lebensmittel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  },
  recipe: {
    title: "Rezept löschen?",
    description:
      "Sind Sie sicher, dass Sie dieses Rezept löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
  },
};

const DeleteConfirmationDialog = ({
  dialogOpen,
  dialogType,
  handleCloseDialog,
  handleConfirmDelete,
}) => {
  const dialogText = dialogTexts[dialogType] || {}; // Wählt den passenden Text basierend auf dem Dialogtyp.

  const handleClickDelete = () => {
    handleConfirmDelete(); // Führt die Löschbestätigung aus.
    handleCloseDialog(); // Schließt den Dialog.
  };
  return (
    <Dialog
      open={dialogOpen}
      TransitionComponent={Slide}
      keepMounted
      onClose={handleCloseDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle
        sx={{ fontWeight: "bold", marginBottom: "0", paddingBottom: "0" }}
      >
        {dialogText.title}
      </DialogTitle>
      <DialogContent>
        <hr
          style={{
            marginTop: "0",
            padding: "0",
            borderColor: "rgba(0, 50, 0, 0.1)",
          }}
        />
        <DialogContentText id="alert-dialog-slide-description">
          {dialogText.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          sx={{
            width: "125px",
            color: "primary.dark",
            bgcolor: "rgba(0, 50, 0, 0.1)",
            "&:hover": {
              bgcolor: "primary.dark",
              color: "background.default",
              border: "none",
            },
          }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleClickDelete}
          sx={{
            width: "125px",
            bgcolor: "rgba(197, 0, 0, 0.1)",
            color: "error.main",
            border: "2px solid #c50000 ",
            "&:hover": {
              bgcolor: "error.main",
              color: "background.default",
            },
          }}
        >
          Löschen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
