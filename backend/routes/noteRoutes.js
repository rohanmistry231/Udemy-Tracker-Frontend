// routes/noteRoutes.js
const express = require('express');
const { addNote, updateNote, deleteNote } = require('../controller/noteController');
const Course = require('../models/Course'); // Import Course model

const router = express.Router({ mergeParams: true });

// Route to get notes for a specific course
router.get('/', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).select('notes');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course.notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Existing routes
router.post('/', addNote);
router.put('/:noteId', updateNote);
router.delete('/:noteId', deleteNote);

module.exports = router;
