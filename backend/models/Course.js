const mongoose = require("mongoose");

// Define Note Schema (for individual questions and answers)
const noteSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  mainTargetCategory: { type: String, required: true }, // Main Target Goals Category (e.g., "Programming Language")
  mainTargetGoal: { type: String, required: true }, // Target Goal (e.g., "Python")
  subTargetGoal: { type: String }, // Sub Target Goal (e.g., "Data Types")
  createdAt: { type: Date, default: Date.now },
});

// Define Course Schema
const courseSchema = new mongoose.Schema({
  no: { type: Number, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryPriority: {
    type: String,
    enum: [
      "High priority",
      "Medium priority",
      "Low priority",
      "Parallel Priority",
    ],
    default: "Medium priority",
  },
  subCategory: { type: String },
  subSubCategory: { type: String },
  importantStatus: {
    type: String,
    enum: ["Important", "Very Important", "Extra", "Not Important"],
    default: "Important",
  },
  status: {
    type: String,
    enum: ["Not Started Yet", "In Progress", "Completed"],
    default: "Not Started Yet",
  },
  durationInHours: { type: Number, required: true },
  subLearningSkillsSet: { type: [String] },
  learningSkillsSet: { type: String },
  notes: [noteSchema], // Embed notes as an array
  dateAdded: { type: Date, default: Date.now },
});

// Export Course Model
const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
