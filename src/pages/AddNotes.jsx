// src/pages/AddNotes.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext"; // Import theme context
import { getCourseName, addNoteToCourse } from '../dataService';

const AddNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === "dark"; // Check if dark mode is enabled

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [courseName, setCourseName] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [mainCategory, setMainCategory] = useState("");
  const [targetGoal, setTargetGoal] = useState("");
  const [subTargetGoal, setSubTargetGoal] = useState("");

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

  const subGoals = {
    Algorithms: ["Sorting", "Graph Theory", "Dynamic Programming"],
    "Artificial Intelligence": [
      "Machine Learning",
      "Neural Networks",
      "Natural Language Processing",
    ],
    // Add other target goals and their sub-target goals here...
  };

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const name = await getCourseName(id);  // Call the service function
        setCourseName(name);  // Set the course name in the state
      } catch (error) {
        console.error("Error fetching course name:", error);
        setCourseName("Error fetching course name");  // Optional fallback
      }
    };

    fetchCourseName();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();

    const noteData = {
      question,
      answer,
      mainTargetCategory: mainCategory,
      mainTargetGoal: targetGoal,
      subTargetGoal,
    };

    try {
      // Call the service function to add the note
      await addNoteToCourse(id, noteData);

      // Navigate to the notes page after successful addition
      navigate(`/courses/${id}/notes`);
      toast.success("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note. Please try again.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "12345";
    if (password === correctPassword) {
      setIsAuthorized(true);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-10 ${
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
        <div
          className={`shadow-md rounded-lg p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">
            Add Notes for {courseName}
          </h2>

          <form onSubmit={handleAddNote} className="space-y-4">
            <select
              value={mainCategory}
              onChange={(e) => {
                setMainCategory(e.target.value);
                setTargetGoal("");
                setSubTargetGoal("");
              }}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              <option value="">Select Main Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={targetGoal}
              onChange={(e) => {
                setTargetGoal(e.target.value);
                setSubTargetGoal(""); // Reset subTargetGoal when targetGoal changes
              }}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              disabled={!mainCategory}
            >
              <option value="">Select Target Goal</option>
              {mainCategory &&
                targetGoals[mainCategory].map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
            </select>

            <select
              value={subTargetGoal}
              onChange={(e) => setSubTargetGoal(e.target.value)}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              disabled={!targetGoal}
            >
              <option value="">Select Sub Target Goal</option>
              {targetGoal &&
                subGoals[targetGoal]?.map((subGoal) => (
                  <option key={subGoal} value={subGoal}>
                    {subGoal}
                  </option>
                ))}
            </select>

            <div>
              <label htmlFor="question" className="block mb-1">
                Question:
              </label>
              <input
                type="text"
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                required
              />
            </div>

            <div>
              <label htmlFor="answer" className="block mb-1">
                Answer:
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Note
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNotes;
