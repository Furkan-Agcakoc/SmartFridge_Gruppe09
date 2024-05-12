// import React from "react";
import "./Fridge.css";
import { Link } from "react-router-dom";
import { Paper, Tooltip, Typography, Box } from "@mui/material";
import React, { useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Fridge = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="container-fridge-flexbox">
      <Paper className="fridge-flexbox">
        <div className="household-name">
          <Typography
            variant="h5"
            fontFamily="Segoe UI"
            fontSize={"27px"}
            fontWeight={700}
            padding={2}
          >
            gespeicherter Haushaltsname!
          </Typography>
        </div>

        <div style={{ width: 1100 + "px" }} className="grid-fridge-box">
          <Tabs
            value={value}
            onChange={handleChange}
            sx={{
              bgcolor: "background.default",
              borderRadius: 10 + "px",
              boxShadow: 1,
            }}
            centered
          >
            <Tab label="Lebensmittel" {...a11yProps(0)} />
            <Tab label="Rezepte" {...a11yProps(1)} />
          </Tabs>
        </div>

        <div className="wrapper-fridge-box">
          <CustomTabPanel value={value} index={0}>
            <Link>
              <div className="fridge-box">
                <Tooltip
                  title="Neues Lebensmittel hinzufügen"
                  placement="bottom"
                  arrow
                ></Tooltip>
              </div>
            </Link>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Link>
              <div className="recipe-box">
                <Tooltip
                  title="Neues Lebensmittel hinzufügen"
                  placement="bottom"
                  arrow
                ></Tooltip>
              </div>
            </Link>
          </CustomTabPanel>
        </div>
      </Paper>
    </div>
  );
};

export default Fridge;
