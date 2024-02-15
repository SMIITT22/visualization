import React from "react";
import AppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import "./NavBar.styles.css";

const NavBar = () => {
  return (
    <AppBar
      position="static"
      color="info"
    >
      <Toolbar>
        <Typography
          variant="h6"
          className="navbar-title"
        >
          Visualization
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
