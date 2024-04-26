import React from "react";
import "./loginbox.css";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../images/Fridge_Logo.png";

const Loginbox = () => {
  const { user, logOut } = UserAuth();
  const { googleSignIn } = UserAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigate("/households");
    }
  }, [user, navigate]);
  return (
    <>
      <div className="wrapper">
        <div className="login-box">
          <div className="login">
            <h2 className="caveat-logfont">Anmeldung bei Smart Fridge!</h2>
            <img src={Logo} className="fridge" alt="fridge" />
            <div className="btn-log-container">
              {user?.displayName ? (
                <button onClick={handleSignOut} className="btn-log">
                  Logout
                </button>
              ) : (
                <Link>
                  <button className="btn-log" onClick={handleGoogleSignIn}>
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loginbox;
