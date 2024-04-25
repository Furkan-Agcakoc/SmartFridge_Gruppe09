import React from "react";
import "./navbar.css";
// import { NavLink } from "react-router-dom";
import Logo from "../images/SFLogo.png";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logOut } = UserAuth();
  const { googleSignIn } = UserAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/households");
    }
  }, [user, navigate]);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="space-container"></div>
          <div className="logo-container">
            <Link to="/loginpage">
              <img src={Logo} alt="logo" className="logo" />
            </Link>
          </div>
          <div className="nav-btn-container">
            <div className="nav-btn">
              {user?.displayName ? (
                <button onClick={handleSignOut} className="signin">
                  Logout
                </button>
              ) : (
                <Link>
                  <button className="signin" onClick={handleGoogleSignIn}>
                    Signin
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
// Kommentar