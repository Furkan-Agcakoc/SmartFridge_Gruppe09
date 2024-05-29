import React from "react";
import Box from "@mui/material/Box";



const Footer = () => {
  return (
    <>
      <Box
        height={"50px"}
        width={"100%"}
        sx={{ backgroundColor: "primary.main", position: "fixed", bottom: "0" }}
      ></Box>
    </>
  );
};

export default Footer;
