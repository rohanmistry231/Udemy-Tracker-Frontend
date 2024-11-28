import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext"; // Importing the useTheme hook

// Dummy data for categories and subcategories
const projectCategories = [
  {
    name: "Data Science",
    subcategories: [
      "Machine Learning",
      "Artificial Intelligence",
      "Deep Learning",
    ],
  },
  {
    name: "Web Development",
    subcategories: ["Frontend", "Backend", "Full Stack"],
  },
  {
    name: "Mobile Development",
    subcategories: ["Android", "iOS", "React Native"],
  },
  {
    name: "DevOps",
    subcategories: ["CI/CD", "Cloud Computing", "Infrastructure Automation"],
  },
];

const ProjectModal = ({ project = {}, onClose, onSubmit }) => {
  const { theme } = useTheme(); // Access the theme
  const isDarkMode = theme === "dark"; // Check if dark mode is enabled

  const [formData, setFormData] = useState({
    title: project.title || "",
    description: project.description || "",
    tech: project.tech ? project.tech.join(", ") : "",
    link: project.link || "",
    liveDemo: project.liveDemo || "",
    category: project.category || "", // New category field
    subCategory: project.subCategory || "", // New sub-category field
  });

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    // Set subcategories based on selected category
    const categoryData = projectCategories.find(
      (cat) => cat.name === formData.category
    );
    if (categoryData) {
      setSubCategories(categoryData.subcategories);
    } else {
      setSubCategories([]);
    }
  }, [formData.category]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Convert tech string into an array
    const techArray = formData.tech.split(",").map((item) => item.trim());
    onSubmit({ ...project, ...formData, tech: techArray });
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`w-full max-w-md p-6 rounded-lg shadow-lg relative ${
          isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        } overflow-hidden`}
      >
        <h3 className="text-2xl font-semibold mb-4">
          {project._id ? "Update Project" : "Add Project"}
        </h3>

        <form
          onSubmit={handleFormSubmit}
          className="overflow-y-auto max-h-[75vh]"
        >
          {" "}
          {/* Scrollable form content */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full p-3 rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              } focus:outline-none focus:ring-2`}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full p-3 rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              } focus:outline-none focus:ring-2`}
              rows="4"
              required
            />
          </div>
          {/* Category Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full p-3 rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              } focus:outline-none focus:ring-2`}
              required
            >
              <option value="">Select Category</option>
              {projectCategories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {/* Subcategory Dropdown */}
          {formData.category && (
            <div className="mb-4">
              <label
                htmlFor="subCategory"
                className="block text-sm font-medium mb-2"
              >
                Subcategory
              </label>
              <select
                id="subCategory"
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className={`w-full p-3 rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-100"
                    : "bg-gray-100 text-gray-800"
                } focus:outline-none focus:ring-2`}
                required
              >
                <option value="">Select Subcategory</option>
                {subCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="tech" className="block text-sm font-medium mb-2">
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              id="tech"
              name="tech"
              value={formData.tech}
              onChange={handleInputChange}
              className={`w-full p-3 rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              } focus:outline-none focus:ring-2`}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="link" className="block text-sm font-medium mb-2">
              GitHub Link
            </label>
            <input
              type="url"
              id="link"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className={`w-full p-3 rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              } focus:outline-none focus:ring-2`}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="liveDemo"
              className="block text-sm font-medium mb-2"
            >
              Live Demo Link
            </label>
            <input
              type="url"
              id="liveDemo"
              name="liveDemo"
              value={formData.liveDemo}
              onChange={handleInputChange}
              className={`w-full p-3 rounded ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-100 text-gray-800"
              } focus:outline-none focus:ring-2`}
            />
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-md bg-gray-400 text-gray-100 hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              {project._id ? "Update Project" : "Add Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
