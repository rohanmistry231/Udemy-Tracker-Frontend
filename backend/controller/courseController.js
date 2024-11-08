// Import the Course model
const Course = require('../models/Course');

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
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sync data from frontend (local storage) to MongoDB
const syncData = async (req, res) => {
  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ success: false, message: 'Invalid data format' });
  }

  try {
    for (const course of data) {
      // Check if the course already exists by a unique identifier (e.g., name or ID)
      const existingCourse = await Course.findOne({ name: course.name });

      if (existingCourse) {
        // Update the existing course if found
        await Course.findByIdAndUpdate(existingCourse._id, course, { new: true });
      } else {
        // Create a new course if not found
        const newCourse = new Course(course);
        await newCourse.save();
      }
    }

    res.status(200).json({ success: true, message: 'Data synced successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  syncData, // Export syncData function
};
