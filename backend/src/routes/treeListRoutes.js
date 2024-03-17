const express = require("express");
const router = express.Router();
const TreeProject = require("../models/TreeModel");

router.get("/projects", async (req, res) => {
  try {
    const projects = await TreeProject.find({});
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send({ message: "Failed to fetch projects" });
  }
});

module.exports = router;
