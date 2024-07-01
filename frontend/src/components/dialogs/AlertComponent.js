// src/components/AlertComponent.js
import React from "react";
import Alert from "@mui/material/Alert";

// Alert messages
const alertMessages = {
  household: "Bitte geben Sie einen Haushaltsnamen ein!",
  grocery: "Bitte füllen Sie alle Felder aus!",
  recipe: (
    <div>
      Bitte füllen Sie aller Felder aus! <br />
      Beachten Sie, dass mindestens eine Zutat in der Zutatenliste enthalten ist!
    </div>
  ),
  profile: "Bitte füllen Sie alle Felder aus!",
  SettingsGroceryDelete: "Lebensmittel kann nicht gelöscht werden, da es im Kühlschrank verwendet wird!",
  SettingsMeasureDelete: "Einheit kann nicht gelöscht werden, da es im Kühlschrank verwendet wird!",
  SettingsEdit: "Bitte füllen Sie das Feld aus!",

  // Weitere Nachrichten hier hinzufügen
};

// AlertComponent
const AlertComponent = ({ showAlert, alertType }) => {
  if (!showAlert) return null;

  return (
    <Alert severity="error" sx={{ width: "auto", marginBottom: "20px" }}>
      {alertMessages[alertType]}
    </Alert>
  );
};

export default AlertComponent;