const express = require('express');
const {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
} = require('../controller/ProjectController');

const router = express.Router();

// Route to fetch all projects
router.get('/', getAllProjects);

// Route to add a new project
router.post('/', addProject);

// Route to update an existing project by ID
router.put('/:id', updateProject);

// Route to delete a project by ID
router.delete('/:id', deleteProject);

module.exports = router;
