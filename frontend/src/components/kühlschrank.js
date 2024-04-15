import React from "react";
import "./kühlschrank.css";
import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";

const Kühlschrank = () => {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <Item>xs=8</Item>
        </Grid>
      </Grid> 
    </>
  );
};
export default Kühlschrank;

// Kommentar