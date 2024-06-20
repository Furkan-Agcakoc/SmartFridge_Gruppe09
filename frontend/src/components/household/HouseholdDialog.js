import React, { Component } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Autocomplete,
  Button,
} from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import AlertComponent from "../dialogs/AlertComponent";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";

class HouseholdDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      householdData: {
        householdName: props.isEditMode ? props.householdName : "",
        inhabitants: props.isEditMode ? props.householdInhabitants : [],
      },
      allInhabitants: [],
      showAlert: false,
    };
  }

  componentDidMount() {
    this.fetchInhabitants();
  }

  fetchInhabitants = () => {
    SmartFridgeAPI.api
      .getUser()
      .then((userBOs) => {
        const inhabitants = userBOs.map((user) => ({
          email: user.email,
          id: user.id,
        }));
        this.setState({ allInhabitants: inhabitants });
      })
      .catch((error) => {
        console.error("Fehler beim Abrufen der Einwohnerdaten:", error);
      });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.householdName !== this.props.householdName
    ) {
      this.setState({
        householdData: {
          householdName: this.props.householdName,
          inhabitants: this.props.householdInhabitants,
        },
      });
    }
  }

  handleClick = (e) => {
    const { householdData } = this.state;
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      this.props.handleCreateObject(householdData);
      console.log("Form is valid");
    } else {
      this.setState({ showAlert: true });
    }
    console.log(householdData.inhabitants);
  };

  render() {
    const { closePopup, isEditMode } = this.props;

    const {
      householdData: { householdName},
      showAlert,
      allInhabitants,
    } = this.state;

    return (
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
          sx={{ width: "1100px", position: "fixed", zIndex: 2 }}
          component="form"
          noValidate
        >
          <Paper
            action="Haushalt"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0 30px 50px 30px",
              borderRadius: "50px",
              fontSize: "18px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ marginBottom: "20px", marginTop: "20px", fontWeight: 600 }}
            >
              {isEditMode ? "Haushalt bearbeiten" : "Neuen Haushalt hinzufügen"}
            </Typography>
            <AlertComponent showAlert={showAlert} alertType="household" />
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
                value={householdName}
                onChange={(e) =>
                  this.setState({
                    householdData: {
                      ...this.state.householdData,
                      householdName: e.target.value,
                    },
                  })
                }
                onInput={() => this.setState({ showAlert: false })}
                id="outlined-required"
                name="householdName"
                label="Haushaltsname"
                placeholder="Haushaltsname"
                InputLabelProps={{ style: { fontSize: "15px" } }}
              />
              <Autocomplete
                options={allInhabitants}
                getOptionLabel={(option) => option.email}
                multiple
                onChange={(event, value) => {
                  this.setState((prevState) => ({
                    householdData: {
                      ...prevState.householdData,
                      inhabitants: value,
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="inhabitant"
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
                sx={{ display: "flex", justifyContent: "center", gap: "10px" }}
              >
                <Button
                  variant="contained"
                  endIcon={<CheckCircleOutlineRoundedIcon />}
                  onClick={this.handleClick}
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
                  {isEditMode ? "Speichern" : "Hinzufügen"}
                </Button>
                <Button
                  variant="contained"
                  endIcon={<HighlightOffRoundedIcon />}
                  onClick={closePopup}
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
  }
}

export default HouseholdDialog;
