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

class HouseholdDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      householdData: {
        householdName: props.isEditMode ? props.householdName : "",
        // emails: props.isEditMode ? props.householdEmails : [],
        emails: [
          "furkana.gs2002@gmail.com",
          "meayavuz@gmail.com",
          "baran2323a@gmail.com",
          "derzockerlp63@gmail.com",
          "sead.shat@gmail.com",
        ],
      },
      showAlert: false,
      // households: props.households,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isEditMode !== this.props.isEditMode ||
      prevProps.householdName !== this.props.householdName
    ) {
      this.setState({
        householdData: {
          householdName: this.props.householdName,
          emails: this.props.householdEmails || [],
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
  };

  render() {
    const { closePopup, isEditMode } = this.props;

    const {
      householdData: { householdName, emails },
      showAlert,
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
                options={emails}
                multiple
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="emails"
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
