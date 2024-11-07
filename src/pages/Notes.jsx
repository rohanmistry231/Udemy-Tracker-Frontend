import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import theme context

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
  "Database": [
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
  "Business": [
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
  "Filmmaking": ["Photography & Video", "Budgeting", "After Effects"],
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
  "Marketing": [
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
  "Music": ["Drum", "Audio Production", "Song Writing", "Piano", "Guitar"],
  "Cloud": [
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
  "DevOps": [
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
  "Language": ["English", "Test", "German"],
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
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://udemy-tracker.vercel.app/notes/all");
        const data = await response.json();
        setNotes(data.notes); // Ensure the notes are being set correctly
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const getTargetGoals = () => {
    return mainGoalFilter ? targetGoals[mainGoalFilter] || [] : [];
  };

  const getSubTargetGoals = () => {
    const selectedNotes = notes.filter(note => note.mainTargetGoal === targetGoalFilter);
    return [...new Set(selectedNotes.map(note => note.subTargetGoal))];
  };

  const filteredNotes = notes.filter(note => 
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

  return (
    <div className={`container mx-auto px-4 py-6 mt-12 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <h2 className={`text-3xl font-semibold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        📝 Notes List 📝
      </h2>

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
            <input
              type="text"
              placeholder="Search notes by title or content..."
              className={`border p-2 rounded w-full sm:w-1/3 h-12 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className={`border p-2 rounded w-full sm:w-1/6 h-12 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              value={mainGoalFilter}
              onChange={(e) => {
                setMainGoalFilter(e.target.value);
                setTargetGoalFilter("");
                setSubTargetGoalFilter("");
              }}
            >
              <option value="">All Main Goals</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              className={`border p-2 rounded w-full sm:w-1/6 h-12 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              value={targetGoalFilter}
              onChange={(e) => {
                setTargetGoalFilter(e.target.value);
                setSubTargetGoalFilter("");
              }}
              disabled={!mainGoalFilter}
            >
              <option value="">All Target Goals</option>
              {getTargetGoals().map((goal) => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
            <select
              className={`border p-2 rounded w-full sm:w-1/6 h-12 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              value={subTargetGoalFilter}
              onChange={(e) => setSubTargetGoalFilter(e.target.value)}
              disabled={!targetGoalFilter}
            >
              <option value="">All Sub Goals</option>
              {getSubTargetGoals().map((subGoal) => (
                <option key={subGoal} value={subGoal}>{subGoal}</option>
              ))}
            </select>
            <Link to="/add-note" className="w-full sm:w-auto">
              <button className={`rounded h-12 w-full sm:w-32 transition duration-200 flex items-center justify-center ${isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
                Add Note
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentNotes.map((note) => (
              <div key={note._id} onClick={() => navigate(`/notes/${note._id}/view`)} className={`shadow-md rounded-lg p-4 cursor-pointer ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                <h3 className="font-bold text-lg">{note.title}</h3>
                <p className={`font-bold ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Question: {note.question}</p>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Main Goal: {note.mainTargetCategory}</p>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Target Goal: {note.mainTargetGoal}</p>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Sub Goal: {note.subTargetGoal}</p>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Answer: {note.answer}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/notes/${note._id}/edit`); }} className={`p-2 rounded ${isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
                    Edit Note
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); /* handle delete logic here */ }} className={`p-2 rounded ${isDarkMode ? "bg-red-700 hover:bg-red-800" : "bg-red-500 hover:bg-red-600"} text-white`}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`p-2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
              Previous
            </button>
            <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`p-2 rounded ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;