import React from "react";
import "./AboutUs.styles.css";

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-us-title">
        <h1>About PV</h1>
      </div>
      <div className="about-us-text">
        <p>
          We are working on RPV which is React - Project Visualization is an
          innovative application designed to enhance the development experience
          for React developers. This tool allows users to upload their project's
          source code, specifically focusing on React.js projects, to analyze
          and visualize the hierarchical structure of components within the
          application. By generating a tree-like diagram, RPV provides clear
          insights into the parent-child relationships among components, making
          it easier to understand the project's architecture at a glance.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
