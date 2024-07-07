import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

//householdName sowie ownerName (nur der firstname) werden als props übergeben

export default function FridgeSearchBar(props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "primary.main",
          borderTopRightRadius: "20px",
          borderTopLeftRadius: "20px",
        }}
      >
        <Toolbar>
          <Link to="/household">
            <IconButton>
              <ArrowBackIosNewRoundedIcon
                fontSize="small"
                sx={{ color: "background.paper" }}
              />
            </IconButton>
          </Link>
          <Typography
            variant="h5"
            noWrap
            component="div"
            fontStyle={"italic"}
            fontWeight={"bold"}
            sx={{
              flexGrow: 1,
              display: { xs: "block", sm: "block" },
              pl: "10px",
              fontSize: { xs: "1.3rem", sm: "1.7rem" },
            }}
          >
            {props.householdName} von {props.ownerName}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
