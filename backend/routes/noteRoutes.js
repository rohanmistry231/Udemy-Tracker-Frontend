const express = require('express');
const {
  addNote,
  updateNote,
  deleteNote,
  deleteNoteById,  // Direct deletion by noteId
  getAllNotes,     // Fetch all notes across courses
  getNoteById      // Fetch a specific note by noteId or all notes for a course
} = require('../controller/noteController');  // Import note controller functions

const router = express.Router({ mergeParams: true }); // Merge params to access courseId

// Route to get all notes across all courses
router.get('/all', getAllNotes);

// Add a new note to a specific course
router.post('/', addNote);

// Get all notes for a course or a specific note by ID
router.get('/:noteId?', getNoteById);

// Update a note in a specific course
router.put('/:noteId', updateNote);

// Delete a specific note from a course by courseId and noteId
router.delete('/:courseId/:noteId', deleteNote);

// Delete a note across all courses by its noteId
router.delete('/byNoteId/:noteId', deleteNoteById);

module.exports = router;
