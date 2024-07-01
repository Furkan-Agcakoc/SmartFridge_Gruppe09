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
  SettingsGroceryDelete: "Lebensmittel kann nicht gelöscht werden, da es im Kühlschrank vorhanden ist!",
  SettingsMeasureDelete: "Einheit kann nicht gelöscht werden, da es im Kühlschrank vorhanden ist!",
  SettingsEdit: "Füllen Sie das feld aus!",

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