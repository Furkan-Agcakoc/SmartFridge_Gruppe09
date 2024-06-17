import React, { Component } from "react";
import FontLogin from "../dialogs/FontLogin";
import Logo from "../../images/Fridge_Logo.png";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

class LoginPage extends Component {
  render() {
    const { onSignIn } = this.props;

    return (
      <>
        <FontLogin />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: "175px",
          }}
        >
          <Card
            sx={{
              background: "transparent",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 0 30px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(20px)",
              width: " 500px",
              height: "500px",
              display: "flex",
              justifyContent: "center",
              alignItems: "space-evenly",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                fontSize={"30px"}
                fontWeight={600}
                color={"#162938"}
                position={"relative"}
                top={"40px"}
              >
                Anmeldung bei Smart Fridge!
              </Typography>
              <Box
                component={"img"}
                src={Logo}
                alt="fridge-logo"
                sx={{
                  width: "100px",
                  position: "relative",
                  top: "90px",
                  margin: "0 auto",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "relative",
                  top: "150px",
                }}
              >
                <Button
                  onClick={onSignIn}
                  sx={{
                    width: "250px",
                    height: "40px",
                    cursor: "pointer",
                    transition: "0.2s ease ",
                    background: "rgba(255, 255, 255, 0.4)",
                    backgroundColor: "primary.main",
                    color: "#fbfbfb",
                    "&:hover": {
                      color: "rgba(29, 151, 35, 0.8)",
                      border: "2px solid #8dc4af",
                      background: "rgba(29, 151, 35, 0.2)",
                    },
                  }}
                >
                  <Typography
                    fontSize={"18px"}
                    fontWeight={600}
                    top={"50px"}
                    
                  >
                    Login
                  </Typography>
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      </>
    );
  }
}

export default LoginPage;
