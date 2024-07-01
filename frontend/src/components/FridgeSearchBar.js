import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import SmartFridgeAPI from "../api/SmartFridgeAPI";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.08),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.20),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function FridgeSearchBar() {
  const { householdId } = useParams(); // HouseholdId aus den Params ziehen
  const [householdName, setHouseholdName] = useState("");

  useEffect(() => {
    const getHouseholdNameById = (householdId) => {
      SmartFridgeAPI.getAPI()
        .getHouseholdById(householdId)
        .then((response) => {
          const household = response[0];
          setHouseholdName(household.household_name);
        })
        .catch((error) => {
          console.error("Error fetching household name:", error);
        });
    };

    if (householdId) {
      getHouseholdNameById(householdId);
    }
  }, [householdId]);

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
              <ArrowBackIosNewRoundedIcon fontSize="small" sx={{ color: "background.paper" }} />
            </IconButton>
          </Link>
          <Typography
            variant="h5"
            noWrap
            component="div"
            fontStyle={"italic"}
            fontWeight={"bold"}
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" }, pl: "10px", }}
          >
            {householdName}
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Suchen..."
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
