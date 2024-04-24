import React from "react";
import "./admin.css";

const Admin = () => {
  return (
    <>
      <div className="wrapper-admin">
        <div className="login-box-admin">
          <div className="login-admin">
            <h2 className="caveat-logfont-admin">
              Dein Haushalt, deine Regeln! Erstelle einen individuellen Raum für
              deine Lebensmittel !
            </h2>
            <div className="btn-log-container-admin">
              <button className="btn-log-admin">Haushalt erstellen</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
