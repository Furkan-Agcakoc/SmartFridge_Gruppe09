import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide
} from '@mui/material';

// Texts for different dialog types
const dialogTexts = {
  household: {
    title: 'Haushalt löschen',
    description: 'Sind Sie sicher, dass Sie diesen Haushalt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
  },
  grocery: {
    title: 'Einkaufsliste löschen',
    description: 'Sind Sie sicher, dass Sie diese Einkaufsliste löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.'
  }
};

const DeleteConfirmationDialog = ({
  dialogOpen,
  dialogType,
  handleCloseDialog,
  handleConfirmDelete
}) => {
  const dialogText = dialogTexts[dialogType] || {};

  const handleDelete = () => {
    handleConfirmDelete();
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
        <Button onClick={handleDelete}>Löschen</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
