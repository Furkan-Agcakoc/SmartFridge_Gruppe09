import React from "react";
import { Box, Link, Typography, IconButton, Paper } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const Grocery = ({ currentName, index }) => (
  <Box key={index}>
    <Link to={`/home/${index}`} style={{ textDecoration: "none" }}>
      <Paper
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "primary.light",
          color: "background.default",
          width: "200px",
          maxWidth: "200px",
          height: "125px",
          borderRadius: "10px",
          "&:hover": {
            boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
          },
        }}
      >
        <IconButton
          aria-label="Example"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "20px",
            height: "20px",
          }}
        >
          <MoreVertIcon sx={{ color: "background.default" }} />
        </IconButton>

        <Typography
          variant="h5"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "background.default",
            width: "200px",
            maxWidth: "200px",
            height: "125px",
          }}
        >
          {currentName}
        </Typography>
      </Paper>
    </Link>
  </Box>
);

export default Grocery;
