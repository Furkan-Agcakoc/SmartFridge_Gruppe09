import React from "react";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import Tooltip from "@mui/material/Tooltip";
import "./Household.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
// import {Autocomplete} from "@mui/material";

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

  const styleForIcon = {
    width: "4vh",
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
                      inputProps={{ style: { fontSize: "18px" } }}
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

                  <section className="confirmation">
                    <div className="btn-confirm-exit">
                      <p className="confirmText">Eingaben bestätigen</p>
                      <Tooltip
                        title="Haushalt erstellen"
                        placement="bottom"
                        arrow
                      >
                        <CheckCircleOutlineRoundedIcon
                          className="confirm-icon"
                          style={styleForIcon}
                          onClick={closePopup}
                        />
                      </Tooltip>
                      <Tooltip title="Abbrechen" placement="bottom" arrow>
                        <HighlightOffRoundedIcon
                          className="exit-icon"
                          style={styleForIcon}
                          onClick={closePopup}
                        />
                      </Tooltip>
                    </div>
                  </section>
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
