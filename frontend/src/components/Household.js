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
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@mui/material/ListItemIcon";
import Slide from "@mui/material/Slide";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import PopupSignin from "./PopupSignin";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
      dialogopen: false,
      householdIdToDelete: null, // New state to store householdId
    };

    this.emails = [
      "furkana.gs2002@gmail.com",
      "meayavuz@gmail.com",
      "baran2323a@gmail.com",
      "derzockerlp63@gmail.com",
      "sead.shat@gmail.com",
    ];
  }

  // componentDidUpdate(prevProps, prevState) {
  //   // Überprüfen, ob der Zustand der Haushalte aktualisiert wurde
  //   if (prevState.households !== this.state.households) {
  //     console.log("Updated households list:", this.state.households);
  //   }
  //   // Überprüfen, ob der Zustand von openMenus aktualisiert wurde
  //   if (prevState.openMenus !== this.state.openMenus) {
  //     console.log("Updated openMenus state:", this.state.openMenus);
  //   }
  //   // Überprüfen, ob ein Haushalt bearbeitet wird
  //   if (prevState.currentlyEditing !== this.state.currentlyEditing) {
  //     console.log(
  //       "Currently editing household ID:",
  //       this.state.currentlyEditing
  //     );
  //   }
  //   // Überprüfen, ob der aktuelle Name aktualisiert wurde
  //   if (prevState.currentName !== this.state.currentName) {
  //     console.log("Current name set to:", this.state.currentName);
  //   }
  // }

  openPopup = () => {
    this.setState({
      popupOpen: true,
      currentlyEditing: null,
    });
  };

  closePopup = () => {
    this.setState({ popupOpen: false, currentlyEditing: null });
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

  handleClickOpenDialog = (householdId) => {
    this.setState({
      dialogopen: true,
      householdIdToDelete: householdId,
    });
    this.handleAnchorClose(householdId);
  };

  handleCloseDialog = () => {
    this.setState({ dialogopen: false });
  };

  handleConfirmDelete = () => {
    const { householdIdToDelete } = this.state;
    if (householdIdToDelete !== null) {
      this.handleAnchorDelete(householdIdToDelete);
    }
    this.handleCloseDialog();
  };

  handleCreateHousehold = () => {
    console.log("handleCreateHousehold called");

    const { currentName, currentlyEditing, households } = this.state;

    if (currentName.trim() === "") {
      console.log("No household name provided, showing alert.");
      this.setState({ showAlert: true });
      return;
    }

    if (currentlyEditing !== null) {
      // Haushalt bearbeiten
      console.log("Editing household:", {
        householdId: currentlyEditing,
        householdName: currentName,
      });

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
      // Neuen Haushalt erstellen
      const id = households.length + 1;
      console.log("Creating new household with id:", id);
      console.log("New household name:", currentName);

      this.setState((prevState) => {
        const newHouseholds = [
          ...prevState.households,
          {
            householdId: id,
            householdName: currentName,
            emails: [],
          },
        ];
        const newOpenMenus = { ...prevState.openMenus, [id]: false };
        console.log("Updated households list:", newHouseholds);
        console.log("Updated openMenus state:", newOpenMenus);

        return {
          householdCount: prevState.householdCount + 1,
          popupOpen: false,
          households: newHouseholds,
          currentName: "",
          showAlert: false,
          openMenus: newOpenMenus,
        };
      });
    }
  };

  updateHousehold(household) {
    console.log("Updating household:", household);

    const updatedHouseholds = this.state.households.map((e) => {
      if (household.householdId === e.householdId) {
        console.log("Household found and updated:", e);
        return household;
      }

      return e;
    });

    console.log("Updated households list:", updatedHouseholds);
    return updatedHouseholds;
  }

  handleAnchorClick = (householdId, event) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [householdId]: event.target,
      };

      console.log("Opening menu for household:", householdId);
      console.log("New openMenus state:", newOpenMenus);
      console.log("New anchorEls state:", newAnchorEls);

      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorClose = (householdId) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
      console.log("Closing menu for household:", householdId);
      console.log("New openMenus state:", newOpenMenus);
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorEdit = (household) => {
    console.log("Editing household:", household);

    this.setState((prevState) => {
      const newOpenMenus = {
        ...prevState.openMenus,
        [household.householdId]: false,
      };

      console.log("New openMenus state:", newOpenMenus);
      console.log("Currently editing household ID:", household.householdId);
      console.log("Current name set to:", household.householdName);

      return {
        currentlyEditing: household.householdId,
        currentName: household.householdName,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorDelete = (householdId) => {
    console.log("Deleting household ID:", householdId);

    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
      const newHouseholds = prevState.households.filter(
        (h) => h.householdId !== householdId
      );

      console.log("New openMenus state:", newOpenMenus);
      console.log("Updated households list after deletion:", newHouseholds);

      return {
        households: newHouseholds,
        openMenus: newOpenMenus,
      };
    });
  };

  render() {
    const {
      households,
      popupOpen,
      showAlert,
      currentlyEditing,
      anchorEls,
      openMenus,
      dialogopen,
    } = this.state;

    const showAlertComponent = showAlert && (
      <Alert
        severity="error"
        onClose={this.handleCloseAlert}
        sx={{ marginBottom: "20px" }}
      >
        Bitte geben Sie einen Haushaltsnamen ein!
      </Alert>
    );

    const showDialogPopup = dialogopen && (
      <Dialog
        open={this.state.dialogopen}
        TransitionComponent={Transition}
        keepMounted
        onClose={this.handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseDialog}>Abbrechen</Button>
          <Button onClick={this.handleConfirmDelete}>Löschen</Button>
        </DialogActions>
      </Dialog>
    );

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
            {showAlertComponent}
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
                  Speichern
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
            {showAlertComponent}
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
    const householdBoxes = households.map((household) => (
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
            aria-controls={
              openMenus[household.householdId] ? "long-menu" : undefined
            }
            aria-expanded={
              openMenus[household.householdId] ? "true" : undefined
            }
            aria-haspopup="true"
            onClick={(event) =>
              this.handleAnchorClick(household.householdId, event)
            }
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
              onClick={() => this.handleAnchorEdit(household)}
              className="menu-item"
              disableRipple
            >
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
              Edit
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem
              onClick={() => this.handleClickOpenDialog(household.householdId)}
              className="menu-item"
              disableRipple
            >
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              Delete
            </MenuItem>
          </Menu>
          <Link style={{ textDecoration: "none" }}>
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
        {showDialogPopup}
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
            <PopupSignin />
          </Box>
        </Box>
      </>
    );
  }
}

export default Household;
