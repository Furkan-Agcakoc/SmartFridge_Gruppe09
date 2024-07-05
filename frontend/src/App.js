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

  getUserByGoogleId = (currentUser) => {
    return SmartFridgeAPI.getAPI()
      .getUserByGoogleId(currentUser.uid)
      .then((user) => {
        this.setState({ user: user });
        return user;
      })
      .catch((e) => {
        this.setState({ user: null });
        throw e;
      });
  };

  componentDidMount() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    auth.languageCode = "en";
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.setState({ authLoading: true });

        try {
          const token = await user.getIdToken();
          document.cookie = `token=${token};path=/`;
          this.setState({
            currentUser: user,
            authError: null,
            authLoading: false,
          });

          this.getUserByGoogleId(user);
        } catch (e) {
          console.error("Error getting user by google id: ", e);
          this.setState({ authError: e, authLoading: false });
        }
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
                      <EditProfilePage handleSignOut={this.handleSignOut} />
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
