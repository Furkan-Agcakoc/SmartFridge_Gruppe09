import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import UserBO from "../../api/SmartFridgeAPI";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";

// Funktionskomponente, um `useNavigate` zu verwenden und als Prop weiterzugeben
const withNavigation = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
};

class EditProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      nickName: "",
      showAlertSignin: false,
    };
  }

  componentDidMount() {
    this.getUserById(1);
    console.log(this.state.firstName);
  }

  componentDidUpdate() {
    console.log(this.state.firstName);
  }

  handleSaveClick = async (e) => {
    const form = e.target.closest("form");
    if (form.checkValidity()) {
      console.log("Form is valid, proceeding to update user");
      await this.updateUser(1);
      this.props.navigate("/household");
    } else {
      console.log("Form is invalid");
      this.setState({ showAlertSignin: true });
    }
  };

  getUserById = async (userId) => {
    const users = await SmartFridgeAPI.getAPI().getUserById(userId);
    const user = users[0];

    this.setState({
      firstName: user.firstname,
      lastName: user.lastname,
      nickName: user.nickname,
    });
  };

  updateUser = async (userId) => {
    const { firstName, lastName, nickName } = this.state;
    const userToUpdate = new UserBO(firstName, lastName, nickName);
    userToUpdate.setID(userId); // Use setID to set the ID

    await SmartFridgeAPI.getAPI()
      .updateUser(userToUpdate)
      .then((updatedUser) => {
        console.log("User updated:", updatedUser);
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  handleCloseAlert = () => {
    this.setState({ showAlertSignin: false });
  };

  render() {
    const { firstName, lastName, nickName, showAlertSignin } = this.state;

    const showAlertSigninComp = showAlertSignin && (
      <Alert severity="error" sx={{ marginBottom: "20px" }}>
        Bitte füllen Sie alle Felder aus!
      </Alert>
    );
    return (
      <>
        <Paper
          component="form"
          sx={{
            maxWidth: "xs",
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
                    onChange={(e) =>
                      this.setState({
                        firstName: e.target.value,
                      })
                    }
                    onInput={() => this.setState({ showAlertSignin: false })}
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
                    onChange={(e) =>
                      this.setState({
                        lastName: e.target.value,
                      })
                    }
                    onInput={() => this.setState({ showAlertSignin: false })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="nickName"
                    label="Nickname"
                    name="nickName"
                    autoComplete="nickName"
                    placeholder="Ihr Nickname..."
                    value={nickName}
                    onChange={(e) =>
                      this.setState({
                        nickName: e.target.value,
                      })
                    }
                    onInput={() => this.setState({ showAlertSignin: false })}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Button
                    onClick={this.handleSaveClick}
                    variant="contained"
                    endIcon={<CheckCircleOutlineRoundedIcon />}
                    sx={{
                      marginBottom: "15px",
                      color: "success.dark",
                      bgcolor: "rgba(29, 151, 35, 0.2)",
                      border: "2px solid #06871d",
                      width: "100%",
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
      </>
    );
  }
}

export default withNavigation(EditProfilePage);
