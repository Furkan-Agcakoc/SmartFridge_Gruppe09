// src/components/AlertComponent.js
import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box"; // Import Box

// Alert messages
const alertMessages = {
  household: "Bitte geben Sie einen Haushaltsnamen ein!",
  grocery: "Bitte füllen Sie alle Felder aus!",
  recipe:
    "Bitte füllen Sie alle Felder aus! Beachten Sie, dass mindestens eine Zutat in der Zutatenliste enthalten ist!",
  profile: "Bitte füllen Sie alle Felder aus!",
  SettingsGroceryDelete:
    "Lebensmittel kann nicht gelöscht werden, da es im Kühlschrank verwendet wird!",
  SettingsMeasureDelete:
    "Einheit kann nicht gelöscht werden, da es im Kühlschrank verwendet wird!",
  SettingsEdit: "Bitte füllen Sie das Feld aus!",
  noGroceriesToCook:
    "Sie können nicht kochen, da Sie nicht genügend Lebensmittel im Kühlschrank haben!",
  availableRecipes: "",
  // Weitere Nachrichten hier hinzufügen
};

// AlertComponent
const AlertComponent = ({
  showAlert,
  alertType,
  severity = "error",
  customMessage,
  onClose,
}) => {
  if (!showAlert) return null;

  const message = customMessage || alertMessages[alertType];

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      sx={{ width: "auto", marginBottom: "20px", mx: "5px" }}
    >
      <Box dangerouslySetInnerHTML={{ __html: message }} />
    </Alert>
  );
};

export default AlertComponent;
