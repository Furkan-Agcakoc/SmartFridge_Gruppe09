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

  getUserByGid = (currentUser) => {
    SmartFridgeAPI.getAPI()
      .getUserByGoogleId(currentUser.uid)
      .then((user) =>
        this.setState({
          user: user,
          loadingInProgress: false,
          loadingError: null,
        })
      )
      .catch((e) =>
        this.setState({
          // Reset state with error from catch
          user: null,
          loadingInProgress: false,
          loadingError: e,
        })
      );
    // set loading to true
    this.setState({
      loadingInProgress: true,
      loadingError: null,
    });
  };

  handleSignIn = () => {
    this.setState({ authLoading: true });
    const auth = getAuth(initializeApp(firebaseConfig));
    const provider = new GoogleAuthProvider();
    auth.languageCode = "en";
    signInWithRedirect(auth, provider);
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
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.languageCode = "en";
    onAuthStateChanged(auth, (user) => {
      console.log(user)
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



            SmartFridgeAPI.api.addUser({
              firstname: "",
              lastname: "",
              nickname: "",
              email: user.email,
              google_user_id: user.uid,

            }).then(() => {
              console.log('User added to the database successfully');
            }).catch((e) => {
              console.error('Error adding user to the database', e);
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
    const { currentUser, dialogOpen, dialogType } = this.state;
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
