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
  signInWithRedirect,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { signOut } from "firebase/auth";
import LoginPage from "./components/pages/LoginPage";
import HouseholdPage from "./components/pages/HouseholdPage";
import Header from "./components/layout/Header";
import HomePage from "./components/pages/HomePage";
import { ThemeProvider } from "@emotion/react";
import Theme from "./Theme";
import Footer from "./components/layout/Footer";
import EditProfilePage from "./components/pages/EditProfilePage";

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

  static getDerivedStateFromError(error) {
    return { appError: error };
  }

  handleSignIn = () => {
    this.setState({
      authLoading: true,
    });

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    auth.languageCode = "en";
    signInWithRedirect(auth, provider);
  };

  handleSignOut = () => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    if (auth.currentUser) {
      signOut(auth)
        .then(() => {
          console.log("User signed out successfully.");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    }
  };

  componentDidMount() {
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
        });
      }
      this.setState({ authLoading: false });
    });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showAlert: false,
    });
  };

  handleInvalid = (e) => {
    e.preventDefault();
    this.setState({ showAlert: true });
    console.log("App.js => Invalid alert confirmed");
  };

  handleInput = () => {
    this.setState({ showAlert: false });
    console.log("App.js => Input closes alert");
  };

  handleOpenDialog = (type) => {
    this.setState({
      dialogType: type,
      dialogOpen: true,
    });


  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  // handleConfirmDelete = () => {
  //   const { householdIdToDelete } = this.state;
  //   if (householdIdToDelete !== null) {
  //     this.handleAnchorDelete(householdIdToDelete);
  //   }
  //   this.handleCloseDialog();
  // };

  render() {
    const { currentUser } = this.state;
    const { dialogOpen, dialogType } = this.state;

    return (
      <>
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
                      handleChange={this.handleChange}
                      handleInvalid={this.handleInvalid}
                      handleInput={this.handleInput}
                      dialogOpen={dialogOpen}
                      dialogType={dialogType}
                      handleOpenDialog={this.handleOpenDialog}
                      handleCloseDialog={this.handleCloseDialog}
                    />
                  </Secured>
                }
              />
              <Route
                path="/home"
                element={
                  <Secured user={currentUser}>
                    <HomePage />
                  </Secured>
                }
              />
            </Routes>
            <Footer />
          </Router>
        </ThemeProvider>
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
