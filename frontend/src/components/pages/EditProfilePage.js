import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import UserBO from "../../api/UserBO";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import UserContext from "../contexts/UserContext";

// Funktionskomponente, um `useNavigate` zu verwenden und als Prop weiterzugeben
const withNavigation = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
};

class EditProfilePage extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      nickName: "",
      showAlertSignin: false,
    };
  }

  handleBackClick = () => {
    this.props.navigate(-1);
  };

  componentDidMount() {
    const userId = this.context.id;
    this.getUserById(userId);
  }

  handleSaveClick = async (e) => {
    const userId = this.context.id;
    const form = e.target.closest("form");

    if (form.checkValidity()) {
      console.log("Form is valid, proceeding to update user");
      await this.updateUser(userId);
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

    try {
      const [user] = await SmartFridgeAPI.getAPI().getUserById(userId);
      const updatedUser = new UserBO(
        firstName,
        lastName,
        nickName,
        user.email,
        user.google_user_id
      );
      updatedUser.setID(userId);

      await SmartFridgeAPI.getAPI().updateUser(updatedUser);
    } catch (error) {
      this.setState({ showAlertSignin: true });
    }
  };

  handleClickDelete = () => {
    const userId = this.context.id;
    console.log(userId)
    this.deleteUser(userId);
    this.props.handleSignOut();
  }

  deleteUser = async (userId) => {
    try {
      await SmartFridgeAPI.getAPI().deleteUser(userId);
    } catch (error) {
      this.setState({ showAlertDelete: true });
    }
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
              <IconButton
                onClick={this.handleBackClick}
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                <ArrowBackIosNewRoundedIcon
                  sx={{
                    color: "primary.dark",
                    width: "30px",
                    height: "auto",
                  }}
                />
              </IconButton>
              <Typography
                variant="h4"
                sx={{ color: "third.main", margin: "5px", fontWeight: "bold" }}
              >
                Profildaten
              </Typography>
              <Avatar sx={{ margin: "5px", bgcolor: "background.white" }}>
                <CreateRoundedIcon
                  sx={{
                    color: "third.main",
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
                    Änderungen Speichern
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", flexDirection: "column" }}
                >
                  <Button
                    onClick={this.handleClickDelete}
                    variant="contained"
                    endIcon={<DeleteForeverRoundedIcon />}
                    sx={{
                      marginBottom: "15px",
                      width: "100%",
                      bgcolor: "rgba(197, 0, 0, 0.1)",
                      color: "error.main",
                      border: "2px solid #c50000 ",
                      "&:hover": {
                        bgcolor: "error.main",
                        color: "background.default",
                      },
                    }}
                  >
                    Profil löschen
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
                    Zur weiteren Nutzung bitte Formular nicht leer lassen.
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
