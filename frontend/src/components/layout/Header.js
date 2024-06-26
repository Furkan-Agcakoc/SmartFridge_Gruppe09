import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../../images/sopra-logo-rahmen.png";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import AccountMenu from "../dialogs/AccountMenu";

class Header extends Component {
  render() {
    const { user, onSignIn, onSignOut } = this.props;

    return (
      <>
        <Box
          height={"70px"}
          width={"100%"}
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            zIndex: 1,
            backgroundColor: "primary.main",
            position: "fixed",
            top: "0",
          }}
        >
          <Box //spacer Box for Header
            sx={{
              width: "200px",
              height: "40px",
            }}
          ></Box>
          <Box //Logo Box
            sx={{
              height: "180px",
              width: "1000px",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              position: "relative",
              top: "35px",
            }}
          >
            <Link to="/home">
              <Box
                component={"img"}
                src={Logo}
                alt="fridge-logo"
                sx={{ width: "130px" }}
              ></Box>
            </Link>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "200px",
              height: "40px",
              // border: "3px black solid",
            }}
          >
            {user ? (
              <Button
                onClick={onSignOut}
                sx={{
                  width: "130px",
                  height: "40px",
                  fontWeight: "bold",
                  backgroundColor: "background.paper",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  transition: "0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={onSignIn}
                sx={{
                  width: "130px",
                  height: "40px",
                  fontWeight: "bold",
                  backgroundColor: "background.paper",
                  border: "none",
                  borderRadius: "30px",
                  cursor: "pointer",
                  transition: "0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.8)",
                  },
                }}
              >
                Login
              </Button>
            )}
            <AccountMenu
              user={user}
              onSignIn={onSignIn}
              onSignOut={onSignOut}
            ></AccountMenu>
          </Box>
        </Box>
      </>
    );
  }
}

export default Header;
