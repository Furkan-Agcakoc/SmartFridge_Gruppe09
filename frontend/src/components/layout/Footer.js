import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "50px",
          width: "100%",
          backgroundColor: "primary.main",
          position: "fixed",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Container
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "50px",
            width: { xs: "100%", sm: "400px", md: "100%" },
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: "light",
              textAlign: "center",
              fontSize: "auto",
              width: { xs: "200px" },
            }}
          >
            SW-Praktikum SoSe 2024
          </Typography>
        </Container>
        <Container
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "50px",
            width: { xs: "50%", sm: "400px", md: "100%" },
          }}
        >
          <Link to="/about" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                boxShadow: 1,
                cursor: "pointer",
                transition: "0.2s ease",
                bgcolor: "primary.dark",
                width: { xs: "100px", md: "130px" },
                "&:hover": { bgcolor: "primary.main", boxShadow: 3 },
              }}
            >
              Über uns
            </Button>
          </Link>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
