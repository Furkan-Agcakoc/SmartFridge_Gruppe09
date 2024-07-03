import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/sopra-logo-rahmen.png";
import { Box, Button } from "@mui/material";
import AccountMenu from "../dialogs/AccountMenu";

class Header extends Component {
  render() {
    const { user, onSignIn, onSignOut } = this.props;

    return (
      <>
        <Box
          sx={{
            height: { xs: "60px", md: "70px" },
            width: "100%",
            display: "flex",
            alignItems: "center",
            bgcolor: "primary.main",
            position: "fixed",
            top: 0,
            p: 0,
            zIndex: 100,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: { xs: "35px", md: "80px" },
              zIndex: 101,
            }}
          >
            <Link to="/household">
              <Box
                component={"img"}
                src={Logo}
                alt="fridge-logo"
                sx={{ width: { xs: "80px", md: "130px" } }}
              />
            </Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              width: "100%",
              mx: "20px",
              zIndex: 102,
            }}
          >
            {user ? (
              <Button
                variant="text"
                onClick={onSignOut}
                sx={{
                  width: "130px",
                  height: "40px",
                  fontWeight: "bold",
                  backgroundColor: "background.paper",
                  cursor: "pointer",
                  transition: "0.3s ease",
                  display: { xs: "none", sm: "block" }, // Hide button on small screens
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="text"
                onClick={onSignIn}
                sx={{
                  width: "130px",
                  height: "40px",
                  fontWeight: "bold",
                  backgroundColor: "background.paper",
                  cursor: "pointer",
                  transition: "0.3s ease",
                  display: { xs: "none", sm: "block" }, // Hide button on small screens
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                Login
              </Button>
            )}
            <AccountMenu
              sx={{ width: { xs: "auto", md: "auto" } }}
              user={user}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
            />
          </Box>
        </Box>
      </>
    );
  }
}

export default Header;
