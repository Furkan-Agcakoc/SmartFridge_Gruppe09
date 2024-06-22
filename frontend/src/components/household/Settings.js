import React, { Component } from "react";
import SmartFridgeAPI from "../../api/SmartFridgeAPI";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groceries: [],
      measures: [],
    };
  }

  componentDidMount() {
    SmartFridgeAPI.api
      .getGrocery()
      .then((groceryBOs) => {
        this.setState({ groceries: groceryBOs });
      })
      .catch((error) => {
        console.error("Error fetching groceries:", error);
        // this.setState({  });
      });
    SmartFridgeAPI.api
      .getMeasure()
      .then((measureBOs) => {
        this.setState({ measures: measureBOs });
      })
      .catch((error) => {
        console.error("Error fetching groceries:", error);
        // this.setState({  });
      });
  }

  render() {
    const { groceries, measures } = this.state;

    return (
      <>
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            mt: 2,
          }}
        >
          <Paper>
            <Typography variant="h5" sx={{ p: 2, fontWeight: "bold" }}>
              Haushalt verwalten
            </Typography>
            <Accordion sx={{ minWidth: "850px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Lebensmittel bearbeiten
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {groceries.map((grocery) => (
                    <ListItem key={grocery.id}>
                      <ListItemText primary={grocery.grocery_name} />
                      <Container sx={{ gap: "10px" }}>
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>{" "}
                      </Container>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ minWidth: "850px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  Einheit bearbeiten
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {measures.map((measure) => (
                    <ListItem key={measure.id}>
                      <ListItemText primary={measure.unit} />
                      <Container sx={{ display: "flex", gap: "10px" }}>
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit">
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </Container>
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Container>
      </>
    );
  }
}

export default Settings;
