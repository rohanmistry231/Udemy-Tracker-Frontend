const express = require("express");
const Course = require("../models/Course"); // Import Course model

const router = express.Router({ mergeParams: true }); // Merge params for courseId access

// Fetch all notes across all courses
router.get("/all", async (req, res) => {
  try {
    const courses = await Course.find({}, "notes"); // Fetch only notes from each course
    const allNotes = courses.flatMap((course) => course.notes); // Flatten notes into a single array
    res.json({ message: "All notes retrieved successfully", notes: allNotes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching all notes", error: error.message });
  }
});

// Add a new note to a specific course
router.post("/", async (req, res) => {
  try {
    const { courseId } = req.params;
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

    // Create and add a new note
    const newNote = {
      question,
      answer,
      mainTargetCategory,
      mainTargetGoal,
      subTargetGoal,
    };
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
});

// Update an existing note in a specific course
router.put("/:noteId", async (req, res) => {
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
});

// Delete a specific note from a course
router.delete("/:noteId", async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Filter out the note to delete it
    course.notes = course.notes.filter(
      (note) => note._id.toString() !== noteId
    );
    await course.save();

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
});

// Delete a note by its ID from a specific course
router.delete("/byNoteId/:courseId/:noteId", async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    // Find the course that contains the note
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Use $pull to remove the note from the course's notes array
    const result = await Course.updateOne(
      { _id: courseId },
      { $pull: { notes: { _id: noteId } } }
    );

    // Check if the note was found and removed
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res
      .status(200)
      .json({ message: "Note deleted successfully from the course" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting note from course",
      error: error.message,
    });
  }
});

// Delete a note by its ID (without requiring courseId)
router.delete("/deleteByNoteId/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the course that contains the note and remove it
    const result = await Course.updateOne(
      { "notes._id": noteId },
      { $pull: { notes: { _id: noteId } } }
    );

    // Check if the note was found and removed
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting note", error: error.message });
  }
});

// Get all notes for a specific course or a specific note by ID
router.get("/:noteId?", async (req, res) => {
  try {
    const { courseId, noteId } = req.params;

    const course = await Course.findById(courseId).select("notes");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // If noteId is provided, retrieve that specific note
    if (noteId) {
      const note = course.notes.id(noteId);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      return res.json({ message: "Note retrieved successfully", note });
    }

    // If no noteId, return all notes for the course
    res.json({ message: "Notes retrieved successfully", notes: course.notes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching notes", error: error.message });
  }
});

// Update a note by its ID (using a more focused route)
router.put("/update/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;
    const {
      question,
      answer,
      mainTargetCategory,
      mainTargetGoal,
      subTargetGoal,
    } = req.body;

    // Find the course that contains the note using the noteId
    const course = await Course.findOne({ "notes._id": noteId });
    if (!course) {
      return res.status(404).json({ message: "Course or note not found" });
    }

    // Find the specific note by its ID inside the course's notes array
    const note = course.notes.id(noteId);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Update the note fields
    note.question = question || note.question;
    note.answer = answer || note.answer;
    note.mainTargetCategory = mainTargetCategory || note.mainTargetCategory;
    note.mainTargetGoal = mainTargetGoal || note.mainTargetGoal;
    note.subTargetGoal = subTargetGoal || note.subTargetGoal;

    // Save the course with the updated note
    await course.save();

    // Respond with the updated note data
    res.json({
      message: "Note updated successfully",
      note: {
        _id: note._id,
        question: note.question,
        answer: note.answer,
        mainTargetCategory: note.mainTargetCategory,
        mainTargetGoal: note.mainTargetGoal,
        subTargetGoal: note.subTargetGoal,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating note by ID", error: error.message });
  }
});

// Find a note by its ID (without requiring courseId)
router.get("/note/:noteId", async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the course that contains the note using the noteId
    const course = await Course.findOne(
      { "notes._id": noteId },
      { "notes.$": 1 }
    ); // Select only the specific note with $ projection
    if (!course || course.notes.length === 0) {
      return res.status(404).json({ message: "Note not found" });
    }

    // Extract the note from the course's notes array
    const note = course.notes[0];
    res.json({
      message: "Note retrieved successfully",
      note: {
        _id: note._id,
        question: note.question,
        answer: note.answer,
        mainTargetCategory: note.mainTargetCategory,
        mainTargetGoal: note.mainTargetGoal,
        subTargetGoal: note.subTargetGoal,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching note by ID", error: error.message });
  }
});

// Delete all notes from a specific course
router.delete("/deleteAllNotes/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    // Find the course by ID and set the notes array to an empty array
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Clear the notes array
    course.notes = [];
    await course.save();

    res
      .status(200)
      .json({ message: "All notes deleted successfully from the course" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting all notes from course",
      error: error.message,
    });
  }
});

module.exports = router;
