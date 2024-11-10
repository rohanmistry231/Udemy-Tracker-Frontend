const Course = require("../models/Course");

// Create a new course
const createCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sync courses from localStorage
const syncCourses = async (req, res) => {
  try {
    const coursesData = req.body.courses; // Array of courses from the client

    // Loop through each course data to either create or update in the database
    for (const courseData of coursesData) {
      const { no, ...rest } = courseData;

      // Check if the course already exists based on the unique 'no' field
      const existingCourse = await Course.findOne({ no });

      if (existingCourse) {
        // If course exists, update it with the new data
        await Course.updateOne({ no }, { $set: rest });
      } else {
        // If course doesn't exist, create a new course
        await new Course(courseData).save();
      }
    }

    res.status(200).json({ message: "Courses synced successfully" });
  } catch (error) {
    console.error("Error syncing courses:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  syncCourses, // Export the syncCourses function
};
