import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import theme context
import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

const ViewNote = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const { noteId } = useParams(); // Retrieve noteId from the URL
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchNote = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/notes/${noteId}`);
        const data = await response.json();
        if (data.note) {
          setNote(data.note);
        } else {
          toast.error("Note not found.");
          navigate("/notes"); // Redirect to Notes list page if note doesn't exist
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error loading note. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className={`container mx-auto px-4 py-6 mt-12 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <h2 className={`text-3xl font-semibold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        View Note 📝
      </h2>

      <div className={`max-w-3xl mx-auto p-6 rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <h3 className="font-bold text-xl">{note.question}</h3>
        <p className="text-lg mt-4">{note.answer}</p>
        <div className="mt-6">
          <p><strong>Main Goal:</strong> {note.mainTargetCategory}</p>
          <p><strong>Target Goal:</strong> {note.mainTargetGoal}</p>
          <p><strong>Sub Goal:</strong> {note.subTargetGoal}</p>
        </div>
        
        {/* Add an Edit button if needed */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => navigate(`/notes/${note._id}/edit`)}
            className={`p-2 rounded ${isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-500 hover:bg-blue-600"} text-white`}
          >
            Edit Note
          </button>
          <button
            onClick={() => navigate("/notes")}
            className={`p-2 rounded ${isDarkMode ? "bg-gray-700 hover:bg-gray-800" : "bg-gray-300 hover:bg-gray-400"}`}
          >
            Back to Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNote;
