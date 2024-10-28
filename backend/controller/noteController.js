const Course = require('../models/Course');

// Add a note to a course
const addNote = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.notes.push(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a note
const updateNote = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const note = course.notes.id(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.question = req.body.question;
    note.answer = req.body.answer;
    await course.save();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.notes.id(req.params.noteId).remove();
    await course.save();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNote,
  updateNote,
  deleteNote
};
