import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import Typography from "@mui/material/Typography";
// import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";

class PopupSignin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      nickname: "",
      showSigninPopup: props.showSigninPopup,
      showAlertSignin: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showAlertSignin: false,
    });
  };

  handleCloseAlert = () => {
    this.setState({ showAlertSignin: false });
  };

  handleSetBackground = () => {
    const { handleCloseSigninPopup } = this.props;
    if (this.state.showSigninPopup) {
      document.body.style.backgroundColor = "white";
    } else {
      handleCloseSigninPopup();
    }
  };

  componentDidMount() {
    this.handleSetBackground();
  }

  componentDidUpdate() {
    this.handleSetBackground();
  }

  // handleClosePopup = () => {
  //   this.setState({ opensigninpopup: false });
  // };

  handleSubmitNames = () => {
    const { firstName, lastName, nickname } = this.state;

    if (
      firstName.trim() === "" ||
      lastName.trim() === "" ||
      nickname.trim() === ""
    ) {
      this.setState({ showAlertSignin: true });
    } else {
      this.setState({ showSigninPopup: false });
      // Weitere Logik zur Verarbeitung des Formulars hinzufügen
    }
  };

  render() {
    const { firstName, lastName, nickname, showSigninPopup, showAlertSignin } =
      this.state;

    const showAlertSigninComp = showAlertSignin && (
      <Alert severity="error" sx={{ marginBottom: "20px" }}>
        Bitte füllen Sie alle Felder aus !
      </Alert>
    );
    return (
      <>
        {showSigninPopup && (
          <Paper
            component="main"
            maxWidth="xs"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1001,
              backgroundColor: "white",
              padding: "20px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
              width: "600px",
              height: "auto",
            }}
          >
            <Box
              sx={{
                margin: "5px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ margin: "5px", fontWeight: "bold" }}
                >
                  Profildaten
                </Typography>
                <Avatar sx={{ margin: "5px", bgcolor: "background.white" }}>
                  <CreateRoundedIcon
                    sx={{
                      color: "secondary.dark",
                      width: "30px",
                      height: "auto",
                    }}
                  />
                </Avatar>
              </Box>
              {showAlertSigninComp}
              <Box sx={{ mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Vorname"
                      placeholder="Ihr Vorname..."
                      autoFocus
                      value={firstName}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Nachname"
                      name="lastName"
                      autoComplete="family-name"
                      placeholder="Ihr Nachname..."
                      value={lastName}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="nickname"
                      label="Nickname"
                      name="nickname"
                      autoComplete="nickname"
                      placeholder="Ihr Nickname..."
                      value={nickname}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", flexDirection: "column" }}
                  >
                    <Button
                      // type="submit"
                      variant="contained"
                      endIcon={<CheckCircleOutlineRoundedIcon />}
                      onClick={this.handleSubmitNames}
                      sx={{
                        marginBottom: "15px",
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
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    xs
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h7"
                      sx={{ fontSize: "9pt", color: "grey" }}
                    >
                      Zur weiteren Nutzung bitte Formular ausfüllen.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Paper>
        )}
      </>
    );
  }
}

export default PopupSignin;
