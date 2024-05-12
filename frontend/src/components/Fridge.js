import React, { Component } from "react";
// import { Link as RouterLink } from "react-router-dom";
import { Paper, Typography, Tooltip } from "@mui/material";
import { Tab } from "@mui/material";
import { Box } from "@mui/material";
import { Link } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

class Fridge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "1",
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event, newValue) {
    this.setState({
      value: newValue,
    });
  }

  render() {
    const { value } = this.state;

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
            <Typography
              variant="h5"
              fontSize={"27px"}
              fontWeight={700}
              padding={2}
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                width: "1100px",
                /* border: "3px solid brown", */
              }}
            >
              gespeicherter Haushaltsname!
            </Typography>

            <Box sx={{ width: "1100px" }}>
              <TabContext value={value} sx={{ width: "1100px" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList
                    onChange={this.handleTabChange}
                    aria-label="simple tabs example"
                    centered
                  >
                    <Tab label="Lebensmittel" value="1" />
                    <Tab label="Rezept" value="2" />
                  </TabList>
                </Box>
                <TabPanel value="1">
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
                </TabPanel>
                <TabPanel value="2">
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
                </TabPanel>
              </TabContext>
            </Box>
          </Paper>
        </Box>
      </>
    );
  }
}

export default Fridge;
