import React from "react";
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
          <h2 className="rules-font-household">
            Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
            deine Lebensmittel!
          </h2>
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
            <Link to="/home">
              <div className="household-box"></div>
            </Link>
            <Link to="/home">
              <div className="household-box"></div>
            </Link>
          </div>

          {isPopupOpen && (
            <>
              <div className="overlay"></div>
              <div className="open-popup">
                <Paper action="Haushalt" className="form-container">
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
                        disableRipple
                        sx={{
                          bgcolor: "secondary",
<<<<<<< HEAD
                        },
                      }}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<DoneIcon />}
                      disableRipple
                      sx={{
                        bgcolor: "secondary",
                        color: "secondary",

                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                    >
                      Erstellen
                    </Button>{/* //Wenn MAN HIER KLICKT SOLL SOWOHL onclick{closePopup} und 
                      onclick{createHousehold} ausgeführt werden
 */}
=======
                          color: "secondary",

                          "&:hover": { bgcolor: "primary.bright" },
                        }}
                      >
                        Hinzufügen
                      </Button>
                      <Button
                        variant="outlined"
                        endIcon={<HighlightOffRoundedIcon />}
                        onClick={closePopup}
                        disableRipple
                        sx={{
                          bgcolor: "#fbfbfb",
                          color: "#c50000",
                          borderColor: "#c50000",
                          "&:hover": {
                            bgcolor: "#c50000",
                            color: "#fbfbfb",
                            borderColor: "#fbfbfb",
                          },
                        }}
                      >
                        Abbrechen
                      </Button>
                    </div>
>>>>>>> c1c8dcc8243957a23b073bccdbf704e9a8fe45de
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
