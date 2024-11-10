import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import theme context
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getNotesFromLocalStorage,
  saveNotesToLocalStorage,
  syncNotesWithBackend,
} from "../dataService";

const categories = [
  "Data Science",
  "Database",
  "IT & Software",
  "Web Development",
  "Business",
  "Filmmaking",
  "Graphics Design",
  "Marketing",
  "Office Productivity",
  "Music",
  "Cloud",
  "DevOps",
  "Health & Fitness",
  "Language",
  "Operating System",
  "Personal Development",
  "Version Control",
];

const targetGoals = {
  "Data Science": [
    "Algorithms",
    "Artificial Intelligence",
    "Big Data",
    "Career",
    "Data Analysis",
    "ETL",
    "Machine Learning",
    "Math",
    "Predictive Analysis",
    "Prompt Engineering",
    "Skill Development",
    "Software",
    "Test",
    "Web App",
    "Mathematics",
  ],
  Database: [
    "DBMS",
    "MySQL",
    "NoSQL",
    "SQL",
    "SQL & NoSQL",
    "Test",
    "SupaBase",
  ],
  "IT & Software": [
    "API",
    "Artificial Intelligence",
    "Business Intelligence",
    "CEO",
    "IOT",
    "Network & Security",
    "Programming Language",
    "Software",
    "Software Testing",
    "Test",
    "Windows",
    "System Design",
    "CTO",
    "Hardware",
  ],
  "Web Development": [
    "API",
    "Backend",
    "Dialogflow",
    "Frontend",
    "Full Stack",
    "MERN",
    "NGINX",
    "Test",
    "Web Automation",
    "Web Hosting",
    "Web Scraping & Automation",
    "Wordpress",
    "UIUX",
  ],
  Business: [
    "Business Strategy",
    "Communication",
    "Consultant",
    "Digital Marketing",
    "E-Commerce",
    "Entrepreneurship",
    "Finance",
    "Leadership",
    "Management",
    "MBA",
    "Operation",
    "Photography",
    "Productivity",
    "Sales",
    "Test",
    "Cryptocurrency & Blockchain",
    "Cryptocurrency & Bitcoin",
    "Trading",
    "No Code Development",
  ],
  Filmmaking: ["Photography & Video", "Budgeting", "After Effects"],
  "Graphics Design": [
    "Adobe Captivate",
    "Adobe Illustrator",
    "Adobe Lightroom",
    "Adobe Photoshop",
    "Design Theory",
    "Photography",
    "Logo Design",
    "Graphics Design",
    "Canva",
    "CorelDraw",
    "Blender",
    "After Effects",
  ],
  Marketing: [
    "Content Marketing",
    "Digital Marketing",
    "Test",
    "Marketing Strategy",
  ],
  "Office Productivity": [
    "Calendar",
    "Google",
    "Microsoft",
    "Other Office Productivity",
  ],
  Music: ["Drum", "Audio Production", "Song Writing", "Piano", "Guitar"],
  Cloud: [
    "AWS",
    "Azure",
    "Cloud",
    "ElasticSearch",
    "Google Cloud",
    "Linode",
    "NGINX",
    "Serverless Computing",
    "Terraform",
    "Test",
    "Microservices",
    "Data Build Tool",
  ],
  DevOps: [
    "Ansible",
    "Azure",
    "DevOps",
    "DevSecOps",
    "Docker",
    "GitHub Actions",
    "Jenkins",
    "Kubernetes",
    "Terraform",
    "Test",
    "YAML",
  ],
  "Health & Fitness": [
    "Diet",
    "Health & Fitness",
    "Mental Health",
    "Nutrition & Diet",
    "Dog",
    "Ayurveda",
    "Martial Arts & Self Defence",
    "Eye",
    "Yoga",
  ],
  Language: ["English", "Test", "German"],
  "Operating System": [
    "Linux",
    "Network & Security",
    "Test",
    "Ubuntu Linux",
    "Windows",
  ],
  "Personal Development": [
    "Career",
    "Communication",
    "Creativity",
    "Health & Fitness",
    "Leadership",
    "Personal Brand Building",
    "Personal Development",
    "Productivity",
    "Self Care",
    "Skill Development",
    "Test",
    "Personal Transformation",
    "Numerology",
    "Happiness",
    "Typing",
    "Influence",
  ],
  "Version Control": ["Git and Github", "Test"],
};

const Notes = () => {
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
    try {
      // Call the sync function
      const updatedNotes = await syncNotesWithBackend();

      // Update your state or UI accordingly with the updated notes
      setNotes(updatedNotes);
      setSyncMessage("Notes successfully synced with the backend!");
    } catch (error) {
      console.error("Error during sync:", error);
      toast.error("Error syncing notes. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteNote = async (noteId) => {
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
  };

  const saveNoteAsPDF = (note) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Note Details", 10, 10);

    doc.setFontSize(12);
    doc.text(`Question: ${note.question}`, 10, 40);
    doc.text(`Answer: ${note.answer}`, 10, 80);
    doc.text(`Main Goal: ${note.mainTargetCategory}`, 10, 50);
    doc.text(`Target Goal: ${note.mainTargetGoal}`, 10, 60);
    doc.text(`Sub Goal: ${note.subTargetGoal}`, 10, 70);

    doc.save(`note_${note._id}.pdf`);
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
      <div>
        <button
          onClick={handleSyncClick}
          disabled={isSyncing} // Disable button while syncing
          className="sync-button"
        >
          {isSyncing ? "Syncing..." : "Sync Notes"}
        </button>
        {syncMessage && <p>{syncMessage}</p>} {/* Display sync message */}
      </div>
      <h2
        className={`text-3xl font-semibold mb-6 text-center ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        📝 Notes List 📝
      </h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="Search notes by title or content..."
          className={`border p-2 rounded w-full sm:w-1/3 h-12 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
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
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
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
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
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
            className={`rounded h-12 w-full sm:w-32 transition duration-200 flex items-center justify-center ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Add Note
          </button>
        </Link>
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
                <h3 className="font-bold text-lg">{note.title}</h3>
                <p
                  className={`font-bold ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Question: {note.question}
                </p>
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
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Answer: {note.answer}
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
