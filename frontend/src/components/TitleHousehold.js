import React from "react";
import "./TitleHousehold.css";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

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
      <h2 className="caveat-logfont-header">
        Welcome Back, {firstName} !
        <CelebrationIcon fontSize="large"></CelebrationIcon>
      </h2>
    </>
  );
};

export default TitleHousehold;
