import React from "react";
import { Typography } from "@mui/material";

const FontLogin = () => {
  return (
    <>
      <Typography
        variant="h5"
        color="third.main"
        sx={{
          fontSize: { xs: "25px", sm: "30px", md: "35px" },
          fontWeight: 600,
          color: "#162938",
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: { xs: "100px", sm: "120px", md: "140px" },
          marginBottom: "0px",
        }}
      >
        Willkommen bei Smart Fridge!
      </Typography>
    </>
  );
};

export default FontLogin;
