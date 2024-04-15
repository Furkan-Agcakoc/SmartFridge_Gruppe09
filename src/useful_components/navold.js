import React from "react";
import "./navbar.css";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LoginIcon from "@mui/icons-material/Login";
import { NavLink } from "react-router-dom";

const navbar = () => {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div>
            <KitchenIcon></KitchenIcon>
          </div>
          <ul className="nav-menu">
            <li className="nav-item">
              <a href="/" className="nav-links">
                Home
              </a>
            </li>
            <li className="nav-item">
              <NavLink to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact">Contact</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/login">Login</NavLink>
            </li>
          </ul>
          <div>
            <LoginIcon></LoginIcon>
          </div>
        </div>
      </nav>
    </>
  );
};

export default navbar;
