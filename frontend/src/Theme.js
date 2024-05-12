import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#13a88a", //green
      light: "#8dc4af", //light green
      dark: "#0d7b63", //dark green
    },
    secondary: {
      main: "#29524a", //dark green
      light: "#53746E", //light green
      dark: "#0D7560", //dark green
    },
    third: {
      main: "#162938", //black
      dark: "#000000", //black
    },

    background: {
      default: "#f2f2f2", //light grey
      paper: "#fbfbfb", //light grey
      card: "#fbfbfb", //light grey

    },
    error: {
      main: "#c50000",
    },
    success: {
      main: "rgba(0,205,34,0.8)",
      light: "rgba(51, 215, 78, 0.8)",
      dark: "#06871D",
    },
    text: {
      primary: "rgba(20,19,19,0.87)",
    },
  },
  typography: {
    fontFamily: ["Merriweather", "Verdana", "serif"],
  

    button: {
      fontWeight: 600,
      fontSize: "10pt",
      lineHeight: 1.6,
    },
  },

  shape: {
    borderRadius: 20,
  },
  // palette: {
  //   primary: {
  //     main: "#13a88a",
  //     dark: "#0d7b63",
  //     light: "#6abdaa",
  //     contrastText: white,
  //     hell: blue,
  //   },

  //   secondary: {
  //     main: "#FF0000",
  //     dark: "#0f1f2e",
  //     light: "#1d3b5b",
  //     contrastText: white,
  //   },
  //   background: {
  //     default: "#f2f2f2",
  //     paper: "#fbfbfb",
  //   },
  //   custom: {
  //     navbar: green,
  //     navbarButtonLogin: "rgba(255, 255, 255, 0.4)",
  //     navbarButtonLoginHover: "rgba(255, 255, 255, 0.8)",
  //     loginPageHeader: "#162938",
  //     loginPageLoginBoxBorder: "rgba(255, 255, 255, 0.5)",
  //     loginPageLoginBoxShadow: "rgba(0, 0, 0, 0.5)",
  //     loginPageHeaderInLoginBox: "#162938",
  //     householdPageHouseholdGrid: "#8dc4af",
  //     householdPageHouseholdGridHover: green,
  //     popup: "#f2f2f2",
  //   },
  // },
});

export default theme;
