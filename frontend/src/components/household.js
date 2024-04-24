import React from "react";
import "./household.css";
import AddHomeOutlinedIcon from "@mui/icons-material/AddHomeOutlined";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import { useState } from "react";
import { Link } from "react-router-dom";

const styleForAdd = {
  width: "6vh",
  height: "auto",
  color: "#065535",
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
            <div className="btn-log-container-admin"></div>
            <div className="wrapper-household-box">
              <Link onClick={openPopup}>
                <div className="household-box">
                  <AddHomeOutlinedIcon style={styleForAdd} />
                </div>
              </Link>
              {isPopupOpen && (
                <div className="popup open-popup">
                  <form action="Haushalt" className="form-container">
                    <h1>Neuer Haushalt</h1>
                    <label type="text">
                      <b>Haushaltsname</b>
                    </label>
                    <input
                      type="text"
                      placeholder="Haushaltsname bestimmen"
                      name="email"
                      required
                    />
                    <label>
                      <b>Bewohner einladen</b>
                    </label>{" "}
                    <textarea
                      type="email"
                      placeholder="Bewohner-E-Mail hinzufügen"
                      name="psw"
                      required
                    />
                    <button className="btn-log-admin">
                      Haushalt erstellen
                    </button>
                    <button
                      type="button"
                      className="btn-log-admin-cancel"
                      onClick={closePopup}
                    >
                      <HighlightOffRoundedIcon className="exit-icon" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Household;
