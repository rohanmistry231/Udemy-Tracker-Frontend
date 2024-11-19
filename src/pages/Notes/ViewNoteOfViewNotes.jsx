// src/pages/ViewNote.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/ThemeContext";
import jsPDF from "jspdf"; // Import jsPDF
import { fetchNoteById } from "../../dataService";

const ViewNoteOfViewNotes = () => {
  const correctPassword = "12345";
  const { courseid, id } = useParams(); // Note ID for fetching specific note details
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [note, setNote] = useState(null);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const data = await fetchNoteById(id); // Call the service function to fetch the note
        setNote(data.note); // Update state with the fetched note
        const storedPassword = localStorage.getItem("password");
    if (storedPassword === correctPassword) {
      setIsAuthorized(true);
    }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error fetching note details");
      }
    };

    if (id) {
      fetchNoteDetails(); // Fetch the note details when the component mounts or id changes
    }
  }, [id]);

  const saveAsPDF = () => {
    // Function to strip HTML tags
  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Decode the answer content
  const cleanAnswer = stripHtml(note.answer);
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("Note Details", 10, 10);

    pdf.setFontSize(12);
    pdf.text(`Question: ${note.question}`, 10, 20);
    pdf.text(`Answer: ${cleanAnswer}`, 10, 30);
    pdf.text(`Main Target Category: ${note.mainTargetCategory}`, 10, 40);
    pdf.text(`Main Target Goal: ${note.mainTargetGoal}`, 10, 50);
    pdf.text(`Sub Target Goal: ${note.subTargetGoal}`, 10, 60);

    pdf.save(`note_${id}.pdf`);
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

        <div className="flex items-center justify-between mt-6">
          <Link
            to={`/courses/${courseid}/notes/note/${id}/edit`}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Edit Note
          </Link>
          <Link
            to={`/courses/${courseid}/notes`}
            className="text-gray-600 hover:underline"
          >
            Back to Course Notes
          </Link>
          <button
            onClick={saveAsPDF}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Save as PDF
          </button>
        </div>
      </div>
      </>)}
      <ToastContainer />
    </div>
  );
};

export default ViewNoteOfViewNotes;
