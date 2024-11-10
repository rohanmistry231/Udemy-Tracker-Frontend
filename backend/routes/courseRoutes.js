const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  syncCourses,
} = require("../controller/courseController");
const noteRoutes = require("./noteRoutes"); // Import note routes

const router = express.Router();

// Main course routes
router.post("/sync", syncCourses);
router.post("/", createCourse); // Create a course
router.get("/", getCourses); // Get all courses
router.get("/:id", getCourseById); // Get a single course by ID
router.put("/:id", updateCourse); // Update a course by ID
router.delete("/:id", deleteCourse); // Delete a course by ID

// Mount the notes routes under the course's notes path
router.use("/:courseId/notes", noteRoutes); // Handles all /courses/:courseId/notes operations

module.exports = router;
