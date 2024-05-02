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
import firebaseConfig from "./firebaseconfig";

import LoginPage from "./components/pages/LoginPage";
import HouseholdPage from "./components/pages/HouseholdPage";
import Header from "./components/layout/Header";
import HomePage from "./components/pages/HomePage";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      appError: null,
      authError: null,
      authLoading: true,
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

  render() {
    const { currentUser } = this.state;
    return (
      <>
        <Router>
          <Header user={currentUser} onSignIn={this.handleSignIn} />
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
              path="/household"
              element={
                <Secured user={currentUser}>
                  <HouseholdPage />
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
        </Router>
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
        to={process.env.PUBLIC_URL + "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  return props.children;
}
