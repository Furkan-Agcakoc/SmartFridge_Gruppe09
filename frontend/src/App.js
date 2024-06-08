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
import dialogConfirmText from "./components/dialogs/DeleteTextDialog";
import DeleteConfirmationDialog from "./components/dialogs/DeleteConfirmationDialog";
// import Grocerie from "./components/Grocerie";
// import Recipe from "./components/Recipe";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      appError: null,
      authError: null,
      authLoading: true,
      dialogopen: false,
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
    //const auth = getAuth(app);
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
          // Sign-out successful.
          console.log("User signed out successfully.");
        })
        .catch((error) => {
          // An error happened.
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
        // The user is signed in
        user
          .getIdToken()
          .then((token) => {
            // Add the token to the browser's cookies. The server will then be
            // able to verify the token against the API.
            // SECURITY NOTE: As cookies can easily be modified, only put the
            // token (which is verified server-side) in a cookie; do not add other
            // user information.
            document.cookie = `token=${token};path=/`;
            // console.log("Token is: " + document.cookie);

            // Set the user not before the token arrived
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
        // User has logged out, so clear the id token
        document.cookie = "token=;path=/";

        // Set the logged out user to null
        this.setState({
          currentUser: null,
        });
      }
      this.setState({ authLoading: false });
    });
  }

  handleClickOpenDialog = (id, type) => {
    console.log(`Dialog opened for ${type} ID:`, id);
    const dialogText = dialogConfirmText[type];
    if (!dialogText) return;

    const dialogTitle = dialogText.title;
    const dialogDescription = dialogText.description;
    const dialogConfirmButtonText = dialogText.confirmButtonText;

    if (type === "grocery") {
      this.setState({ groceryIdToDelete: id });
    } else if (type === "recipe") {
      this.setState({ recipeIdToDelete: id });
    } else if (type === "household") {
      this.setState({ householdIdToDelete: id });
    }

    this.setState({
      dialogopen: true,
      dialogTitle,
      dialogDescription,
      dialogConfirmButtonText,
    });
  };

  handleCloseDialog = () => {
    this.setState({
      dialogopen: false,
      dialogTitle: "",
      dialogDescription: "",
      dialogConfirmButtonText: "",
      groceryIdToDelete: null,
      recipeIdToDelete: null,
      householdIdToDelete: null,
      
    });
  };

  handleConfirmDelete = () => {
    const { groceryIdToDelete, recipeIdToDelete, householdIdToDelete } =
      this.state;

    if (groceryIdToDelete) {
      console.log("Deleting grocery with ID:", groceryIdToDelete);
      // Hier können Sie Ihre Löschlogik für das Lebensmittel einfügen
    } else if (recipeIdToDelete) {
      console.log("Deleting recipe with ID:", recipeIdToDelete);
      // Hier können Sie Ihre Löschlogik für das Rezept einfügen
    } else if (householdIdToDelete) {
      console.log("Deleting household with ID:", householdIdToDelete);
      // Hier können Sie Ihre Löschlogik für das Haushalt einfügen
    }

    this.handleCloseDialog();
  };

  render() {
    const {
      currentUser,
      dialogopen,
      dialogTitle,
      dialogDescription,
      dialogConfirmButtonText,
    } = this.state;

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
                    <Navigate replace to={"/profile"} />
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
                    <EditProfilePage p />
                  </Secured>
                }
              ></Route>

              <Route
                path="/household"
                element={
                  <Secured user={currentUser}>
                    <HouseholdPage
                      handleClickOpenDialog={this.handleClickOpenDialog}
                    />
                  </Secured>
                }
              />
              <Route
                path="/home"
                element={
                  <Secured user={currentUser}>
                    <HomePage
                      handleClickOpenDialog={this.handleClickOpenDialog}
                    />
                  </Secured>
                }
              />

              {/* <Route
                path="/groceries"
                element={
                  <Secured user={currentUser}>
                    <Grocerie />
                  </Secured>
                }
              />
              <Route
                path="/recipes"
                element={
                  <Secured user={currentUser}>
                    <Grocerie />
                  </Secured>
                }
              /> */}
            </Routes>
            <Footer />
          </Router>
        </ThemeProvider>
        <DeleteConfirmationDialog
          open={dialogopen}
          title={dialogTitle}
          description={dialogDescription}
          confirmButtonText={dialogConfirmButtonText}
          onClose={this.handleCloseDialog}
          onConfirm={this.handleConfirmDelete}
        />
      </>
    );
  }
}

export default App;

function Secured(props) {
  let location = useLocation();

  if (!props.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
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
