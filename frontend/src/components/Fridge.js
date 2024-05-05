import React from "react";
import "./Fridge.css";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const Fridge = () => {
  const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <div className="container-fridge-flexbox">
        <div className="fridge-flexbox">
          <h2 className="logfont-fridge">gespeicherter Haushaltsname !</h2>

          <div className="grid-fridge-box">
            <Tabs
              value={value}
              onChange={handleChange}
              style={{ textColor: "red" }}
            >
              <Tab
                value="one"
                style={{ color: "#13a88a" }}
                label="Lebensmittel"
              />
              <Tab value="two" label="Rezepte" />
            </Tabs>
          </div>
          <div className="wrapper-fridge-box">
            <Link>
              <div className="fridge-box">
                <Tooltip
                  title="Neues Lebensmittel hinzufügen"
                  placement="bottom"
                  arrow
                ></Tooltip>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fridge;
