// src/pages/ViewNote.js
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";
import jsPDF from "jspdf"; // Import jsPDF
import { fetchNoteById } from '../dataService';

const ViewNote = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Note ID for fetching specific note details
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [note, setNote] = useState(null);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const data = await fetchNoteById(id);  // Call the service function
        setNote(data.note); // Set the note details from the response
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error fetching note details");
      }
    };

    fetchNoteDetails();  // Fetch the note details when the component mounts or id changes
  }, [id]);

  const saveAsPDF = () => {
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("Note Details", 10, 10);

    pdf.setFontSize(12);
    pdf.text(`Question: ${note.question}`, 10, 20);
    pdf.text(`Answer: ${note.answer}`, 10, 30);
    pdf.text(`Main Target Category: ${note.mainTargetCategory}`, 10, 40);
    pdf.text(`Main Target Goal: ${note.mainTargetGoal}`, 10, 50);
    pdf.text(`Sub Target Goal: ${note.subTargetGoal}`, 10, 60);

    pdf.save(`note_${id}.pdf`);
  };

  if (!note) {
    return <p className="text-center mt-4">Loading note details...</p>;
  }

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div
        className={`shadow-md rounded-lg p-6 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
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
          <Link
            to={`/notes/${id}/edit`}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Edit Note
          </Link>
          <button onClick={()=> navigate(-1)} to="/notes" className="text-gray-600 hover:underline">
            Back to Notes
          </button>
          <button
            onClick={saveAsPDF}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Save as PDF
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewNote;
