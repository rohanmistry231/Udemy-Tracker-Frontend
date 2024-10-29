const express = require('express');
const Course = require('../models/Course'); // Import Course model

const router = express.Router({ mergeParams: true }); // Merge params for courseId access

// Add a new note to a course
router.post('/', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { question, answer } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.notes.push({ question, answer });
    await course.save();
    res.status(201).json({ message: 'Note added successfully', note: course.notes.slice(-1)[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
});

// Delete a specific note from a course
router.delete('/:noteId', async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Filter out the note to delete it
    course.notes = course.notes.filter(note => note._id.toString() !== noteId);
    await course.save();

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
});

// Get all notes for a specific course
router.get('/', async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).select('notes');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course.notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

module.exports = router;
