const Course = require('../models/Course');

// Add a note to a course
const addNote = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Create a new note object
    const newNote = {
      question,
      answer,
      mainTargetCategory,
      mainTargetGoal,
      subTargetGoal
    };

    // Add the new note to the notes array
    course.notes.push(newNote);
    await course.save();

    res.status(201).json({ message: 'Note added successfully', note: newNote });
  } catch (error) {
    res.status(500).json({ error: `Error adding note: ${error.message}` });
  }
};

// Update a note in a course
const updateNote = async (req, res) => {
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
    res.status(500).json({ error: `Error updating note: ${error.message}` });
  }
};

// Delete a note from a course
const deleteNote = async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const note = course.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.remove(); // Remove the note from the notes array
    await course.save();

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: `Error deleting note: ${error.message}` });
  }
};

module.exports = {
  addNote,
  updateNote,
  deleteNote
};
