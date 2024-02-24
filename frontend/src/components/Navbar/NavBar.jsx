import React from "react";
import AppBar from "@mui/material/AppBar";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import "./NavBar.styles.css";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <AppBar
      position="static"
      color="info"
    >
      <Toolbar className="navbar-title">
        <Link
          to="/"
          className="navbar-link"
        >
          <Typography
            variant="h6"
            className="navbar-mainText"
          >
            PV-<div className="navbar-text">React-Project-Visualization</div>
          </Typography>
        </Link>
        <Link
          to="/about-us"
          className="navbar-link"
        >
          <Typography className="navbar-text">About-Us</Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
