// src/pages/AddCourse.js
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext"; // Import theme context
import { createCourse } from "../dataService";

const AddCourse = ({ onAdd }) => {
  const { theme } = useTheme(); // Use theme context
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const isDarkMode = theme === "dark"; // Check if dark mode is enabled
  const [courseData, setCourseData] = useState({
    no: "", // Make it blank and editable
    name: "",
    category: "",
    categoryPriority: "Medium priority",
    subCategory: "",
    subSubCategory: "",
    importantStatus: "Important",
    status: "Not Started Yet",
    durationInHours: "",
    subLearningSkillsSet: [],
    learningSkillsSet: "",
  });

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

  const categoryPriorities = {
    "Data Science": "High priority",
    Database: "High priority",
    "IT & Software": "High priority",
    "Web Development": "High priority",
    Business: "Low priority",
    Filmmaking: "Low priority",
    "Graphics Design": "Low priority",
    Marketing: "Low priority",
    "Office Productivity": "Low priority",
    Music: "Low priority",
    Cloud: "Medium priority",
    DevOps: "Medium priority",
    "Health & Fitness": "Parallel priority",
    Language: "Parallel priority",
    "Operating System": "Parallel priority",
    "Personal Development": "Parallel priority",
    "Version Control": "Parallel priority",
  };

  const subCategories = {
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "12345"; // Define the correct password here
    if (password === correctPassword) {
      setIsAuthorized(true);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({
      ...prevData,
      [name]:
        name === "subLearningSkillsSet"
          ? value.split(",").map((skill) => skill.trim()) // Convert comma-separated input into array
          : value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const priority = categoryPriorities[selectedCategory]; // Get priority from mapping
    setCourseData((prevData) => ({
      ...prevData,
      category: selectedCategory,
      categoryPriority: priority, // Automatically set priority
      subCategory: "", // Reset subcategory when category changes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the course data with 'durationInHours' converted to a number
    const preparedData = {
      ...courseData,
      durationInHours: courseData.durationInHours
        ? parseFloat(courseData.durationInHours)
        : "",
    };

    try {
      // Call the createCourse function from dataService to handle the course creation
      const newCourse = await createCourse(preparedData);

      // On successful course creation, update the state with the new course
      onAdd(newCourse);

      // Show success toast
      toast.success("Course added successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });

      // Reset form after successful course addition
      setCourseData({
        no: "",
        name: "",
        category: "",
        categoryPriority: "",
        subCategory: "",
        subSubCategory: "",
        importantStatus: "",
        status: "",
        durationInHours: "",
        subLearningSkillsSet: [],
        learningSkillsSet: "",
      });
    } catch (error) {
      // If there is an error, show the error toast
      console.error("Error adding course:", error);
      toast.error("Error adding course!", { position: "bottom-right" });
    }
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {!isAuthorized ? (
        <form
          onSubmit={handlePasswordSubmit}
          className={`p-6 rounded shadow-md mt-12 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <label htmlFor="password" className="block mb-2">
            🔒 Prove You're Worthy! Enter the Secret Code:
          </label>
          <input
            type="password"
            id="password"
            autoFocus // Add autofocus here
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
          <h2 className="text-2xl mb-4">Add New Course</h2>
          <form
            onSubmit={handleSubmit}
            className={`p-6 rounded shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="mb-4">
              <label className="block mb-2" htmlFor="no">
                Course No:
              </label>
              <input
                type="number"
                id="no"
                name="no"
                value={courseData.no}
                onChange={handleChange} // Now editable
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="name">
                Course Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={courseData.name}
                onChange={handleChange}
                required
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="category">
                Category:
              </label>
              <select
                id="category"
                name="category"
                value={courseData.category}
                onChange={handleCategoryChange}
                required
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="subCategory">
                Sub Category:
              </label>
              <select
                id="subCategory"
                name="subCategory"
                value={courseData.subCategory}
                onChange={handleChange}
                required
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="">Select a sub category</option>
                {courseData.category &&
                  subCategories[courseData.category]?.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="subSubCategory">
                Sub-Sub Category:
              </label>
              <input
                type="text"
                id="subSubCategory"
                name="subSubCategory"
                value={courseData.subSubCategory}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="categoryPriority">
                Category Priority:
              </label>
              <select
                id="categoryPriority"
                name="categoryPriority"
                value={courseData.categoryPriority}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="High priority">High priority</option>
                <option value="Medium priority">Medium priority</option>
                <option value="Low priority">Low priority</option>
                <option value="Parallel priority">Parallel priority</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="importantStatus">
                Important Status:
              </label>
              <select
                id="importantStatus"
                name="importantStatus"
                value={courseData.importantStatus}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="Very Important">Very Important</option>
                <option value="Important">Important</option>
                <option value="Not Important">Not Important</option>
                <option value="Extra">Extra</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="status">
                Status:
              </label>
              <select
                id="status"
                name="status"
                value={courseData.status}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              >
                <option value="Not Started Yet">Not Started Yet</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="durationInHours">
                Duration in Hours:
              </label>
              <input
                type="number"
                id="durationInHours"
                name="durationInHours"
                value={courseData.durationInHours}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="subLearningSkillsSet">
                Sub Learning Skills Set (comma separated):
              </label>
              <input
                type="text"
                id="subLearningSkillsSet"
                name="subLearningSkillsSet"
                value={courseData.subLearningSkillsSet.join(", ")} // Display as comma-separated
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="learningSkillsSet">
                Learning Skills Set:
              </label>
              <input
                type="text"
                id="learningSkillsSet"
                name="learningSkillsSet"
                value={courseData.learningSkillsSet}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Course
            </button>
          </form>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default AddCourse;
