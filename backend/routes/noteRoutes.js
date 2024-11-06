const express = require('express');
const Course = require('../models/Course'); // Import Course model

const router = express.Router({ mergeParams: true }); // Merge params for courseId access

// Fetch all notes across all courses
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find({}, 'notes'); // Fetch only notes from each course
    const allNotes = courses.flatMap(course => course.notes); // Flatten notes into a single array
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
    note.question = question || note.question;
    note.answer = answer || note.answer;
    note.mainTargetCategory = mainTargetCategory || note.mainTargetCategory;
    note.mainTargetGoal = mainTargetGoal || note.mainTargetGoal;
    note.subTargetGoal = subTargetGoal || note.subTargetGoal;

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

// Delete a note by its ID from a specific course
router.delete('/byNoteId/:courseId/:noteId', async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    // Find the course that contains the note
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Use $pull to remove the note from the course's notes array
    const result = await Course.updateOne(
      { _id: courseId },
      { $pull: { notes: { _id: noteId } } }
    );

    // Check if the note was found and removed
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully from the course' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note from course', error: error.message });
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

// New route: Fetch a specific note by its noteId (directly under /notes/noteId)
router.get('/note/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;

    // Iterate through courses to find the note by noteId
    const courses = await Course.find({ 'notes._id': noteId }, 'notes');
    const note = courses.flatMap(course => course.notes).find(n => n._id.toString() === noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note retrieved successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note by ID', error: error.message });
  }
});

module.exports = router;
