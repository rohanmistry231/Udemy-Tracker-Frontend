import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import ProjectModal from "./ProjectModal";
import { AiOutlinePlus } from "react-icons/ai";

const Projects = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const correctPassword = "12345";
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  const [currentProjectPage, setCurrentProjectPage] = useState(
    parseInt(localStorage.getItem("currentProjectPage")) || 1
  ); // Get the page from localStorage or default to 1
  const [projectsPerPage] = useState(6); // 6 projects per page

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  // Update localStorage whenever projects or categories change
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://udemy-tracker.vercel.app/project"
        );
        setProjects(response.data);
        setLoading(false);

        // Get unique categories from projects
        const uniqueCategories = [
          ...new Set(response.data.map((project) => project.category)),
        ];
        setCategories(uniqueCategories);
        // Store the currentCertificatePage in localStorage
        localStorage.setItem("currentProjectPage", currentProjectPage);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();

    // Clear currentCertificatePage from localStorage on page reload
    const handlePageReload = () => {
      localStorage.removeItem("currentProjectPage");
    };

    window.addEventListener("beforeunload", handlePageReload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
    };
  }, [currentProjectPage]);

  // Add Project
  const addProject = async (newProject) => {
    try {
      const response = await axios.post(
        "https://udemy-tracker.vercel.app/project",
        newProject
      );
      setProjects([...projects, response.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  // Update Project
  const updateProject = async (updatedProject) => {
    try {
      const response = await axios.put(
        `https://udemy-tracker.vercel.app/project/${updatedProject._id}`,
        updatedProject
      );
      setProjects(
        projects.map((project) =>
          project._id === updatedProject._id ? response.data : project
        )
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Delete Project with Confirmation
  const deleteProject = async (id) => {
    // Retrieve password from localStorage
    const storedPassword = localStorage.getItem("password");

    // Check if the stored password matches the correct password
    if (storedPassword === correctPassword) {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this project?"
      );
      if (confirmDelete) {
        try {
          await axios.delete(`https://udemy-tracker.vercel.app/project/${id}`);
          setProjects(projects.filter((project) => project._id !== id));
        } catch (error) {
          console.error("Error deleting project:", error);
        }
      }
    } else {
      alert(
        "⚠️ Access Denied: You lack authorization to perform this action. ⚠️"
      );
    }
  };

  // Filter projects based on selected category and subCategory
  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      !selectedCategory || project.category === selectedCategory;
    const matchesSubCategory =
      !selectedSubCategory || project.subCategory === selectedSubCategory;

    return matchesCategory && matchesSubCategory;
  });

  // Handle category and sub-category change
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    setSelectedSubCategory(""); // Reset sub-category when category changes
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  // Get unique sub-categories based on selected category
  const filteredSubCategories = [
    ...new Set(
      projects
        .filter((project) => project.category === selectedCategory)
        .map((project) => project.subCategory)
    ),
  ];

  // Pagination logic
  const indexOfLastProject = currentProjectPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  // Function to handle page change and scroll to top
  const handlePageChange = (newPage) => {
    setCurrentProjectPage(newPage);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <div
      className={`container mx-auto px-4 py-10 pb-6 mt-8 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">
        💼 Projects 💼
      </h2>

      {/* Filters Section */}
      <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row sm:space-x-4 sm:justify-center">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={`px-4 py-2 h-10 rounded-lg w-full sm:w-auto mb-4 sm:mb-0 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
        >
          <option value="">All Categories</option>
          {categories.map((category, idx) => (
            <option key={idx} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Sub-category Filter */}
        <select
          value={selectedSubCategory}
          onChange={handleSubCategoryChange}
          disabled={!selectedCategory} // Disable when no category is selected
          className={`px-4 py-2 h-10 rounded-lg w-full sm:w-auto ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          } ${!selectedCategory ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <option value="">All Sub-Categories</option>
          {filteredSubCategories.map((subCategory, idx) => (
            <option key={idx} value={subCategory}>
              {subCategory}
            </option>
          ))}
        </select>
      </div>

      {/* Add Project Button */}
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => {
            const storedPassword = localStorage.getItem("password");

            if (correctPassword === storedPassword) {
              setShowAddModal(true);
            } else {
              alert(
                "⚠️ Access Denied: You lack authorization to perform this action. ⚠️"
              );
            }
          }}
          className={`rounded-md h-10 w-full sm:w-32 transition duration-200 flex items-center justify-center ${
            isDarkMode
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <AiOutlinePlus size={20} />
          Add Project
        </button>
      </div>

      {/* Projects Section */}
      {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-60 mb-60">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project) => (
              <div
                key={project._id}
                className={`p-6 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-800"
                } rounded-xl shadow-lg flex flex-col`}
              >
                {/* Title */}
                <h3
                  className={`text-2xl font-bold mb-4 ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  {project.title}
                </h3>

                {/* Category and Sub-Category */}
                <div className="text-md mb-3">
                  <p>
                    <strong>Category:</strong> {project.category}
                  </p>
                  <p className="mt-3">
                    <strong>Sub-Category:</strong> {project.subCategory}
                  </p>
                </div>

                {/* Description */}
                <p className="text-md mb-3">{project.description}</p>

                {/* Tech Stack */}
                <div className="mb-4">
                  <strong className="text-md mb-4">Tech Stack:</strong>
                  <ul className="flex flex-wrap gap-4 mt-3">
                    {project.tech.map((tech, idx) => (
                      <li
                        key={idx}
                        className={`text-sm px-3 py-1 rounded-md shadow-sm ${
                          isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Links */}
                <div className="flex space-x-4 mb-4">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-md flex items-center space-x-2 hover:underline ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 11h7m0 0v7m0-7L10 21m4-10h-7m7 0V4m0 7L4 14"
                      />
                    </svg>
                    <span>GitHub</span>
                  </a>
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-sm flex items-center space-x-2 hover:underline ${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-4.553a1 1 0 011.414 0L22.607 6.293a1 1 0 010 1.414L18 13l-3-3zm-3 1H4.8a2.8 2.8 0 01-2.8-2.8V4.8A2.8 2.8 0 014.8 2h2.4"
                      />
                    </svg>
                    <span>Live Demo</span>
                  </a>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-auto">
                  <button
                    onClick={() => {
                      const storedPassword = localStorage.getItem("password");
                      if (correctPassword === storedPassword) {
                        setCurrentProject(project);
                        setShowUpdateModal(true);
                      } else {
                        alert(
                          "⚠️ Access Denied: You lack authorization to perform this action. ⚠️"
                        );
                      }
                    }}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => deleteProject(project._id)}
                    className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center">No projects available.</div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => handlePageChange(currentProjectPage - 1)}
          disabled={currentProjectPage === 1}
          className={`p-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Previous
        </button>
        <span className={`${isDarkMode ? "text-white" : "text-black"}`}>
          Page {currentProjectPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentProjectPage + 1)}
          disabled={currentProjectPage === totalPages}
          className={`p-2 rounded ${
            isDarkMode
              ? "bg-gray-700 text-white hover:bg-gray-600"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProjectModal
          onClose={() => setShowAddModal(false)}
          onSubmit={addProject}
        />
      )}
      {showUpdateModal && (
        <ProjectModal
          project={currentProject}
          onClose={() => setShowUpdateModal(false)}
          onSubmit={updateProject}
        />
      )}
    </div>
  );
};

export default Projects;
