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

router.get("/projects/:projectId/tree", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await TreeProject.findById(projectId);
    res.json(project);
  } catch (error) {
    console.error("Error fetching project tree data:", error);
    res.status(500).send({ message: "Failed to fetch project tree data" });
  }
});

router.delete("/projects/:projectId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    await TreeProject.findByIdAndDelete(projectId);
    res.status(200).send({ message: "Project successfully deleted" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).send({ message: "Failed to delete project" });
  }
});

module.exports = router;
