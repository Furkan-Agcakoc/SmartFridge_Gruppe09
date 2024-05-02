import React from "react";
import "./TitleHousehold.css";
import CelebrationIcon from "@mui/icons-material/Celebration";

const TitleHousehold = () => {
  return (
    <>
      <h2 className="caveat-logfont-header">
        Welcome Back, Username !
        <CelebrationIcon fontSize="large"></CelebrationIcon>
      </h2>
    </>
  );
};

export default TitleHousehold;
