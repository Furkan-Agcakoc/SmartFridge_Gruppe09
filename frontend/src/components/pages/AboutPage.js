import React from "react";
import { Box, Container, Typography, IconButton, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const AboutPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Header />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          minHeight: "100vh",
          paddingTop: { xs: "16px", sm: "25px", md: "35px" },
          paddingBottom: "50px",
          overflowY: "auto",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            height: { xs: "95px", md: "105px" },
            width: "100%",
            display: "flex",
            alignItems: "center",
            bgcolor: "background.paper",
            position: "fixed",
            p: 0,
            m: 0,
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            position: "fixed",
            top: { xs: "85px", sm: "90px", md: "150px" },
            zIndex: 1,
            bgcolor: "background.paper",
            p: 1,
            m: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              position: "absolute",
              left: 10,
            }}
          >
            <IconButton onClick={handleBackClick}>
              <ArrowBackIosNewRoundedIcon
                fontSize="large"
                sx={{ color: "text.primary" }}
              />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "30px", sm: "35px", md: "40px" },
                fontWeight: 600,
                color: "text.primary",
                marginLeft: "10px",
              }}
            >
              Über uns
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            padding: "20px",
            marginTop: { xs: "140px", sm: "150px", md: "160px" },
          }}
        >
          <Divider />
          <Typography
            color="third.main"
            sx={{
              fontSize: { xs: "15px", sm: "20px", md: "25px" },
              fontWeight: "light",
              color: "text.primary",
              textAlign: "center",
              margin: "20px",
            }}
          >
            Wir sind ein Team von 5 Studenten, die im Sommersemester 2024 das
            Softwarepraktikum an der Hochschule der Medien in
            Stuttgart/Vaihingen absolvieren.
            <br /> <br />
            Unser Projekt "Smart Fridge" ist eine Webanwendung, die es
            ermöglicht, den Inhalt eines Kühlschranks zu verwalten. Dabei kann
            der Nutzer Lebensmittel hinzufügen, entfernen und verwalten. Die
            Anwendung bietet eine Übersicht über alle Ihre Lebensmittel in Ihrem
            jeweiligen Haushalt. Außerdem kann jeder Nutzer sein eigenes Rezept
            erstellen, entfernen und bearbeiten. Möchte der Nutzer ein Rezept
            kochen, so kann er mit einem Klick alle möglichen Rezepte mit den
            Lebensmitteln anzeigen lassen, die er bereits in seinem Kühlschrank
            hat. Zudem werden bei mit der Funktion Rezept zu kochen, alle
            Zutaten von dem Lebensmitteln aus dem Kühlschrank entfernt ohne das
            der Nutzer jedes Lebensmittel selber bearbeiten muss.
            <br /> <br />
            Wir wünschen Ihnen viel Spaß beim Ausprobieren!
            <br />
            <br />
            <br />
            <br />
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: { xs: "11px", sm: "14px", md: "16px" },
            fontWeight: "light",
            color: "grey",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          | Furkan Agcakoc | Mustafa Aslan | Baran Kocabey | Sead Shatrolli |
          Mehmet-Akif Yavuz |
        </Typography>
      </Container>
      <Footer />
    </>
  );
};

export default AboutPage;
