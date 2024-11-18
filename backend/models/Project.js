const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tech: {
    type: [String], // Array of technologies used in the project
    required: true,
  },
  link: {
    type: String, // GitHub or repository link
    required: true,
  },
  liveDemo: {
    type: String, // Live demo URL
    required: false,
  },
  category: {
    type: String, // Project category (e.g., Web Development, Data Science)
    required: true,
  },
  subCategory: {
    type: String, // Project subcategory (e.g., React, Node.js)
    required: false,
  },
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
