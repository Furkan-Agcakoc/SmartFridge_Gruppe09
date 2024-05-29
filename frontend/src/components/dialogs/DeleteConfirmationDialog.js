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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteConfirmationDialog = ({
  handleCloseDialog,
  handleConfirmDelete,
}) => {
  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Haushalt löschen bestätigen"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Sind Sie sicher, dass Sie dieses Haushalt löschen möchten? Alle
          Mitglieder, der Kühlschrankinhalt und alle gespeicherten Rezepte
          werden dauerhaft entfernt. Diese Aktion kann nicht rückgängig gemacht
          werden.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Abbrechen</Button>
        <Button onClick={handleConfirmDelete}>Löschen</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
