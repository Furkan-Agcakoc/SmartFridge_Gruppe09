import React, { Component } from "react";
import Typography from "@mui/material/Typography";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import Tooltip from "@mui/material/Tooltip";
import "./Household.css";
import { Link } from "react-router-dom";
// import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";

class Household extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupOpen: false,
      householdCount: 0,
      households: [],
      currentName: "",
      showAlert: false,
    };

    this.styleForAdd = {
      width: "6vh",
      height: "auto",
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
    });
  };

  closePopup = () => {
    this.setState({ popupOpen: false });
  };

  handleCreateHousehold = () => {
    if (this.state.currentName.trim() === "") {
      this.setState({ showAlert: true });
    } else {
      this.setState((prevState) => ({
        householdCount: prevState.householdCount + 1,
        popupOpen: false,
        households: [...prevState.households, prevState.currentName],
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
    const { households } = this.state;

    const householdBoxes = households.map((currentName, index) => (
      <div key={index}>
        <Link to={`/home/${index}`} style={{ textDecoration: "none" }}>
          <Typography
            className="household-box"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "background.paper",
            }}
          >
            {currentName}
          </Typography>
        </Link>
      </div>
    ));
    return (
      <>
        <div className="container-household">
          <div className="container-household-flexbox">
            <Typography
              className="rules-font-household"
              variant="h5"
              fontFamily="Segoe UI"
              fontSize={"27px"}
              fontWeight={600}
              sx={{}}
            >
              Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
              deine Lebensmittel!
            </Typography>
            <div className="wrapper-household-box">
              <Link onClick={this.openPopup}>
                <div className="add-household-box">
                  <Tooltip
                    title="Neuen Haushalt hinzufügen"
                    placement="bottom"
                    arrow
                  >
                    <AddHomeOutlinedIcon style={this.styleForAdd} />
                  </Tooltip>
                </div>
              </Link>
              {householdBoxes}
            </div>
            {this.state.popupOpen && (
              <>
                <div className="overlay"></div>
                <div className="open-popup">
                  <Paper action="Haushalt" className="paper-container">
                    <h2>Neuen Haushalt hinzufügen</h2>
                    {this.state.showAlert && (
                      <Alert
                        severity="error"
                        onClose={this.handleCloseAlert}
                        sx={{ marginBottom: "20px" }}
                      >
                        Bitte geben Sie einen Haushaltsnamen ein !
                      </Alert>
                    )}
                    <div className="text-container">
                      <TextField
                        required
                        id="outlined-required"
                        label="Haushaltsname"
                        placeholder="Haushaltsname"
                        InputLabelProps={{ style: { fontSize: "15px" } }}
                        value={this.state.name}
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
                    </div>
                    <div className="popup-buttons-cnt">
                      <div className="confirm-btn">
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
                      </div>
                    </div>
                  </Paper>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Household;
