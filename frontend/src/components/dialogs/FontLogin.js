import React from "react";
import { Typography } from "@mui/material";

const FontLogin = () => {
  return (
    <>
      <Typography
        variant="h5"
        // className="caveat-logfont-home"
        color="third.main"
        sx={{
          fontSize: "35px",
          fontWeight: 600,
          color: "#162938",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: "140px",
          marginbottom: "0px",
        }}
      >
        Willkommen bei Smart Fridge!
      </Typography>
    </>
  );
};

export default FontLogin;
