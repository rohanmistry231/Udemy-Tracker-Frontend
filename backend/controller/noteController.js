const Course = require('../models/Course');

// Add a note to a course
const addNote = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal } = req.body;

    if (!question || !answer || !mainTargetCategory || !mainTargetGoal) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const newNote = { question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal };
    course.notes.push(newNote);
    await course.save();

    res.status(201).json({ message: 'Note added successfully', note: course.notes.slice(-1)[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error adding note', error: error.message });
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
};

// Delete a note from a specific course
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

    note.remove();
    await course.save();

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};

// Delete a note across all courses by noteId
const deleteNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    const courses = await Course.updateMany(
      { "notes._id": noteId },
      { $pull: { notes: { _id: noteId } } }
    );

    if (!courses.nModified) {
      return res.status(404).json({ message: 'Note not found in any course' });
    }

    res.status(200).json({ message: 'Note deleted successfully from all courses' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error: error.message });
  }
};

// Get all notes across all courses
const getAllNotes = async (req, res) => {
  try {
    const courses = await Course.find({}, 'notes'); // Fetch only the notes field
    const allNotes = courses.flatMap(course => course.notes); // Flatten notes into a single array
    res.json({ message: 'All notes retrieved successfully', notes: allNotes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all notes', error: error.message });
  }
};

// Get a specific note by noteId within a course
const getNoteById = async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    const course = await Course.findById(courseId).select('notes');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const note = course.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note retrieved successfully', note });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching note', error: error.message });
  }
};

module.exports = {
  addNote,
  updateNote,
  deleteNote,
  deleteNoteById,
  getAllNotes,
  getNoteById
};
