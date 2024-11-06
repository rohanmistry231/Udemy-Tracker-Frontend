const express = require('express');
const {
  addNote,
  updateNote,
  deleteNote,
  deleteNoteById,
  getAllNotes,
  getNoteById
} = require('../controllers/noteController');

const router = express.Router({ mergeParams: true });

// Fetch all notes across all courses
router.get('/all', getAllNotes);

// Add a new note to a specific course
router.post('/', addNote);

// Get a specific note by ID or all notes for a course
router.get('/:noteId?', getNoteById);

// Update a note in a specific course
router.put('/:noteId', updateNote);

// Delete a specific note from a course by courseId and noteId
router.delete('/:noteId', deleteNote);

// Delete a note across all courses by its noteId
router.delete('/byNoteId/:noteId', deleteNoteById);

module.exports = router;
