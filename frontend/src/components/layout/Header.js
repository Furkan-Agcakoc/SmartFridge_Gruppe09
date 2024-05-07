import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/sopra-logo-rahmen.png";
import "./Header.css";

class Header extends Component {
  render() {
    const { user, onSignIn, onSignOut } = this.props;

    return (
      <>
        <nav className="navbar">
          <div className="navbar-container" >
            <div className="space-container"></div>
            <div className="logo-container">
              <Link>
                <img src={Logo} alt="logo" className="logo" />
              </Link>
            </div>
            <div className="nav-btn-container">
              {user ? (
                <button className="signin" onClick={onSignOut}>
                  Logout
                </button>
              ) : (
                <button className="signin" onClick={onSignIn}>
                  Login
                </button>
              )}
            </div>
          </div>
        </nav>
      </>
    );
  }
}

export default Header;
