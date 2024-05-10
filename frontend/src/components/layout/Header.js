import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/sopra-logo-rahmen.png";
import { Box } from "@mui/material";
import "./Header.css";

class Header extends Component {
  render() {
    const { user, onSignIn, onSignOut } = this.props;

    return (
      <>
        <nav className="navbar">
          <Box
            className="navbar-container"
            height={"70px"}
            width={"100%"}
            sx={{
              backgroundColor: "primary.main",
              position: "fixed",
              top: "0",
            }}
          >
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
          </Box>
        </nav>
      </>
    );
  }
}

export default Header;
