import React, { Component } from "react";
import React, { Component } from "react";
// import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Tooltip } from "@mui/material";
import { Tab } from "@mui/material";
import { Box } from "@mui/material";
import { Link } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
// import { faItalic } from "@fortawesome/free-solid-svg-icons";
// import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import AutoStoriesRoundedIcon from "@mui/icons-material/AutoStoriesRounded";
import KitchenRoundedIcon from "@mui/icons-material/KitchenRounded";
import LoupeRoundedIcon from "@mui/icons-material/LoupeRounded";

import { Autocomplete, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      popupOpen: false,
      recipesCount: 0,
      recipes: [],
      currentName: "",
      showAlert: false,
      options: [],
    };
  }

  handleCreateRecipes = () => {
    if (this.state.currentName.trim() === "") {
      this.setState({ showAlert: true });
    } else {
      this.setState((prevState) => ({
        recipesCount: prevState.recipesCount + 1,
        popupOpen: false,
        recipes: [...prevState.recipes, prevState.currentName],
        currentName: "",
        showAlert: false,
      }));
    }
  };

  openPopup = () => {
    this.setState({
      popupOpen: true,
    });
  };

  closePopup = () => {
    this.setState({ popupOpen: false });
  };

  handleChange = (event) => {
    this.setState({
      currentName: event.target.value,
      showAlert: false,
    });
  };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  // state = {};
  render() {
    // const { value, groceries, recipes, popupOpen, showAlert } = this.state;
    // <>
    //     <Link onClick={this.openPopup}>
    //       <Tooltip title="Neues Rezept hinzufügen" placement="bottom" arrow>
    //         <Box
    //           sx={{
    //             display: "flex",
    //             justifyContent: "center",
    //             alignItems: "center",
    //             width: "200px",
    //             height: "125px",
    //             borderRadius: "10px",
    //             boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
    //             backgroundColor: "transparent",
    //             color: "primary.main",
    //             border: "3px solid #13a88a",
    //             "&:hover": {
    //               color: "success.dark",
    //               backgroundColor: "rgba(29, 151, 35, 0.2)",
    //               border: "3px solid #06871D",
    //             },
    //           }}
    //         >
    //           <AutoStoriesRoundedIcon
    //             sx={{
    //               width: "75px",
    //               height: "auto",
    //               position: "absolute",
    //             }}
    //           />
    //           <LoupeRoundedIcon
    //             sx={{
    //               width: "30px",
    //               height: "auto",
    //               transform: "scaleX(-1)",
    //               position: "relative",
    //               top: "-38px",
    //               left: "33px",
    //             }}
    //           />
    //         </Box>
    //       </Tooltip>
    //     </Link>
    //     {recipeBoxes}
    //     {popupOpen && (
    //       <>
    //         <Box
    //           sx={{
    //             position: "fixed",
    //             top: 0,
    //             left: 0,
    //             width: "100%",
    //             height: "100%",
    //             backdropFilter: "blur(10px)",
    //             backgroundColor: "rgba(0, 0, 0, 0.5)",
    //             zIndex: 1,
    //             display: "flex", // Added to center the popup
    //             justifyContent: "center", // Added to center the popup
    //             alignItems: "center", // Added to center the popup
    //           }}
    //         />
    //         <Box
    //           sx={{
    //             width: "1100px",
    //             position: "fixed",
    //             top: 35 + "%",
    //             zIndex: 2,
    //           }}
    //         >
    //           <Paper
    //             action="Lebensmittel"
    //             sx={{
    //               display: "flex",
    //               flexDirection: "column",
    //               padding: "0 30px 50px 30px",
    //               borderRadius: "40px",
    //               fontSize: "17px",
    //               // fontFamily: "Arial, Helvetica, sans-serif",
    //             }}
    //           >
    //             <Typography
    //               variant="h4"
    //               sx={{
    //                 marginBottom: "20px",
    //                 marginTop: "20px",
    //                 fontWeight: 600,
    //               }}
    //             >
    //               Neues Lebensmittel hinzufügen
    //             </Typography>
    //             {showAlert && (
    //               <Alert
    //                 severity="error"
    //                 onClose={this.handleCloseAlert}
    //                 sx={{ marginBottom: "20px" }}
    //               >
    //                 Bitte einen Namen des Lebensmittels eingeben!
    //               </Alert>
    //             )}
    //             <Box
    //               sx={{
    //                 display: "flex",
    //                 flexDirection: "column",
    //                 gap: "10px",
    //                 fontSize: "10px",
    //               }}
    //             >
    //               <TextField
    //                 required
    //                 id="outlined-required"
    //                 label="Rezepte"
    //                 placeholder="Neues Rezept"
    //                 InputLabelProps={{ style: { fontSize: "15px" } }}
    //                 value={this.state.name}
    //                 onChange={this.handleChange}
    //               />
    //               <Autocomplete
    //                 options={this.state.options}
    //                 multiple
    //                 renderInput={(params) => (
    //                   <TextField
    //                     {...params}
    //                     label="Zutaten hinzufügen"
    //                     placeholder="Zutaten hinzufügen"
    //                     InputLabelProps={{
    //                       style: { fontSize: "15px" },
    //                     }}
    //                   />
    //                 )}
    //               />
    //             </Box>
    //             <Box
    //               sx={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 position: "relative",
    //                 top: "25px",
    //               }}
    //             >
    //               <Box
    //                 sx={{
    //                   display: "flex",
    //                   justifyContent: "center",
    //                   gap: "10px",
    //                 }}
    //               >
    //                 <Button
    //                   variant="contained"
    //                   endIcon={<CheckCircleOutlineRoundedIcon />}
    //                   onClick={this.handleCreateGroceries}
    //                   sx={{
    //                     color: "success.dark",
    //                     bgcolor: "rgba(29, 151, 35, 0.2)",
    //                     border: "2px solid #06871d",
    //                     "&:hover": {
    //                       bgcolor: "success.dark",
    //                       color: "background.default",
    //                     },
    //                   }}
    //                 >
    //                   Hinzufügen
    //                 </Button>
    //                 <Button
    //                   variant="contained"
    //                   endIcon={<HighlightOffRoundedIcon />}
    //                   onClick={this.closePopup}
    //                   sx={{
    //                     bgcolor: "rgba(197, 0, 0, 0.1)",
    //                     color: "error.main",
    //                     border: "2px solid #c50000 ",
    //                     "&:hover": {
    //                       bgcolor: "error.main",
    //                       color: "background.default",
    //                     },
    //                   }}
    //                 >
    //                   Abbrechen
    //                 </Button>
    //               </Box>
    //             </Box>
    //           </Paper>
    //         </Box>
    //       </>
    //     )}
    //   </>
    // );
  }
}

export default Recipe;
