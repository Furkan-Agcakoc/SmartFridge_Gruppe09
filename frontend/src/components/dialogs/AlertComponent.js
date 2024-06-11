// src/components/AlertComponent.js
import React from "react";
import Alert from "@mui/material/Alert";

// Alert messages
const alertMessages = {
  household: "Bitte geben Sie einen Haushaltsnamen ein!",
  grocery: "Bitte füllen Sie alle Felder aus!",
  recipe: "Zugriff verweigert.",
  profile: "Bitte füllen Sie alle Felder aus!",
  // Weitere Nachrichten hier hinzufügen
};

// AlertComponent
const AlertComponent = ({ showAlert, alertType }) => {
  if (!showAlert) return null;

  return (
    <Alert severity="error" sx={{ marginBottom: "20px" }}>
      {alertMessages[alertType]}
    </Alert>
  );
};

export default AlertComponent;
