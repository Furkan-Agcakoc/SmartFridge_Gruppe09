import React, { Component } from "react";
import FontLogin from "../FontLogin";
import Logo from "../../images/Fridge_Logo.png";
import "../LogBox.css";

class LoginPage extends Component {
  render() {
    const { onSignIn } = this.props;

    return (
      <>
        <FontLogin />
        <div className="wrapper">
          <div className="login-box">
            <div className="login">
              <h2 className="caveat-logfont">Anmeldung bei Smart Fridge!</h2>
              <img src={Logo} className="fridge-img" alt="fridge" />
              <div className="btn-log-container">
                <button className="btn-log" onClick={onSignIn}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoginPage;
