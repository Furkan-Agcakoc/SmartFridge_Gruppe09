import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import LoginPage from "./components/pages/LoginPage";
import HouseholdPage from "./components/pages/HouseholdPage";
import Header from "./components/layout/Header";
import { ThemeProvider } from "@emotion/react";
import Theme from "./Theme";
import Footer from "./components/layout/Footer";
import EditProfilePage from "./components/pages/EditProfilePage";
import SmartFridgeAPI from "./api/SmartFridgeAPI"; // Import the API class
import FridgePage from "./components/pages/FridgePage";
import UserContext from "./components/contexts/UserContext";

// import { Config } from "./config";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      user: null,
      appError: null,
      authError: null,
      authLoading: true,
      showAlert: false,
      dialogOpen: false,
      dialogType: "",
      households: [],
    };
  }

  // getHouseholdsByUserId = (userId) => {
  //   const user = this.context;
  //   console.log(user);

  //   SmartFridgeAPI.getAPI()
  //     .getHouseholdsByUserId(userId)
  //     .then((households) => {
  //       console.log(households);
  //       this.setState({
  //         households: households,
  //       });
  //     });
  // };

  householdList = (households) => {
    this.setState({
      households: households,
    });
  };

  handleSignIn = () => {
    this.setState({ authLoading: true });
    const auth = getAuth(initializeApp(firebaseConfig));
    const provider = new GoogleAuthProvider();
    auth.languageCode = "en";
    signInWithPopup(auth, provider);
  };

  handleSignOut = () => {
    const auth = getAuth(initializeApp(firebaseConfig));
    if (auth.currentUser) {
      signOut(auth)
        .then(() => console.log("User signed out successfully."))
        .catch((error) => console.error("Error signing out:", error));
    }
  };

  componentDidMount() {
    console.log("App", this.state.households);
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    auth.languageCode = "en";
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({
          authLoading: true,
        });

        user
          .getIdToken()
          .then((token) => {
            document.cookie = `token=${token};path=/`;
            this.setState({
              currentUser: user,
              authError: null,
              authLoading: false,
            });

            // Benutzer hinzufügen, wenn er nicht existiert
            SmartFridgeAPI.getAPI()
              .getUser()
              .then((userBOs) => {
                const existingUser = userBOs.find(
                  (u) => u.google_user_id === user.uid || u.email === user.email
                );

                this.setState({
                  user: existingUser,
                });

                if (!existingUser) {
                  console.log("User does not exist in the database");
                  SmartFridgeAPI.getAPI()
                    .addUser({
                      firstname: "",
                      lastname: "",
                      nickname: "",
                      email: user.email,
                      google_user_id: user.uid,
                    })
                    .catch((e) => {
                      if (e.response && e.response.status === 409) {
                        // Konfliktfehler
                        console.log("User already exists in the database");
                      } else {
                        console.error("Error adding user to the database", e);
                      }
                    });
                } else {
                  console.log("User already exists in the database");
                  this.setState({
                    user: existingUser,
                  });
                }
              })
              .catch((e) => {
                console.error(
                  "Error checking user existence in the database",
                  e
                );
              });
          })
          .catch((e) => {
            this.setState({
              authError: e,
              authLoading: false,
            });
          });
      } else {
        document.cookie = "token=;path=/";
        this.setState({
          currentUser: null,
          authLoading: false,
        });
      }
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showAlert: false,
    });
  };

  handleOpenDialog = (Id, type) => {
    // console.log(Id, type)
    console.log("App.js => Dialog opened");
    // console.log(deleteId);
    this.setState({
      dialogType: type,
      dialogOpen: true,
    });
    console.log(Id, type);
  };

  handleCloseDialog = () => {
    console.log("App.js => Dialog closed");
    this.setState({ dialogOpen: false, dialogType: "" });
  };

  // handleConfirmDelete = (id) => {
  //   console.log("App => Confirm delete");
  //   console.log(id);
  //   if (id !== null) {
  //     this.handleAnchorDelete(id);
  //   }
  //   this.handleCloseDialog();
  // };

  // handleConfirmDelete = () => {
  //   console.log("HouseholdPage => Confirm delete");
  //   const { householdIdToDelete } = this.state;
  //   console.log(householdIdToDelete);
  //   if (householdIdToDelete !== null) {
  //     this.handleAnchorDelete(householdIdToDelete);
  //   }
  //   this.props.handleCloseDialog();
  // };

  render() {
    const { currentUser, dialogOpen, dialogType, user } = this.state;
    return (
      <>
        <UserContext.Provider value={user}>
          <ThemeProvider theme={Theme}>
            <Router>
              <Header
                user={currentUser}
                onSignIn={this.handleSignIn}
                onSignOut={this.handleSignOut}
              />
              <Routes>
                <Route
                  path="/"
                  element={
                    currentUser ? (
                      <Navigate replace to={"/household"} />
                    ) : (
                      <LoginPage onSignIn={this.handleSignIn} />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Secured user={currentUser}>
                      <LoginPage />
                    </Secured>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Secured user={currentUser}>
                      <EditProfilePage />
                    </Secured>
                  }
                />
                <Route
                  path="/household"
                  element={
                    <Secured user={currentUser}>
                      <HouseholdPage
                        householdList={this.householdList}
                        dialogOpen={dialogOpen}
                        dialogType={dialogType}
                        handleOpenDialog={this.handleOpenDialog}
                        handleCloseDialog={this.handleCloseDialog}
                        handleConfirmDelete={this.handleConfirmDelete}
                      />
                    </Secured>
                  }
                />
                <Route
                  path="/home/:householdId"
                  element={
                    <Secured user={currentUser}>
                      <FridgePage
                        getFridgeByHouseholdId={this.getFridgeByHouseholdId}
                        households={this.state.households}
                        dialogOpen={dialogOpen}
                        dialogType={dialogType}
                        handleOpenDialog={this.handleOpenDialog}
                        handleCloseDialog={this.handleCloseDialog}
                        handleConfirmDelete={this.handleConfirmDelete}
                      />
                    </Secured>
                  }
                />
                <Route
                  path="/home"
                  element={
                    <Secured user={currentUser}>
                      <FridgePage
                        dialogOpen={dialogOpen}
                        dialogType={dialogType}
                        handleOpenDialog={this.handleOpenDialog}
                        handleCloseDialog={this.handleCloseDialog}
                        handleConfirmDelete={this.handleConfirmDelete}
                      />
                    </Secured>
                  }
                />
              </Routes>
              <Footer />
            </Router>
          </ThemeProvider>
        </UserContext.Provider>
      </>
    );
  }
}

export default App;

function Secured(props) {
  let location = useLocation();

  if (!props.user) {
    return (
      <Navigate
        to={process.env.PUBLIC_URL + "/"}
        state={{ from: location }}
        replace
      />
    );
  }

  return props.children;
}
