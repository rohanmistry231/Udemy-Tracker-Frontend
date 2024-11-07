// src/pages/ViewNote.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

const ViewNote = () => {
  const { id } = useParams();  // Note ID for fetching specific note details
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/notes/note/${id}`);
        if (!response.ok) throw new Error("Failed to fetch note details");
        
        const data = await response.json();
        setNote(data.note); // Access the 'note' object within the response data
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error fetching note details");
      }
    };
    fetchNote();
  }, [id]);

  if (!note) {
    return <p className="text-center mt-4">Loading note details...</p>;
  }

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
    >
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <h2 className="text-3xl font-bold mb-4">Note Details</h2>
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Question:</h3>
          <p className="mt-2">{note.question}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold text-lg">Answer:</h3>
          <p className="mt-2">{note.answer}</p>
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

        <div className="flex items-center justify-between mt-6">
          <Link to={`/notes/${id}/edit`} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Edit Note
          </Link>
          <Link to="/notes" className="text-gray-600 hover:underline">
            Back to Notes
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewNote;
