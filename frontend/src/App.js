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
// import dialogConfirmText from "./components/dialogs/DeleteTextDialog";
// import DeleteConfirmationDialog from "./components/dialogs/DeleteConfirmationDialog";
// import Grocerie from "./components/Grocerie";
// import Recipe from "./components/Recipe";
import Alert from "@mui/material/Alert";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      appError: null,
      authError: null,
      authLoading: true,
      // dialogopen: false,
      // Props for all
      showAlert: false,
      alertMessage: "",
      //Popup situation
      popupOpen: false,
      isEditMode: false,

      //Editpopup
      currentlyEditing: null,
      // Household information
      households: [],
      householdCount: 0,
      householdIdToDelete: null,
      value: "",
      // Grocery information

      // Recipe information

      // Anchor situation
      anchorEls: {},
      openMenus: {},
      // Dialog situation
      // dialogopen: false,
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

  // Methods-----------------------------------------------------------

  // setPopupOnEditMode = (household) => {
  //   if (household.length === null) {
  //     this.setState({
  //       popupOpen: true,
  //       isEditMode: false,
  //       currentlyEditing: null,
  //     });
  //   } else {
  //     this.setState({
  //       popupOpen: true,
  //       isEditMode: true,
  //       currentlyEditing: household,
  //     });
  //   }
  // };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      showAlert: false,
    });
    console.log("Name: ", name);
  };

  triggerAlert = (message) => {
    this.setState({
      showAlert: true,
      alertMessage: message,
    });
  };

  openPopup = (isEditMode = false, household = null) => {
    this.setState({
      popupOpen: true,
      isEditMode,
      currentlyEditing: household,
    });
    console.log("App.js => Popup opend");
  };

  closePopup = () => {
    console.log("App.js => Popup closed");
    this.setState({
      popupOpen: false,
      currentlyEditing: null,
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

  handleCreateObject = (householdData) => {
    console.log("App.js => Object created");
    const { currentlyEditing, households } = this.state;

    if (currentlyEditing !== null) {
      // Edit existing household
      const updatedHouseholds = this.updateHousehold({
        householdId: currentlyEditing, // Use the householdId from currentlyEditing
        householdName: householdData.householdName,
        emails: householdData.emails, // Keep existing emails
      });

      this.setState({
        households: updatedHouseholds,
        popupOpen: false,
        householdName: "",
        showAlert: false,
        currentlyEditing: null,
      });

      console.log("Haushalt nach dem Edit:", updatedHouseholds);
    } else {
      // Create new household
      const id = households.length + 1;
      console.log("new household");

      this.setState((prevState) => {
        const newHouseholds = [
          ...prevState.households,
          {
            householdId: id,
            householdName: householdData.householdName,
            emails: [],
          },
        ];
        const newOpenMenus = { ...prevState.openMenus, [id]: false };
        console.log(newHouseholds);

        return {
          householdCount: prevState.householdCount + 1,
          popupOpen: false,
          households: newHouseholds,
          householdName: "",
          showAlert: false,
          openMenus: newOpenMenus,
        };
      });
    }
  };
  // updateHousehold(household) {
  //   return this.state.households.map((e) =>
  //     household.householdId === e.householdId ? household : e
  //   );
  // }

  updateHousehold(household) {
    const updatedHouseholds = this.state.households.map((e) => {
      if (household.householdId === e.householdId) {
        return { ...e, ...household }; // Ensure the household object is merged correctly
      }
      return e;
    });

    console.log("Updated Household:", household);
    console.log("Updated Households List:", updatedHouseholds);

    return updatedHouseholds;
  }
  showHousehold = () => {
    const { households } = this.state;
    console.log("App.js => Show household", households);
  };

  handleAnchorClick = (householdId, event) => {
    console.log("App.js => Anchor clicked", householdId);
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: true };
      const newAnchorEls = {
        ...prevState.anchorEls,
        [householdId]: event.target,
      };
      console.log(newAnchorEls);
      console.log(newOpenMenus);
      return {
        anchorEls: newAnchorEls,
        openMenus: newOpenMenus,
      };
    });
  };

  handleAnchorClose = (householdId) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
      return {
        openMenus: newOpenMenus,
      };
    });
  };

  // handleAnchorEdit = (household) => {
  //   console.log("App.js => Anchor edit clicked", household);
  //   this.setState((prevState) => {
  //     const newOpenMenus = {
  //       ...prevState.openMenus,
  //       [household.householdId]: false,
  //     };
  //     return {
  //       currentlyEditing: household.householdId,
  //       currentName: household.householdName,
  //       openMenus: newOpenMenus,
  //     };
  //   });
  // };

  handleAnchorEdit = (householdId) => {
    console.log(householdId);
    this.setState(
      (prevState) => {
        const newOpenMenus = {
          ...prevState.openMenus,
          [householdId]: false,
        };
        return {
          currentlyEditing: householdId,
          openMenus: newOpenMenus,
          popupOpen: true,
        };
      },
      () => {
        this.openPopup(true, householdId);
      }
    );
  };

  handleAnchorDelete = (householdId) => {
    this.setState((prevState) => {
      const newOpenMenus = { ...prevState.openMenus, [householdId]: false };
      const newHouseholds = prevState.households.filter(
        (h) => h.householdId !== householdId
      );
      return {
        households: newHouseholds,
        openMenus: newOpenMenus,
      };
    });
  };

  // End of Methods----------------------------------------------------
  render() {
    const { currentUser, showAlert, popupOpen, isEditMode, households, currentlyEditing } =
      this.state;

    const showAlertComponent = showAlert && (
      <Alert severity="error" sx={{ marginBottom: "20px" }}>
        Bitte geben Sie einen Haushaltsnamen ein!
      </Alert>
    );

    const editingHousehold = currentlyEditing
      ? households.find((h) => h.householdId === currentlyEditing)
      : null;

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
              ></Route>

              <Route
                path="/household"
                element={
                  <Secured user={currentUser}>
                    <HouseholdPage
                      openPopup={this.openPopup}
                      closePopup={this.closePopup}
                      popupOpen={popupOpen}
                      handleInvalid={this.handleInvalid}
                      handleInput={this.handleInput}
                      showAlertComponent={showAlertComponent}
                      showAlert={showAlert}
                      handleCreateObject={this.handleCreateObject}
                      households={households}
                      handleAnchorClick={this.handleAnchorClick}
                      handleAnchorClose={this.handleAnchorClose}
                      handleAnchorEdit={this.handleAnchorEdit}
                      handleAnchorDelete={this.handleAnchorDelete}
                      anchorEls={this.state.anchorEls}
                      openMenus={this.state.openMenus}
                      isEditMode={isEditMode}
                      householdName={
                        editingHousehold ? editingHousehold.householdName : ""
                      }
                      // householdEmails={
                      //   editingHousehold ? editingHousehold.emails : []
                      // }
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
        {/* <DeleteConfirmationDialog
          open={dialogopen}
          title={dialogTitle}
          description={dialogDescription}
          confirmButtonText={dialogConfirmButtonText}
          onClose={this.handleCloseDialog}
          onConfirm={this.handleConfirmDelete}
        /> */}
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
