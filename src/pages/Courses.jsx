// src/pages/Courses.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import theme context

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Filter by course status
  const [importantFilter, setImportantFilter] = useState(""); // Filter by important status
  const [durationFilter, setDurationFilter] = useState(""); // Filter by duration
  const [priorityFilter, setPriorityFilter] = useState(""); // Filter by priority

  const navigate = useNavigate();
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === "dark";

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/courses");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term and selected filters
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "" || course.status === statusFilter) &&
      (importantFilter === "" || course.importantStatus === importantFilter) &&
      (durationFilter === "" ||
        (durationFilter === "short"
          ? course.durationInHours < 10
          : durationFilter === "medium"
          ? course.durationInHours >= 10 && course.durationInHours <= 30
          : durationFilter === "long"
          ? course.durationInHours > 30 && course.durationInHours <= 50
          : durationFilter === "extraLong"
          ? course.durationInHours > 50
          : true)) &&
      (priorityFilter === "" || course.categoryPriority === priorityFilter) // Include priority filter
  );

  // Handle course deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await fetch(`http://localhost:5000/courses/${id}`, {
          method: "DELETE",
        });
        setCourses((prevCourses) =>
          prevCourses.filter((course) => course._id !== id)
        );
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-10 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="Search courses..."
          className={`border p-2 rounded w-full sm:w-1/3 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status Filter */}
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Not Started Yet">Not Started Yet</option>
        </select>

        {/* Important Status Filter */}
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={importantFilter}
          onChange={(e) => setImportantFilter(e.target.value)}
        >
          <option value="">All Courses</option>
          <option value="Extra">Extra</option>
          <option value="Not Important">Not Important</option>
          <option value="Important">Important</option>
          <option value="Very Important">Very Important</option>
        </select>

        {/* Duration Filter */}
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={durationFilter}
          onChange={(e) => setDurationFilter(e.target.value)}
        >
          <option value="">All Durations</option>
          <option value="short">Less than 10 hrs</option>
          <option value="medium">10-30 hrs</option>
          <option value="long">30-50 hrs</option>
          <option value="extraLong">More than 50 hrs</option>
        </select>

        {/* Priority Filter */}
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="High priority">High priority</option>
          <option value="Medium priority">Medium priority</option>
          <option value="Low priority">Low priority</option>
          <option value="Parallel priority">Parallel priority</option>
        </select>

        <Link to="/add-course" className="w-full sm:w-auto">
          <button
            type="button"
            className={`rounded h-12 w-full sm:w-32 transition duration-200 flex items-center justify-center ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Add Course
          </button>
        </Link>
      </div>

      {/* Courses List */}
      <h2
        className={`text-2xl mb-4 ${isDarkMode ? "text-white" : "text-black"}`}
      >
        Courses List
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course._id}
            onClick={() => navigate(`/courses/${course._id}/view`)} // Make the card clickable
            className={`shadow-md rounded-lg p-4 cursor-pointer ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h3 className="font-bold text-lg">{course.name}</h3>
            <p
              className={`text-gray-600 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Category: {course.category}
            </p>
            <p
              className={`text-gray-600 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Status: {course.status}
            </p>
            <p
              className={`text-gray-600 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Duration: {course.durationInHours} hrs
            </p>
            <p
              className={`text-gray-600 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Priority: {course.categoryPriority}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {/* Remove View Course button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  navigate(`/courses/${course._id}/notes`);
                }}
                className={`p-2 rounded ${
                  isDarkMode
                    ? "bg-purple-700 hover:bg-purple-800"
                    : "bg-purple-500 hover:bg-purple-600"
                } text-white`}
              >
                View Notes
              </button>
              <button
              onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  navigate(`/courses/${course._id}/add-notes`);
                }}
                className={`p-2 rounded ${
                  isDarkMode
                    ? "bg-yellow-700 hover:bg-yellow-800"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white`}
              >
                Add Notes
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  navigate(`/courses/${course._id}/edit`);
                }}
                className={`p-2 rounded ${
                  isDarkMode
                    ? "bg-blue-700 hover:bg-blue-800"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                Update Course
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click from triggering
                  handleDelete(course._id);
                }}
                className={`p-2 rounded ${
                  isDarkMode
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600"
                } text-white`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
