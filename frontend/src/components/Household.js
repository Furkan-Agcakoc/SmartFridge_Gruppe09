import React from "react";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import Tooltip from "@mui/material/Tooltip";
import "./Household.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const styleForAdd = {
  width: "6vh",
  height: "auto",
};

const styleForIcon = {
  width: "4vh",
  height: "auto",
};

const Household = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);

  function openPopup() {
    setPopupOpen(true);
  }

  function closePopup() {
    setPopupOpen(false);
  }

  return (
    <>
      <div className="wrapper-admin">
        <div className="login-box-admin">
          <div className="login-admin">
            <h2 className="caveat-logfont-admin">
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
            </div>

            {isPopupOpen && (
              <div className="open-popup">
                <form action="Haushalt" className="form-container">
                  <h1>Neuer Haushalt</h1>
                  <div className="text-container">
                    <label type="text">
                      <b>Haushaltsname</b>
                    </label>
                    <input
                      type="text"
                      placeholder="Haushaltsname bestimmen"
                      name="text"
                      required
                    />
                    <label>
                      <b>Bewohner einladen</b>
                    </label>{" "}
                    <textarea
                      type="email"
                      placeholder="Bewohner-E-Mail hinzufügen"
                      name="email"
                      required
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Household;
