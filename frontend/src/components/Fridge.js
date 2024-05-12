import React, { Component } from "react";
import "./Fridge.css";
import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Tooltip } from "@mui/material";
import { Tabs, Tab } from "@mui/material";
import { Box } from "@mui/material";
import { Link } from "@mui/material";

class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabindex: 0,
    };
  }

  handleTabChange(e, newIndex) {
    this.setState({
      tabindex: newIndex,
    });
  }

  render() {
    const { tabindex } = this.state;

    return (
      <>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            position: "relative",
            top: "200px",
          }}
        >
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
              border: "none",
              /* borderRadius: "30px", */
              /* boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)", */
              width: "1100px",
              height: "auto",
              padding: "0px 50px 30px 50px",
              /* border: "5px red solid", */
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "1100px",
                /* border: "3px solid brown", */
              }}
            >
              <Typography
                variant="h5"
                fontFamily="Segoe UI"
                fontSize={"27px"}
                fontWeight={700}
                padding={2}
              >
                gespeicherter Haushaltsname!
              </Typography>
            </Box>

            <Box sx={{ width: "1100px" }}>
              <Tabs
                value={tabindex}
                onChange={this.handleTabChange}
                sx={{
                  bgcolor: "background.default",
                  borderRadius: 10 + "px",
                  boxShadow: 1,
                }}
                centered
              >
                <Tab
                  label="Lebensmittel"
                  component={RouterLink}
                  to={"/lebensmittel"}
                />
                <Tab label="Rezepte" component={RouterLink} to={"/rezepte"} />
              </Tabs>
            </Box>

            <Box
              sx={{
                display: "flex",
                width: "1100px",
                justifyContent: "flex-start",
                border: "5px teal solid",
              }}
            >
              <Link>
                <Tooltip
                  title="Neues Lebensmittel hinzufügen"
                  placement="bottom"
                  arrow
                >
                  <Box
                    sx={{
                      width: "200px",
                      height: "125px",
                      borderRadius: "10px",
                      boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                      backgroundColor: "lightblue",
                      color: "#f2f2f2",
                      border: "3px solid brown",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  ></Box>
                </Tooltip>
              </Link>
              <Link>
                <Tooltip
                  title="Neues Rezept hinzufügen"
                  placement="bottom"
                  arrow
                >
                  <Box
                    sx={{
                      width: "200px",
                      height: "125px",
                      borderRadius: "10px",
                      boxShadow: "3px 3px 6px 2px rgba(0, 0, 0, 0.25)",
                      backgroundColor: "lightcoral",
                      color: "#f2f2f2",
                      border: "3px solid brown",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  ></Box>
                </Tooltip>
              </Link>
            </Box>
          </Paper>
        </Box>
      </>
    );
  }
}

export default Fridge;
