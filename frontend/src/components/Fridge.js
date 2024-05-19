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

class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1",
      popupOpen: false,
      groceriesCount: 0,
      groceries: [],
      recipesCount: 0,
      recipes: [],
      currentName: "",
      showAlert: false,
      options: [],
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  openPopup = () => {
    this.setState({
      popupOpen: true,
    });
  };

  closePopup = () => {
    this.setState({ popupOpen: false });
  };

  handleCreateGroceries = () => {
    if (this.state.currentName.trim() === "") {
      this.setState({ showAlert: true });
    } else {
      this.setState((prevState) => ({
        groceriesCount: prevState.groceriesCount + 1,
        popupOpen: false,
        groceries: [...prevState.groceries, prevState.currentName],
        currentName: "",
        showAlert: false,
      }));
    }
  };

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

  handleChange = (event) => {
    this.setState({
      currentName: event.target.value,
      showAlert: false,
    });
  };

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  render() {
    const { value, groceries, recipes, popupOpen, showAlert } = this.state;

    const groceryBoxes = groceries.map((currentName, index) => (
      <Box key={index}>
        <Link to={`/home/${index}`} style={{ textDecoration: "none" }}>
          <Box
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
              boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
              border: "5px solid red",
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
              <FontAwesomeIcon icon={faEllipsisV} />
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
          </Box>
        </Link>
      </Box>
    ));
    const recipeBoxes = recipes.map((currentName, index) => (
      <Box key={index}>
        <Link to={`/home/${index}`} style={{ textDecoration: "none" }}>
          <Box
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
              boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
              border: "5px solid red",
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
              <FontAwesomeIcon icon={faEllipsisV} />
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
          </Box>
        </Link>
      </Box>
    ));

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: "200px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              border: "none",
              /* borderRadius: "30px", */
              /* boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)", */
              width: "1100px",
              height: "auto",
              padding: "0px 50px 30px 50px",
              /* border: "5px red solid", */
            }}
          >
            <Typography
              variant="h5"
              fontSize={"27px"}
              fontWeight={700}
              padding={2}
              fontStyle={
                "italic"
              } /*löschen, wenn EINGETRAGENER HAUSHALTSNAME angezeigt wird */
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "1100px",
                /* border: "3px solid brown", */
              }}
            >
              gespeicherter Haushaltsname!
            </Typography>

            <Paper sx={{ width: "1100px" }}>
              <TabContext value={value} sx={{ width: "1100px" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={this.handleTabChange}
                    aria-label="simple tabs example"
                    centered
                  >
                    <Tab label="Lebensmittel" value="1" />
                    <Tab label="Rezepte" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
                  <Link onClick={this.openPopup}>
                    <Tooltip
                      title="Neues Lebensmittel hinzufügen"
                      placement="bottom"
                      arrow
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "200px",
                          height: "125px",
                          borderRadius: "10px",
                          boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                          backgroundColor: "transparent",
                          color: "primary.main",
                          border: "3px solid #13a88a",
                          "&:hover": {
                            color: "success.dark",
                            backgroundColor: "rgba(29, 151, 35, 0.2)",
                            border: "3px solid #06871D",
                          },
                        }}
                      >
                        <KitchenRoundedIcon
                          sx={{
                            width: "75px",
                            height: "auto",
                            position: "absolute",
                          }}
                        />
                        <LoupeRoundedIcon
                          sx={{
                            width: "30px",
                            height: "auto",
                            transform: "scaleX(-1)",
                            position: "relative",
                            top: "-38px",
                            left: "33px",
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Link>
                  {groceryBoxes}
                </TabPanel>
                {popupOpen && (
                  <>
                    <Box
                      sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1,
                        display: "flex", // Added to center the popup
                        justifyContent: "center", // Added to center the popup
                        alignItems: "center", // Added to center the popup
                      }}
                    />
                    <Box
                      sx={{
                        width: "1100px",
                        position: "fixed",
                        top: 35 + "%",
                        zIndex: 2,
                      }}
                    >
                      <Paper
                        action="Lebensmittel"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "0 30px 50px 30px",
                          borderRadius: "40px",
                          fontSize: "17px",
                          // fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            marginBottom: "20px",
                            marginTop: "20px",
                            fontWeight: 600,
                          }}
                        >
                          Neues Lebensmittel hinzufügen
                        </Typography>
                        {showAlert && (
                          <Alert
                            severity="error"
                            onClose={this.handleCloseAlert}
                            sx={{ marginBottom: "20px" }}
                          >
                            Bitte einen Namen des Lebensmittels eingeben!
                          </Alert>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            fontSize: "10px",
                          }}
                        >
                          <TextField
                            required
                            id="outlined-required"
                            label="Lebensmittel"
                            placeholder="Neues Lebensmittel"
                            InputLabelProps={{ style: { fontSize: "15px" } }}
                            value={this.state.name}
                            onChange={this.handleChange}
                          />
                          <Autocomplete
                            options={this.state.options}
                            multiple
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Mengenangabe hinzufügen"
                                placeholder="Mengenangabe hinzufügen"
                                InputLabelProps={{
                                  style: { fontSize: "15px" },
                                }}
                              />
                            )}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "relative",
                            top: "25px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              endIcon={<CheckCircleOutlineRoundedIcon />}
                              onClick={this.handleCreateGroceries}
                              sx={{
                                color: "success.dark",
                                bgcolor: "rgba(29, 151, 35, 0.2)",
                                border: "2px solid #06871d",
                                "&:hover": {
                                  bgcolor: "success.dark",
                                  color: "background.default",
                                },
                              }}
                            >
                              Hinzufügen
                            </Button>
                            <Button
                              variant="contained"
                              endIcon={<HighlightOffRoundedIcon />}
                              onClick={this.closePopup}
                              sx={{
                                bgcolor: "rgba(197, 0, 0, 0.1)",
                                color: "error.main",
                                border: "2px solid #c50000 ",
                                "&:hover": {
                                  bgcolor: "error.main",
                                  color: "background.default",
                                },
                              }}
                            >
                              Abbrechen
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  </>
                )}
                <TabPanel value="2">
                  <Link onClick={this.openPopup}>
                    <Tooltip
                      title="Neues Rezept hinzufügen"
                      placement="bottom"
                      arrow
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "200px",
                          height: "125px",
                          borderRadius: "10px",
                          boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                          backgroundColor: "transparent",
                          color: "primary.main",
                          border: "3px solid #13a88a",
                          "&:hover": {
                            color: "success.dark",
                            backgroundColor: "rgba(29, 151, 35, 0.2)",
                            border: "3px solid #06871D",
                          },
                        }}
                      >
                        <AutoStoriesRoundedIcon
                          sx={{
                            width: "75px",
                            height: "auto",
                            position: "absolute",
                          }}
                        />
                        <LoupeRoundedIcon
                          sx={{
                            width: "30px",
                            height: "auto",
                            transform: "scaleX(-1)",
                            position: "relative",
                            top: "-38px",
                            left: "33px",
                          }}
                        />
                      </Box>
                    </Tooltip>
                  </Link>
                  {recipeBoxes}
                </TabPanel>
                {popupOpen && (
                  <>
                    <Box
                      sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1,
                        display: "flex", // Added to center the popup
                        justifyContent: "center", // Added to center the popup
                        alignItems: "center", // Added to center the popup
                      }}
                    />
                    <Box
                      sx={{
                        width: "1100px",
                        position: "fixed",
                        top: 35 + "%",
                        zIndex: 2,
                      }}
                    >
                      <Paper
                        action="Lebensmittel"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "0 30px 50px 30px",
                          borderRadius: "40px",
                          fontSize: "17px",
                          // fontFamily: "Arial, Helvetica, sans-serif",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            marginBottom: "20px",
                            marginTop: "20px",
                            fontWeight: 600,
                          }}
                        >
                          Neues Lebensmittel hinzufügen
                        </Typography>
                        {showAlert && (
                          <Alert
                            severity="error"
                            onClose={this.handleCloseAlert}
                            sx={{ marginBottom: "20px" }}
                          >
                            Bitte einen Namen des Lebensmittels eingeben!
                          </Alert>
                        )}
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            fontSize: "10px",
                          }}
                        >
                          <TextField
                            required
                            id="outlined-required"
                            label="Rezepte"
                            placeholder="Neues Rezept"
                            InputLabelProps={{ style: { fontSize: "15px" } }}
                            value={this.state.name}
                            onChange={this.handleChange}
                          />
                          <Autocomplete
                            options={this.state.options}
                            multiple
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Zutaten hinzufügen"
                                placeholder="Zutaten hinzufügen"
                                InputLabelProps={{
                                  style: { fontSize: "15px" },
                                }}
                              />
                            )}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            position: "relative",
                            top: "25px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              endIcon={<CheckCircleOutlineRoundedIcon />}
                              onClick={this.handleCreateGroceries}
                              sx={{
                                color: "success.dark",
                                bgcolor: "rgba(29, 151, 35, 0.2)",
                                border: "2px solid #06871d",
                                "&:hover": {
                                  bgcolor: "success.dark",
                                  color: "background.default",
                                },
                              }}
                            >
                              Hinzufügen
                            </Button>
                            <Button
                              variant="contained"
                              endIcon={<HighlightOffRoundedIcon />}
                              onClick={this.closePopup}
                              sx={{
                                bgcolor: "rgba(197, 0, 0, 0.1)",
                                color: "error.main",
                                border: "2px solid #c50000 ",
                                "&:hover": {
                                  bgcolor: "error.main",
                                  color: "background.default",
                                },
                              }}
                            >
                              Abbrechen
                            </Button>
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  </>
                )}
              </TabContext>
            </Paper>
          </Box>
        </Box>
      </>
    );
  }
}

export default Fridge;
