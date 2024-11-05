// src/routes/notes.js
const express = require('express');
const Course = require('../models/Course'); // Import Course model

const router = express.Router({ mergeParams: true }); // Merge params for courseId access

// Fetch all notes across all courses
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find({}).select('notes -_id'); // Fetch only the notes field without _id
    const allNotes = courses.reduce((acc, course) => acc.concat(course.notes), []); // Merge all notes into one array
    res.json({ message: 'All notes retrieved successfully', notes: allNotes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all notes', error: error.message });
  }
});


// Add a new note to a specific course
router.post('/', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create and add a new note
    const newNote = { question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal };
    course.notes.push(newNote);
    await course.save();

    res.status(201).json({ message: 'Note added successfully', note: course.notes.slice(-1)[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
  }
});

// Update an existing note in a specific course
router.put('/:noteId', async (req, res) => {
  try {
    const { courseId, noteId } = req.params;
    const { question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const note = course.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Update note fields
    note.question = question;
    note.answer = answer;
    note.mainTargetCategory = mainTargetCategory;
    note.mainTargetGoal = mainTargetGoal;
    note.subTargetGoal = subTargetGoal;

    await course.save();
    res.json({ message: 'Note updated successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error: error.message });
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

// Get all notes for a specific course or a specific note by ID
router.get('/:noteId?', async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    const course = await Course.findById(courseId).select('notes');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If noteId is provided, retrieve that specific note
    if (noteId) {
      const note = course.notes.id(noteId);
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
      return res.json({ message: 'Note retrieved successfully', note });
    }

    // If no noteId, return all notes for the course
    res.json({ message: 'Notes retrieved successfully', notes: course.notes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error: error.message });
  }
});

module.exports = router;
