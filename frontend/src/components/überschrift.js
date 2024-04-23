import React from "react";
import { UserAuth } from "../context/AuthContext";
import "./überschrift.css";
import CelebrationIcon from "@mui/icons-material/Celebration";

const Überschrift = () => {
  const { user } = UserAuth();

  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "";
  return (
    <>
      <h2 className="caveat-logfont-header">
        Welcome Back, {firstName} !
        <CelebrationIcon fontSize="large"></CelebrationIcon>
      </h2>
    </>
  );
};

export default Überschrift;
