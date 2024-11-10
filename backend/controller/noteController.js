// controllers/noteController.js
const Course = require("../models/Course");

// Add a note to a course
const addNote = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      question,
      answer,
      mainTargetCategory,
      mainTargetGoal,
      subTargetGoal,
    } = req.body;

    // Validate required fields
    if (!question || !answer || !mainTargetCategory || !mainTargetGoal) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create a new note object
    const newNote = {
      question,
      answer,
      mainTargetCategory,
      mainTargetGoal,
      subTargetGoal,
    };

    // Add the new note to the notes array
    course.notes.push(newNote);
    await course.save();

    res.status(201).json({
      message: "Note added successfully",
      note: course.notes.slice(-1)[0],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding note", error: error.message });
  }
};

// Update a note in a course
const updateNote = async (req, res) => {
  try {
    const { courseId, noteId } = req.params;
    const {
      question,
      answer,
      mainTargetCategory,
      mainTargetGoal,
      subTargetGoal,
    } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const note = course.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update note fields
    note.question = question || note.question;
    note.answer = answer || note.answer;
    note.mainTargetCategory = mainTargetCategory || note.mainTargetCategory;
    note.mainTargetGoal = mainTargetGoal || note.mainTargetGoal;
    note.subTargetGoal = subTargetGoal || note.subTargetGoal;

    await course.save();

    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating note", error: error.message });
  }
};

// Delete a note from a course
const deleteNote = async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const note = course.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Remove the note using Mongoose's remove method
    note.remove();
    await course.save();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
};

module.exports = {
  addNote,
  updateNote,
  deleteNote,
};
