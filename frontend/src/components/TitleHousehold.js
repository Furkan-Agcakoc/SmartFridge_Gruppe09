import React from "react";
import CelebrationIcon from "@mui/icons-material/Celebration";
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
          color: "third.main",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: "130px",
          marginBottom: "0px",
        }}
      >
        Welcome Back, {firstName} !
        <CelebrationIcon fontSize="large" />
      </Typography>
    </>
  );
};

export default TitleHousehold;
