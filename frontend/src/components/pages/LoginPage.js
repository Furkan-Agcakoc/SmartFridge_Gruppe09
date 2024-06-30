import React, { Component } from "react";
import FontLogin from "../dialogs/FontLogin";
import Logo from "../../images/Fridge_Logo.png";
import { Typography, Card, Button, Box } from "@mui/material";

class LoginPage extends Component {
  render() {
    const { onSignIn } = this.props;

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontLogin />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            px: 2,
          }}
        >
          <Card
            sx={{
              background: "transparent",
              border: "2px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 0 30px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(20px)",
              width: { xs: "100%", sm: "400px", md: "450px" },
              height: { xs: "auto", sm: "auto", md: "450px" },
              p: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              fontSize={{ xs: "20px", sm: "25px", md: "30px" }}
              fontWeight={600}
              color={"#162938"}
              mt={2}
              mb={3}
              textAlign="center"
            >
              Anmeldung bei Smart Fridge!
            </Typography>
            <Box
              component="img"
              src={Logo}
              alt="fridge-logo"
              sx={{ width: "100px", mb: 3, zIndex: 1000 }}
            />
            <Button
              onClick={onSignIn}
              sx={{
                width: "100%",
                maxWidth: "250px",
                height: "40px",
                boxShadow: 1,
                cursor: "pointer",
                transition: "0.2s ease ",
                backgroundColor: "primary.main",
                color: "#fbfbfb",
                mt: "20px",
                "&:hover": {
                  bgcolor: "primary.dark",
                  boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                },
              }}
            >
              <Typography fontSize={"18px"} fontWeight={600}>
                Login
              </Typography>
            </Button>
          </Card>
        </Box>
      </>
    );
  }
}

export default LoginPage;
