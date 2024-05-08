import React from "react";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import Tooltip from "@mui/material/Tooltip";
import "./Household.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneIcon from "@mui/icons-material/Done";

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
            {/* <Link to="/home">
              <div className="household-box"></div>
            </Link> */}
          </div>

          {isPopupOpen && (
            <>
              <div className="overlay"></div>
              <div className="open-popup">
                <form action="Haushalt" className="form-container">
                  <h2>Haushalt erstellen</h2>
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
                    <Button
                      variant="contained"
                      endIcon={<CancelIcon />}
                      onClick={closePopup}
                      disableRipple
                      sx={{
                        bgcolor: "primary",
                        color: "secondary",
                        "&:hover": {
                          bgcolor: "secondary",
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
                    </Button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Household;
