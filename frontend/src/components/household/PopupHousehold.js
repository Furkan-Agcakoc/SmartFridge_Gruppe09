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

class PopupHousehold extends Component {
  constructor(props) {
    super(props);
    this.state = {
      householdData: {
        householdName: "",
        emails: [],
      },
      showAlert: props.showAlert,
    };
    // this.formRef = React.createRef();
  }

  handleClick = (e) => {
    // const form = this.formRef.current;
    const { householdData: {householdName} } = this.state;
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      this.props.handleCreateObject(householdName);
      console.log("Form is valid");
    } else {
      this.setState({ showAlert: true });
    }
  };
  render() {
    const {
      // handleChange,
      closePopup,
      handleInvalid,
      handleInput,
      showAlertComponent,
    } = this.props;

    const {
      householdData: { householdName, emails },
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
          onInvalid={handleInvalid}
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
                value={householdName}
                onChange={(e) =>
                  this.setState({
                    householdData: {
                      ...this.state.householdData,
                      householdName: e.target.value,
                    },
                  })
                }
                onInput={handleInput}
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
                    value={emails}
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
                  Hinzufügen
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

export default PopupHousehold;
