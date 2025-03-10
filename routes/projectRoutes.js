const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Add a new project
router.post("/", async (req, res) => {
  try {
    const { title, description, link, image } = req.body;
    const newProject = await Project.create({ title, description, link, image });
    res.json(newProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to add project" });
  }
});

module.exports = router;
