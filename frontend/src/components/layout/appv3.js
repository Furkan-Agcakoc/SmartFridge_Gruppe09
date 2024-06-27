import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import { Container, ThemeProvider, CssBaseline } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import Theme from './Theme';
import Header from './components/layout/Header';
import SignIn from './components/pages/SignIn';
import firebaseConfig from './firebaseconfig';
import Household from './components/pages/Household';
import Recipe from './components/pages/Recipe';
import Fridge from './components/pages/Fridge';
import AllGroceryList from './components/pages/AllGroceryList';
import { SmartFridgeAPI } from './api';
import MyProfile from './components/pages/MyProfile';
import About from './components/pages/About';



/**
 * The main bank administration app. It uses Googles firebase to log into the bank end. For routing the 
 * user to the respective pages, react-router-dom ist used.
 * 
 * @see See Google [firebase.auth()](https://firebase.google.com/docs/reference/js/firebase.auth.Auth)
 * @see See Google [firebase.auth().signInWithRedirect](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithredirect)
 * @see [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start)
 * 
 * @author [Christoph Kunz](https://github.com/christophkunz)
 */
class App extends React.Component {

	/** Constructor of the app, which initializes firebase  */
	constructor(props) {
		super(props);

		// Init an empty state
		this.state = {
			currentUser: null,
			appError: null,
			authError: null,
			authLoading: false,
			user: null
		};
	}

	/** 
	 * Create an error boundary for this app and recieve all errors from below the component tree.
	 * 
	 * @See See Reacts [Error Boundaries](https://reactjs.org/docs/error-boundaries.html)
		 */
	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { appError: error };
	}

	/** 
	 * Handles the sign in request of the SignIn component uses the firebase.auth() component to sign in.
		 * @see See Google [firebase.auth()](https://firebase.google.com/docs/reference/js/firebase.auth.Auth)
		 * @see See Google [firebase.auth().signInWithRedirect](https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signinwithredirect)
		 */
	handleSignIn = () => {
		this.setState({
			authLoading: true
		});

		const app = initializeApp(firebaseConfig);
		//const auth = getAuth(app);
		const auth = getAuth(app);
		const provider = new GoogleAuthProvider();

		auth.languageCode = 'en';
		signInWithPopup(auth, provider);
	}

	getUserByGid = (currentUser) => {
		SmartFridgeAPI.getAPI().getUserGid(currentUser.uid).then(user =>
			this.setState({
				user: user,
				loadingInProgress: false,
				loadingError: null
			})
		).catch(e =>
			this.setState({ // Reset state with error from catch 
				user: null,
				loadingInProgress: false,
				loadingError: e
			})
		);
		// set loading to true
		this.setState({
			loadingInProgress: true,
			loadingError: null
		});
	}

	/**
	 * Lifecycle method, which is called when the component gets inserted into the browsers DOM.
	 * Initializes the firebase SDK.
	 * 
	 * @see See Googles [firebase init process](https://firebase.google.com/docs/web/setup)
	 */
	componentDidMount() {
		const app = initializeApp(firebaseConfig);
		const auth = getAuth(app);

		auth.languageCode = 'en';
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.setState({
					authLoading: true
				});
				// The user is signed in
				user.getIdToken().then(token => {
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
						authLoading: false
					});
					this.getUserByGid(user)
				}).catch(e => {
					this.setState({
						authError: e,
						authLoading: false
					});
				});
			} else {
				// User has logged out, so clear the id token
				document.cookie = 'token=;path=/';

				// Set the logged out user to null
				this.setState({
					currentUser: null,
					authLoading: false
				});
			}
		});
	}

	/** Renders the whole app */
	render() {
		const { currentUser, user } = this.state;
		

		return (
			<ThemeProvider theme={Theme}>
				{/* Global CSS reset and browser normalization. CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
				<CssBaseline />
				<Router>
					<Container maxWidth='md'>
						<Header user={user} />
						<Routes>
							<Route path={process.env.PUBLIC_URL} >
								<Route path={process.env.PUBLIC_URL + '/'} element={
									// For some special cases we need to handle the root route
									// Redirect if the user is signed in
									currentUser ?
										user ?
											(user[0].username === "") ?
												<Navigate replace to={process.env.PUBLIC_URL + '/myprofile'} />
												:
												<Navigate replace to={process.env.PUBLIC_URL + '/household'} />
											: null
										:
										<SignIn onSignIn={this.handleSignIn} />

								} />
								<Route path={process.env.PUBLIC_URL + '/*'} element={
									// Firebase redirects to index.html
									// Redirect if the user is signed in
									currentUser ?
										user ?
											(user[0].username === "") ?
												<Navigate replace to={process.env.PUBLIC_URL + '/myprofile'} />
												:
												<Navigate replace to={process.env.PUBLIC_URL + '/household'} />
											: null
										:
										<SignIn onSignIn={this.handleSignIn} />
								} />
								<Route path={process.env.PUBLIC_URL + '/household'} element={<Secured user={user} currentUser={currentUser}><Household user={user} /> </Secured>} />
								<Route path={process.env.PUBLIC_URL + '/fridge'} element={<Secured user={user} currentUser={currentUser}><Fridge user={user} /> </Secured>} />
								{/* <Route path={process.env.PUBLIC_URL + '/myprofile'} element={<Secured user={user} currentUser={currentUser}><MyProfile user={user} Cuser={currentUser} /> </Secured>} /> */}
								<Route path={process.env.PUBLIC_URL + '/myprofile'} element={<MyProfile user={user} Cuser={currentUser} />} />
								<Route path={process.env.PUBLIC_URL + '/grocery'} element={<Secured user={user} currentUser={currentUser}><AllGroceryList user={user} currentUser={currentUser} /> </Secured>} />
								<Route path={process.env.PUBLIC_URL + '/recipe'} element={<Secured user={user} currentUser={currentUser}><Recipe user={user} currentUser={currentUser} /> </Secured>} />
								<Route path={process.env.PUBLIC_URL + '/about'} element={<Secured user={user} currentUser={currentUser}><About user={user} currentUser={currentUser} /> </Secured>} />
							</Route>

						</Routes>

					</Container>
				</Router>
			</ThemeProvider>
		);
	}
}

export default App;


/**
 * Helper Component to wrap other Components, which shall only be accessed by a logged in user.
 * 
 * @param {props} The React props 
 * @returns 
 */
const Secured = ({ user, currentUser, children }) => {

	if (!currentUser) {
	  return <Navigate to={process.env.PUBLIC_URL + '/'} replace />;
	}
  
	if (!user || user[0].username === "") {
	  return <Navigate to={process.env.PUBLIC_URL + '/myprofile'} replace />;
	}
  
	return children;
  };
