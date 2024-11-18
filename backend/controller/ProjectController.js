const Project = require('../models/Project');

// Fetch all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};

// Add a new project
const addProject = async (req, res) => {
  const { title, description, tech, link, liveDemo, category, subCategory } = req.body;

  // Validate required fields
  if (!title || !description || !tech || !link || !category) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    const newProject = new Project({
      title,
      description,
      tech,
      link,
      liveDemo,
      category,
      subCategory,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(500).json({ message: "Error adding project", error });
  }
};

// Update an existing project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description, tech, link, liveDemo, category, subCategory } = req.body;

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, tech, link, liveDemo, category, subCategory },
      { new: true } // Return the updated document
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: "Error updating project", error });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};

module.exports = {
  getAllProjects,
  addProject,
  updateProject,
  deleteProject,
};
