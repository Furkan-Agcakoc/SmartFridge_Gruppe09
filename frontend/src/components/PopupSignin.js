import React, { Component } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";

class PopupSignin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opensigininpopup: false,
    };
  }
  render() {
    const { opensigininpopup } = this.state;

    const showPopup = opensigininpopup && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 2,
        }}
      >
        <Paper
          sx={{
            width: "400px",
            height: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Please sign in to continue
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.props.onSignIn}
          >
            Sign in
          </Button>
        </Paper>
      </Box>
    );

    return <>{showPopup}</>;
  }
}

export default PopupSignin;
