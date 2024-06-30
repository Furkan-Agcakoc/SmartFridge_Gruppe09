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
import AboutPage from "./components/pages/AboutPage";
import EditProfilePage from "./components/pages/EditProfilePage";
import SmartFridgeAPI from "./api/SmartFridgeAPI"; // Import the API class
import FridgePage from "./components/pages/FridgePage";
import UserContext from "./components/contexts/UserContext";
import { FridgeProvider } from "./components/contexts/FridgeContext";
import { UserBO } from "./api";

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
    };
  }

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

  getUser = () => {
    return SmartFridgeAPI.getAPI()
      .getUser()
      .then((userBOs) => {
        this.setState({
          user: userBOs,
        });
        return userBOs;
      })
      .catch((e) => {
        // console.error("Error loading users: ", e);
        throw e;
      });
  };

  addUsers = () => {
    const { currentUser } = this.state;
    const [firstName, lastName] = currentUser.displayName.split(" ");
    const nickname = currentUser.email.split("@");
    const email = currentUser.email;
    const google_user_id = currentUser.uid;

    const newUser = new UserBO(
      firstName, // firstname
      lastName, // lastname
      nickname[0], // nickname
      email, // email
      google_user_id // google_user_id
    );
    console.log("New User:", newUser);

    return SmartFridgeAPI.getAPI()
      .addUser(newUser)
      .then((addedUser) => {
        this.setState({
          user: addedUser,
        });
        return addedUser;
      })
      .catch((e) => {
        console.error("Error adding user: ", e); // Unkommentiert um Fehler zu protokollieren
        throw e;
      });
  };

  componentDidMount() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    auth.languageCode = "en";
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.setState({ authLoading: true });

        user
          .getIdToken()
          .then((token) => {
            document.cookie = `token=${token};path=/`;
            this.setState({
              currentUser: user,
              authError: null,
              authLoading: false,
            });

            this.getUser()
              .then((userBOs) => {
                const existingUser = userBOs.find(
                  (u) => u.google_user_id === user.uid || u.email === user.email
                );

                if (!existingUser) {
                  // console.log("User does not exist in the database");
                  this.addUsers().catch((e) => {
                    if (e.response && e.response.status === 409) {
                      console.log("User already exists in the database");
                    } else {
                      console.error("Error adding user to the database", e);
                    }
                  });
                } else {
                  console.log("User already exists in the database");
                  this.setState({ user: existingUser });
                  // console.log(existingUser);
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

  handleOpenDialog = (Id, type) => {
    // console.log(Id, type)
    // console.log("App.js => Dialog opened");
    // console.log(deleteId);
    this.setState({
      dialogType: type,
      dialogOpen: true,
    });
    console.log(Id, type);
  };

  handleCloseDialog = () => {
    // console.log("App.js => Dialog closed");
    this.setState({ dialogOpen: false, dialogType: "" });
  };

  render() {
    const { currentUser, dialogOpen, dialogType, user } = this.state;
    return (
      <>
        <UserContext.Provider value={user}>
          <FridgeProvider>
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
                          dialogOpen={dialogOpen}
                          dialogType={dialogType}
                          handleOpenDialog={this.handleOpenDialog}
                          handleCloseDialog={this.handleCloseDialog}
                        />
                      </Secured>
                    }
                  />
                  <Route
                    path="/home/:householdId"
                    element={
                      <Secured user={currentUser}>
                        <FridgePage
                          dialogOpen={dialogOpen}
                          dialogType={dialogType}
                          handleOpenDialog={this.handleOpenDialog}
                          handleCloseDialog={this.handleCloseDialog}
                        />
                      </Secured>
                    }
                  />
                  <Route path="/about" element={<AboutPage />}></Route>
                </Routes>
                <Footer />
              </Router>
            </ThemeProvider>
          </FridgeProvider>
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
