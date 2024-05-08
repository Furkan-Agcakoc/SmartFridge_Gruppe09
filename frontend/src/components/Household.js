import React from "react";
import Typography from "@mui/material/Typography";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import Tooltip from "@mui/material/Tooltip";
import "./Household.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

const Household = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  function openPopup() {
    setPopupOpen(true);
  }

  function closePopup() {
    setPopupOpen(false);
  }

  const styleForAdd = {
    width: "6vh",
    height: "auto",
  };

  const emails = [
    "furkana.gs2002@gmail.com",
    "meayavuz@gmail.com",
    "baran2323a@gmail.com",
    "derzockerlp63@gmail.com",
    "sead.shat@gmail.com",
  ];

  return (
    <>
      <div className="container-household">
        <div className="container-household-flexbox">
          <Typography
            // className="rules-font-household"
            fontFamily="Segoe UI"
            fontSize={"27px"}
            fontWeight={600}
            sx={{}}
          >
            Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
            deine Lebensmittel!
          </Typography>
          <div className="wrapper-household-box">
            <Link onClick={openPopup}>
              <div className="household-box">
                <Tooltip
                  title="Neuen Haushalt hinzufügen"
                  placement="bottom"
                  arrow
                >
                  <AddHomeOutlinedIcon style={styleForAdd} />
                </Tooltip>
              </div>
            </Link>
            {/* <Link to="/home">
              <div className="household-box"></div>
            </Link> */}
          </div>

          {isPopupOpen && (
            <>
              <div className="overlay"></div>
              <div className="open-popup">
                <Paper action="Haushalt" className="paper-container">
                  <h2>Neuen Haushalt hinzufügen</h2>
                  <div className="text-container">
                    <TextField
                      required
                      id="outlined-required"
                      label="Haushaltsname"
                      placeholder="Haushaltsname"
                      InputLabelProps={{ style: { fontSize: "15px" } }}
                    />
                    <Autocomplete
                      options={emails}
                      multiple
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Bewohner hinzufügen"
                          placeholder="Bewohner hinzufügen"
                          InputLabelProps={{ style: { fontSize: "15px" } }}
                        />
                      )}
                    />
                  </div>
                  <div className="popup-buttons-cnt">
                    <div className="confirm-btn">
                      <Button
                        variant="contained"
                        endIcon={<CheckCircleOutlineRoundedIcon />}
                        sx={{
                          color: "success.dark",
                          bgcolor: "rgba(29, 151, 35, 0.2)",
                          border: "2px solid #06871d",
                          "&:hover": {
                            bgcolor: "success.dark",
                            color: "background.default",
                          },
                        }}
                      >
                        Hinzufügen
                      </Button>
                      <Button
                        variant="contained"
                        endIcon={<HighlightOffRoundedIcon />}
                        onClick={closePopup}
                        sx={{
                          bgcolor: "rgba(197, 0, 0, 0.1)",
                          color: "error.main",
                          border: "2px solid #c50000 ",
                          "&:hover": {
                            bgcolor: "error.main",
                            color: "background.default",
                          },
                        }}
                      >
                        Abbrechen
                      </Button>
                    </div>
                  </div>
                </Paper>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Household;
