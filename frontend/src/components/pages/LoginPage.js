import React, { Component } from "react";
import FontLogin from "../FontLogin";
import Logo from "../../images/Fridge_Logo.png";
import "../LogBox.css";
import { Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";

class LoginPage extends Component {
  render() {
    const { onSignIn } = this.props;

    return (
      <>
        <FontLogin />
        <div className="wrapper">
          <Card
            className="login-box"
            sx={{
              background: "transparent",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 0 30px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="login">
              <div className="logfont">
                <Typography
                  fontFamily="Segoe UI"
                  fontSize={"25px"}
                  fontWeight={650}
                  top={"50px"}
                  color={"#162938"}
                >
                  Anmeldung bei Smart Fridge!
                </Typography>
              </div>
              <img
                src={Logo}
                className="fridge-img"
                alt="fridge"
                onClick={onSignIn}
              />
              <div className="btn-log-container">
                <Button
                  className="btn-log"
                  onClick={onSignIn}
                  sx={{
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
                    fontFamily="Segoe UI"
                    fontSize={"18px"}
                    fontWeight={600}
                    top={"50px"}
                  >
                    Login
                  </Typography>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }
}

export default LoginPage;
