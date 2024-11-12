// src/pages/ViewNoteForParticularCourse.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

const ViewCourseNote = () => {
  const correctPassword = "12345";
  const { courseid, id } = useParams();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [note, setNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null); // Track the note being edited
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [mainTargetCategory, setMainTargetCategory] = useState("");
  const [mainTargetGoal, setMainTargetGoal] = useState("");
  const [subTargetGoal, setSubTargetGoal] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);


  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(
          `https://udemy-tracker.vercel.app/notes/note/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch note details");
        }

        const data = await response.json();

        // Set note state
        setNote(data.note);

        // Initialize form values with the fetched note data
        setQuestion(data.note.question || "");
        setAnswer(data.note.answer || "");
        setMainTargetCategory(data.note.mainTargetCategory || "");
        setMainTargetGoal(data.note.mainTargetGoal || "");
        setSubTargetGoal(data.note.subTargetGoal || "");
        const storedPassword = localStorage.getItem("password");
    if (storedPassword === correctPassword) {
      setIsAuthorized(true);
    }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error fetching note details");
      }
    };

    // Fetch note when component is mounted or when 'id' changes
    fetchNote();
  }, [id]);

  // Enable edit mode and pre-fill form with note details
  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setQuestion(note.question);
    setAnswer(note.answer);
    setMainTargetCategory(note.mainTargetCategory);
    setMainTargetGoal(note.mainTargetGoal || ""); // Ensure it’s initialized
    setSubTargetGoal(note.subTargetGoal || ""); // Ensure it’s initialized
  };

  // Update a specific note
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://udemy-tracker.vercel.app/courses/${courseid}/notes/${editingNote}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            answer,
            mainTargetCategory,
            mainTargetGoal,
            subTargetGoal,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update note");
      }
      const updatedNote = await response.json();
      setNote(updatedNote.note); // Update the displayed note details
      toast.success("Note updated successfully");
      setEditingNote(null); // Exit edit mode
      setQuestion("");
      setAnswer("");
      setMainTargetCategory("");
      setMainTargetGoal("");
      setSubTargetGoal("");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note. Please try again later.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "12345";
    if (password === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem("password", password); // Store the password in localStorage
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {!isAuthorized ? (
        <form
          onSubmit={handlePasswordSubmit}
          className={`p-6 rounded shadow-md ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <label htmlFor="password" className="block mb-2">
            🔒 Prove You're Worthy! Enter the Secret Code:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border p-2 rounded w-full ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            Submit
          </button>
        </form>
      ) : (
        <>
      <div
        className={`shadow-md rounded-lg p-6 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h2 className="text-3xl font-bold mb-4">Note Details</h2>

        {editingNote ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="font-semibold">Question:</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                required
              />
            </div>
            <div>
              <label className="font-semibold">Answer:</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                required
              ></textarea>
            </div>
            <div>
              <label className="font-semibold">Main Target Category:</label>
              <input
                type="text"
                value={mainTargetCategory}
                onChange={(e) => setMainTargetCategory(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                required
              />
            </div>
            <div>
              <label className="font-semibold">Main Target Goal:</label>
              <input
                type="text"
                value={mainTargetGoal}
                onChange={(e) => setMainTargetGoal(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <div>
              <label className="font-semibold">Sub Target Goal:</label>
              <input
                type="text"
                value={subTargetGoal}
                onChange={(e) => setSubTargetGoal(e.target.value)}
                className={`w-full p-2 rounded border ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className={`p-2 rounded ${
                  isDarkMode
                    ? "bg-blue-700 hover:bg-blue-800"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingNote(false)}
                className="text-red-500"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Question:</h3>
              <p className="mt-2">{note.question}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Answer:</h3>
              <div dangerouslySetInnerHTML={{ __html: note.answer }} />
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Main Target Category:</h3>
              <p className="mt-2">{note.mainTargetCategory}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Main Target Goal:</h3>
              <p className="mt-2">{note.mainTargetGoal}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold text-lg">Sub Target Goal:</h3>
              <p className="mt-2">{note.subTargetGoal}</p>
            </div>
            <button
              onClick={() => handleEditClick(note)}
              className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4`}
            >
              Edit Note
            </button>
            <Link
              to={`/courses/${courseid}/view`}
              className="text-gray-600 hover:underline ml-4"
            >
              Back to Course
            </Link>
          </>
        )}
      </div>
      </>)}
      <ToastContainer />
    </div>
  );
};

export default ViewCourseNote;
