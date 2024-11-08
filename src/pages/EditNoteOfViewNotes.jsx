
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

const EditNoteOfViewNotes = () => {
  const { courseid, id } = useParams();  // Note ID for fetching/updating specific note
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  const [note, setNote] = useState({
    question: "",
    answer: "",
    mainTargetCategory: "",
    mainTargetGoal: "",
    subTargetGoal: "",
  });
  
  // Main Target Goals, Target Goals, Sub Target Goals should be defined similarly to EditCourse
  const mainTargetCategories = [
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
  ];  // Example options
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
  const subTargetGoals = { "Algorithms": ["Sorting", "Graph Theory", "Dynamic Programming"],
    "Artificial Intelligence": ["Machine Learning", "Neural Networks", "Natural Language Processing"] };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/notes/note/${id}`);
        if (!response.ok) throw new Error("Failed to fetch note data");

        const data = await response.json();
        setNote({
          question: data.note.question || "",
          answer: data.note.answer || "",
          mainTargetCategory: data.note.mainTargetCategory || "",
          mainTargetGoal: data.note.mainTargetGoal || "",
          subTargetGoal: data.note.subTargetGoal || "",
        });
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error fetching note data");
      }
    };
    fetchNote();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value || "",
    }));
  };

  const handleCategoryChange = (e) => {
    setNote({
      ...note,
      mainTargetCategory: e.target.value || "",
      mainTargetGoal: "",
      subTargetGoal: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://udemy-tracker.vercel.app/notes/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!response.ok) throw new Error("Failed to update note");

      toast.success("Note updated successfully!");
      navigate(`/courses/${courseid}/notes/note/${id}/view`);
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Error updating note data");
    }
  };

  return (
    <div className={`container mx-auto px-4 py-6 mt-12 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <h2 className="text-3xl font-bold mb-4">Edit Note</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="question" className="block mb-2">Question:</label>
            <input
              type="text"
              id="question"
              name="question"
              value={note.question}
              onChange={handleChange}
              className={`border p-2 w-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="answer" className="block mb-2">Answer:</label>
            <textarea
              id="answer"
              name="answer"
              value={note.answer}
              onChange={handleChange}
              className={`border p-2 w-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mainTargetCategory" className="block mb-2">Main Target Category:</label>
            <select
              id="mainTargetCategory"
              name="mainTargetCategory"
              value={note.mainTargetCategory}
              onChange={handleCategoryChange}
              className={`border p-2 w-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              required
            >
              <option value="">Select a main target category</option>
              {mainTargetCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="mainTargetGoal" className="block mb-2">Main Target Goal:</label>
            <select
              id="mainTargetGoal"
              name="mainTargetGoal"
              value={note.mainTargetGoal}
              onChange={handleChange}
              className={`border p-2 w-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
              required
            >
              <option value="">Select a main target goal</option>
              {note.mainTargetCategory && targetGoals[note.mainTargetCategory]?.map((goal) => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="subTargetGoal" className="block mb-2">Sub Target Goal:</label>
            <select
              id="subTargetGoal"
              name="subTargetGoal"
              value={note.subTargetGoal}
              onChange={handleChange}
              className={`border p-2 w-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            >
              <option value="">Select a sub target goal</option>
              {note.mainTargetGoal && subTargetGoals[note.mainTargetGoal]?.map((subGoal) => (
                <option key={subGoal} value={subGoal}>{subGoal}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Update Note
            </button>
            <Link to={`/courses/${courseid}/notes/note/${id}/view`} className="text-red-600 hover:underline">Cancel</Link>
            <Link to={`/courses/${courseid}/notes`} className="text-gray-600 hover:underline">Back to Couse Notes</Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditNoteOfViewNotes;
