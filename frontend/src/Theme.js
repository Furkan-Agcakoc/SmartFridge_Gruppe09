import { createTheme } from "@mui/material";


const theme = createTheme({
  palette: {
    primary: {
      main: "#13a88a",
      light: "#aff3d5",
    },
    secondary: {
      main: "#29524a",
    },
    background: {
      default: "#f2f2f2",
      paper: "#fbfbfb",
    },
    error: {
      main: "#c50000",
    },
    success: {
      main: "rgba(0,205,34,0.8)",
    },
  },
  typography: {
    fontSize: 16,
    button: {
      fontWeight: 600,
      fontSize: "10pt",
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 30,
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
