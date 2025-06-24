import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; // Import theme context
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getNotesFromLocalStorage,
  saveNotesToLocalStorage,
  syncNotesWithBackend,
} from "../../dataService";
import { categories, targetGoals } from "../../db";
import html2canvas from "html2canvas";

const Notes = () => {
  const correctPassword = "12345";
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [mainGoalFilter, setMainGoalFilter] = useState("");
  const [targetGoalFilter, setTargetGoalFilter] = useState("");
  const [subTargetGoalFilter, setSubTargetGoalFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("notesCurrentPage")) || 1
  );
  const notesPerPage = 12;
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(""); // State to show a message after syncing

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        // Try to get notes from localStorage first
        const storedNotes = getNotesFromLocalStorage();

        if (storedNotes.length > 0) {
          // If notes exist in localStorage, use them
          setNotes(storedNotes);
        } else {
          // If no notes in localStorage, fetch from the backend
          const response = await fetch(
            "https://udemy-tracker.vercel.app/notes/all"
          );
          const data = await response.json();
          setNotes(data.notes);

          // Save fetched notes to localStorage for future use
          saveNotesToLocalStorage(data.notes);
        }

        // Store currentPage in localStorage
        localStorage.setItem("notesCurrentPage", currentPage);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    // Clear currentPage from localStorage on page reload
    const handlePageReload = () => {
      localStorage.removeItem("notesCurrentPage");
    };

    window.addEventListener("beforeunload", handlePageReload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
    };
  }, [currentPage]);

  // Function to handle button click
  const handleSyncClick = async () => {
    setIsSyncing(true);
    setSyncMessage("Syncing...");

    try {
      // Call the sync function
      const updatedNotes = await syncNotesWithBackend();

      // Update your state or UI accordingly with the updated notes
      setNotes(updatedNotes);
      setSyncMessage("Sync successful!");
    } catch (error) {
      console.error("Error during sync:", error);
      toast.error("Error syncing notes. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteNote = async (noteId) => {
    // Retrieve password from localStorage
    const storedPassword = localStorage.getItem("password");

    // Check if the stored password matches the correct password
    if (storedPassword === correctPassword) {
      // Show confirmation dialog
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this note?"
      );
      if (!isConfirmed) return; // If the user cancels, exit the function

      try {
        const response = await fetch(
          `https://udemy-tracker.vercel.app/notes/deleteByNoteId/${noteId}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          // Update the state by removing the deleted note from the list
          setNotes((prevNotes) =>
            prevNotes.filter((note) => note._id !== noteId)
          );
        } else {
          console.error("Failed to delete the note.");
        }
      } catch (error) {
        console.error("Error deleting the note:", error);
      }
    } else {
      alert(
        "⚠️ Access Denied: You lack authorization to perform this action. ⚠️"
      );
    }
  };

  const saveNoteAsPDF = (note) => {
    // Retrieve password from localStorage
    const storedPassword = localStorage.getItem("password");

    // Check if the stored password matches the correct password
    if (storedPassword === correctPassword) {
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
    `;
      document.body.appendChild(container);

      // Render the content with html2canvas at a higher scale
      html2canvas(container, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Positioning and scaling adjustments for a more readable output
        pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight - 10);
        pdf.save(`note_${note._id}.pdf`);

        document.body.removeChild(container); // Clean up
      });
    } else {
      alert(
        "⚠️ Access Denied: You lack authorization to perform this action. ⚠️"
      );
    }
  };

  const getTargetGoals = () => {
    return mainGoalFilter ? targetGoals[mainGoalFilter] || [] : [];
  };

  const getSubTargetGoals = () => {
    const selectedNotes = notes.filter(
      (note) => note.mainTargetGoal === targetGoalFilter
    );
    return [...new Set(selectedNotes.map((note) => note.subTargetGoal))];
  };

  const filteredNotes = notes.filter(
    (note) =>
      (note.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.answer.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (mainGoalFilter === "" || note.mainTargetCategory === mainGoalFilter) &&
      (targetGoalFilter === "" || note.mainTargetGoal === targetGoalFilter) &&
      (subTargetGoalFilter === "" || note.subTargetGoal === subTargetGoalFilter)
  );

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  // Function to handle page change and scroll to top
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <h2
        className={`text-3xl font-semibold mb-6 text-center ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        📝 Notes List 📝
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <div className="w-full flex flex-row lg:w-1/4">
          <input
            type="text"
            placeholder="Search notes by title or content..."
            className={`border p-2 rounded-md md:w-full lg:w-full w-full sm:w-full h-10 ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-black border-gray-300"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`hide-on-large rounded-md h-10 w-1/3 lg:ml-auto ml-2 sm:w-32 transition duration-200 flex items-center justify-center ${
              isDarkMode
                ? "bg-gray-600 hover:bg-gray-700 text-white"
                : "bg-gray-500 hover:bg-gray-600 text-white"
            } ${isSyncing ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isSyncing ? (
              <span>Syncing...</span>
            ) : syncMessage ? (
              <span>{syncMessage}</span>
            ) : (
              <span>Sync</span>
            )}
          </button>
        </div>
        <select
          className={`border p-2 rounded-md w-full sm:w-1/6 h-10 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={mainGoalFilter}
          onChange={(e) => {
            setMainGoalFilter(e.target.value);
            setTargetGoalFilter("");
            setSubTargetGoalFilter("");
          }}
        >
          <option value="">All Main Goals</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          className={`border p-2 rounded-md w-full sm:w-1/6 h-10 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={targetGoalFilter}
          onChange={(e) => {
            setTargetGoalFilter(e.target.value);
            setSubTargetGoalFilter("");
          }}
          disabled={!mainGoalFilter}
        >
          <option value="">All Target Goals</option>
          {getTargetGoals().map((goal) => (
            <option key={goal} value={goal}>
              {goal}
            </option>
          ))}
        </select>
        <select
          className={`border p-2 rounded-md w-full sm:w-1/6 h-10 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={subTargetGoalFilter}
          onChange={(e) => setSubTargetGoalFilter(e.target.value)}
          disabled={!targetGoalFilter}
        >
          <option value="">All Sub Goals</option>
          {getSubTargetGoals().map((subGoal) => (
            <option key={subGoal} value={subGoal}>
              {subGoal}
            </option>
          ))}
        </select>

        <Link to="/add-note" className="w-full sm:w-auto">
          <button
            className={`rounded-md h-10 w-full sm:w-32 transition duration-200 flex items-center justify-center ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Add Note
          </button>
        </Link>

        <button
          onClick={handleSyncClick}
          disabled={isSyncing}
          className={`hide-on-small rounded-md h-10 w-full sm:w-32 transition duration-200 flex items-center justify-center ${
            isDarkMode
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          } ${isSyncing ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isSyncing ? (
            <span>Syncing...</span>
          ) : syncMessage ? (
            <span>{syncMessage}</span>
          ) : (
            <span>Sync</span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-10 mb-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentNotes.map((note) => (
              <div
                key={note._id}
                onClick={() => navigate(`/notes/${note._id}/view`)}
                className={`shadow-md rounded-lg p-4 cursor-pointer ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <p
                  className={`font-bold ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  Question: {note.question}
                </p>
                <div
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Answer:{" "}
                  <div
                    className="text-ellipsis overflow-hidden line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: note.answer }}
                  />
                </div>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Main Goal: {note.mainTargetCategory}
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Target Goal: {note.mainTargetGoal}
                </p>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Sub Goal: {note.subTargetGoal}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      saveNoteAsPDF(note);
                    }}
                    className={`p-2 rounded ${
                      isDarkMode
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    Save as PDF
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/notes/${note._id}/edit`);
                    }}
                    className={`p-2 rounded ${
                      isDarkMode
                        ? "bg-blue-700 hover:bg-blue-800"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                  >
                    Edit Note
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the navigation when clicking delete
                      deleteNote(note._id); // Call deleteNote with the note ID
                    }}
                    className={`p-2 rounded ${
                      isDarkMode
                        ? "bg-red-700 hover:bg-red-800"
                        : "bg-red-500 hover:bg-red-600"
                    } text-white`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          Previous
        </button>
        <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded ${
            isDarkMode ? "bg-gray-700" : "bg-gray-300"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Notes;
