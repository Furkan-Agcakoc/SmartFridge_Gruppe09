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

const withNavigation = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }; // Definiert eine höhere Ordnungskomponente, um den useNavigate-Hook zu verwenden und als Prop weiterzugeben.
};

class EditProfilePage extends Component {
  static contextType = UserContext; // Setzt den UserContext als Kontext für die Komponente.

  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      nickName: "",
      showAlertSignin: false,
    }; // Initialisiert den Zustand der Komponente.
  }

  handleBackClick = () => {
    this.props.navigate(-1); // Navigiert eine Seite zurück.
  };

  componentDidMount() {
    const userId = this.context.id;
    this.getUserById(userId); // Ruft die Benutzerdaten beim Mounten der Komponente ab.
  }

  handleSaveClick = async (e) => {
    const userId = this.context.id;
    const form = e.target.closest("form");

    if (form.checkValidity()) {
      await this.updateUser(userId);
      this.props.navigate("/household"); // Speichert die Änderungen und navigiert zur Household-Seite.
    } else {
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
    }); // Setzt die Benutzerinformationen in den Zustand.
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

      await SmartFridgeAPI.getAPI().updateUser(updatedUser); // Aktualisiert die Benutzerdaten.
    } catch (error) {
      this.setState({ showAlertSignin: true });
    }
  };

  handleClickDelete = () => {
    const userId = this.context.id;
    this.deleteUser(userId);
    this.props.handleSignOut(); // Löscht den Benutzer und meldet ihn ab.
  };

  deleteUser = async (userId) => {
    try {
      await SmartFridgeAPI.getAPI().deleteUser(userId); // Löscht den Benutzer.
    } catch (error) {
      this.setState({ showAlertDelete: true });
    }
  };

  handleCloseAlert = () => {
    this.setState({ showAlertSignin: false }); // Schließt den Alert.
  };

  render() {
    const { firstName, lastName, nickName, showAlertSignin } = this.state;

    const showAlertSigninComp = showAlertSignin && (
      <Alert severity="error" sx={{ marginBottom: "20px" }}>
        Bitte füllen Sie alle Felder aus!
      </Alert>
    ); // Zeigt einen Alert an, wenn nicht alle Felder ausgefüllt sind.
    
    return (
      <>
        <Paper
          component="form"
          sx={{
            maxWidth: { xs: "90%", sm: "xs" },
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: { xs: "50%", sm: "40%" },
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1001,
            backgroundColor: "white",
            padding: { xs: "50px", sm: "20px" },
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
            width: { xs: "50%", sm: "600px" },
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

export default withNavigation(EditProfilePage); // Exportiert die Komponente mit Navigation.
