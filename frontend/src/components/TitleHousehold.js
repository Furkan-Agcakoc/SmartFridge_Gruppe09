import React from "react";
import CelebrationRoundedIcon from '@mui/icons-material/CelebrationRounded';
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const TitleHousehold = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const firstName = currentUser?.displayName
    ? currentUser.displayName.split(" ")[0]
    : "";

  return (
    <>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "2rem",
          fontStyle: "normal",
          color: "text.primary",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: "135px",
          marginBottom: "0px",
        }}
      >
        Welcome Back, {firstName} !
        <CelebrationRoundedIcon fontSize="large" />
      </Typography>
    </>
  );
};

export default TitleHousehold;
