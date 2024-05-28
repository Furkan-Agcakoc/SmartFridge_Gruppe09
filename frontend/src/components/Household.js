import React, { Component } from "react";
import Typography from "@mui/material/Typography";
import AddHomeWorkRoundedIcon from "@mui/icons-material/AddHomeWorkRounded";
// import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
// import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";
import { Box } from "@mui/material";
import { IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListItemIcon from "@mui/material/ListItemIcon";

class Household extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      householdCount: 0,
      households: [],
      currentName: "",
      showAlert: false,
      anchorEls: {},
      openMenus: {},
      currentlyEditing: null,
    };

    this.emails = [
      "furkana.gs2002@gmail.com",
      "meayavuz@gmail.com",
      "baran2323a@gmail.com",
      "derzockerlp63@gmail.com",
      "sead.shat@gmail.com",
    ];
  }

  openPopup = () => {
    this.setState({
      popupOpen: true,
      currentlyEditing: null,
    });
  };

  closePopup = () => {
    this.setState({ popupOpen: false, currentlyEditing: null });
  };

  handleCreateHousehold = () => {
    const { currentName, currentlyEditing, households } = this.state;

    if (currentName.trim() === "") {
      this.setState({ showAlert: true });
      return;
    }

    if (currentlyEditing !== null) {
      // Haushalt bearbeiten

      this.setState({
        households: this.updateHousehold({
          householdId: currentlyEditing,
          householdName: currentName,
          emails: [],
        }),
        popupOpen: false,
        currentName: "",
        showAlert: false,
        currentlyEditing: null,
      });
    } else {
      const id = households.length;

      // Neuen Haushalt erstellen
      this.setState((prevState) => ({
        householdCount: prevState.householdCount + 1,
        popupOpen: false,
        // householdId: households.length,
        households: [
          ...prevState.households,
          {
            householdId: id,
            householdName: currentName,
            emails: [],
          },
        ],
        currentName: "",
        showAlert: false,
        openMenus: { ...prevState.openMenus, [id]: false }
      }));
    }
  };

  handleChange = (event) => {
    this.setState((prevState) => ({
      currentName: event.target.value,
      showAlert: false,
    }));
  };

  // const households = [
  //   {
  //     id: 0,
  //     name: "Haushalt 1",
  //     emails: ["abc@gmail.com", "abadfdsa@gmail.com"]
  //   }
  // ];

  updateHousehold(household) {
    return this.state.households.map((e) => {
      if (household.householdId === e.householdId) {
        return household;
      }

      return e;
    });
  }

  handleCloseAlert = () => {
    this.setState({ showAlert: false });
  };

  handleAnchorClick = (householdId, event) => {
    this.setState((prevState) => ({
      anchorEls: { ...prevState.anchorEls, [householdId]: event.target },
      openMenus: { ...prevState.openMenus, [householdId]: true }
    }));
  };

  handleAnchorClose = (householdId) => {
    this.setState((prevState) => ({
      openMenus: { ...prevState.openMenus, [householdId]: false },
    }));
  };

  handleAnchorEdit = (household) => {
    // this.setState({ anchorEl: null });
    // this.setState({
    //   popupOpen: true,
    //   currentName: this.props.currentName,
    // });
    this.setState((prevState) => ({
      currentlyEditing: household.householdId,
      currentName: household.householdName,
      openMenus: { ...prevState.openMenus, [household.householdId]: false }
    }));
  };

  handleAnchorDelete = (household) => {
    this.setState({
      currentlyDeleting: household
    });
    this.handleHouseholdDelete(household);
  };

  handleHouseholdDelete = (household) => {
    this.setState((prevState) => ({
      households: prevState.households.filter(
        (h) => h !== household.householdId
      ),
      currentlyDeleting: null,
    }));
  };
  

  render() {
    const {
      households,
      popupOpen,
      showAlert,
      currentlyEditing,
      anchorEls,
      openMenus,
    } = this.state;

    const editpopup = currentlyEditing !== null && (
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
          }}
        />
        <Box
          sx={{
            width: "1100px",
            position: "fixed",
            zIndex: 2,
          }}
        >
          <Paper
            action="Haushalt"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0 30px 50px 30px",
              borderRadius: "50px",
              fontSize: "18px",
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
              Haushalt bearbeiten
            </Typography>
            {showAlert && (
              <Alert
                severity="error"
                onClose={this.handleCloseAlert}
                sx={{ marginBottom: "20px" }}
              >
                Bitte geben Sie einen Haushaltsnamen ein !
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
                label="Haushaltsname"
                value={this.state.currentName}
                placeholder="Haushaltsname"
                InputLabelProps={{ style: { fontSize: "15px" } }}
                onChange={this.handleChange}
              />
              <Autocomplete
                options={this.emails}
                multiple
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bewohner hinzufügen"
                    placeholder="Bewohner hinzufügen"
                    InputLabelProps={{ style: { fontSize: "15px" } }}
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
                  onClick={this.handleCreateHousehold}
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
    );

    const createpopup = popupOpen && (
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
          }}
        />
        <Box
          sx={{
            width: "1100px",
            position: "fixed",
            zIndex: 2,
          }}
        >
          <Paper
            action="Haushalt"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0 30px 50px 30px",
              borderRadius: "50px",
              fontSize: "18px",
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
              Neuen Haushalt hinzufügen
            </Typography>
            {showAlert && (
              <Alert
                severity="error"
                onClose={this.handleCloseAlert}
                sx={{ marginBottom: "20px" }}
              >
                Bitte geben Sie einen Haushaltsnamen ein !
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
                label="Haushaltsname"
                placeholder="Haushaltsname"
                InputLabelProps={{ style: { fontSize: "15px" } }}
                // value={this.state.name}
                onChange={this.handleChange}
              />
              <Autocomplete
                options={this.emails}
                multiple
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bewohner hinzufügen"
                    placeholder="Bewohner hinzufügen"
                    InputLabelProps={{ style: { fontSize: "15px" } }}
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
                  onClick={this.handleCreateHousehold}
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
    );
    const householdBoxes = households.map((household, index) => (
      <Box key={household.householdId}>
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
            "&:hover": {
              border: "0.1px solid #13a88a",
            },
          }}
        >
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenus[household.householdId] ? "long-menu" : undefined}
            aria-expanded={openMenus[household.householdId] ? "true" : undefined}
            aria-haspopup="true"
            onClick={(event) => this.handleAnchorClick(household.householdId, event)}
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

          <Menu
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEls[household.householdId]}
            open={openMenus[household.householdId]}
            onClose={() => this.handleAnchorClose(household.householdId)}
          >
            <MenuItem
              onClick={() => this.handleAnchorEdit(household, index)}
              className="menu-item"
              disableRipple
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => this.handleAnchorClose(household.householdId)}
              className="menu-item"
              disableRipple
            >
              <ListItemIcon>
                <FileCopyIcon />
              </ListItemIcon>
              Duplicate
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={this.handleAnchorDelete}
              className="menu-item"
              disableRipple
            >
              <ListItemIcon>
                <ArchiveIcon />
              </ListItemIcon>
              Delete
            </MenuItem>
            <MenuItem
              onClick={() => this.handleAnchorClose(household.householdId)}
              className="menu-item"
              disableRipple
            >
              <ListItemIcon>
                <MoreHorizIcon />
              </ListItemIcon>
              More
            </MenuItem>
          </Menu>
          <Link style={{ textDecoration: "none" }}>
            {" "}
            {/* to={`/home/${index}`}  */}
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
              {household.householdName}
            </Typography>
          </Link>
        </Box>
      </Box>
    ));
    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: "150px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "10px",
              alignItems: "center",
              width: "1100px",
              height: "300px",
            }}
          >
            <Typography
              variant="h5"
              fontSize={"24.2px"}
              fontWeight={600}
              sx={{
                color: "third.main",
                width: "1000px",
              }}
            >
              Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
              deine Lebensmittel!
            </Typography>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-start",
                gap: "50px",
                maxWidth: "1000px",
                flexWrap: "wrap",
                paddingBottom: "200px",
              }}
            >
              <Link onClick={this.openPopup}>
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
                  <Tooltip
                    title="Neuen Haushalt hinzufügen"
                    placement="bottom"
                    arrow
                  >
                    <AddHomeWorkRoundedIcon
                      sx={{ width: "75px", height: "auto" }}
                    />
                  </Tooltip>
                </Box>
              </Link>
              {householdBoxes}
            </Box>
            {createpopup}
            {editpopup}
          </Box>
        </Box>
      </>
    );
  }
}

export default Household;
