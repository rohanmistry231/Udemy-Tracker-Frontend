// src/pages/ViewNote.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";
import jsPDF from "jspdf"; // Import jsPDF
import { fetchNoteById } from "../dataService";
import html2canvas from 'html2canvas';

const ViewNote = () => {
  const correctPassword = "12345";
  const { id } = useParams(); // Note ID for fetching specific note details
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [note, setNote] = useState(null);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const data = await fetchNoteById(id); // Call the service function
        setNote(data.note); // Set the note details from the response
        const storedPassword = localStorage.getItem("password");
    if (storedPassword === correctPassword) {
      setIsAuthorized(true);
    }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error fetching note details");
      }
    };

    fetchNoteDetails(); // Fetch the note details when the component mounts or id changes
  }, [id]);

const saveAsPDF = () => {
  // Create a container for the HTML content we want to capture
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "-9999px";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.lineHeight = "1.6";
  container.innerHTML = `
    <div style="font-size: 14px; padding: 10px; width: 180mm; color: black;">
      <h1 style="font-size: 18px;">Note Details</h1>
      <p><strong>Question:</strong> ${note.question}</p>
      <p><strong>Main Goal:</strong> ${note.mainTargetCategory}</p>
      <p><strong>Target Goal:</strong> ${note.mainTargetGoal}</p>
      <p><strong>Sub Goal:</strong> ${note.subTargetGoal}</p>
      <h2 style="font-size: 16px;">Answer:</h2>
      <div>${note.answer}</div>
    </div>
  `;  document.body.appendChild(container);

  // Render the content with html2canvas at a higher scale for better clarity
  html2canvas(container, { scale: 3 }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Adjust the image size and margins for better output
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 10);
    pdf.save(`note_${note._id}.pdf`);

    // Clean up by removing the temporary container
    document.body.removeChild(container);
  });
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
            to={`/notes/${id}/edit`}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Edit Note
          </Link>
          <Link
            to="/notes"
            className="text-gray-600 hover:underline"
          >
            Back to Notes
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

export default ViewNote;
