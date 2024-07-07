import React from "react";
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const TitleHousehold = () => {
  const [currentUser, setCurrentUser] = useState(null); // Zustand zur Speicherung des aktuellen Benutzers.

  useEffect(() => {
    const auth = getAuth(); // Holt die Firebase-Auth-Instanz.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Setzt den aktuellen Benutzerzustand, wenn sich der Authentifizierungszustand ändert.
    });

    return unsubscribe; // Bereinigt den Listener bei der Demontage.
  }, []);

  const firstName = currentUser?.displayName
    ? currentUser.displayName.split(" ")[0]
    : ""; // Holt den Vornamen des aktuellen Benutzers.



  return (
    <>
      <Typography
        sx={{
          alignItems: "center",
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "2rem" },
          fontStyle: "normal",
          color: "text.primary",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: "135px",
          marginBottom: "0px",
        }}
      >
        Willkommen {firstName} !
        <CelebrationRoundedIcon sx={{width: { xs: "1.5rem", sm: "2rem", md: "3rem" },}}/>
      </Typography>
    </>
  );
};

export default TitleHousehold;
