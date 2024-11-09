import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext"; // Import theme context

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const [statusFilter, setStatusFilter] = useState(""); // Filter by course status
  const [importantFilter, setImportantFilter] = useState(""); // Filter by important status
  const [sortOrder, setSortOrder] = useState(""); // Sorting order
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );
  const [categoryFilter, setCategoryFilter] = useState(""); // Filter by category
  const [subCategoryFilter, setSubCategoryFilter] = useState(""); // Filter by sub-category
  const coursesPerPage = 12; // Number of courses to display per page
  const [isPasswordPromptVisible, setPasswordPromptVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [courseToDelete, setCourseToDelete] = useState(null); // Store the course ID to delete

  const navigate = useNavigate();
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === "dark";

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://udemy-tracker.vercel.app/courses"
        );
        let data = await response.json();

        // Sort courses by 'no' field
        data = data.sort((a, b) => a.no - b.no);

        setCourses(data);
        localStorage.setItem("currentPage", currentPage);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();

    // Clear currentPage from localStorage on page reload
    const handlePageReload = () => {
      localStorage.removeItem("currentPage");
    };

    window.addEventListener("beforeunload", handlePageReload);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("beforeunload", handlePageReload);
    };
  }, [currentPage]);

  // Filtered list of sub-categories based on selected category
  const getSubCategories = () => {
    const selectedCategoryCourses = courses.filter(
      (course) => course.category === categoryFilter
    );
    const subCategories = selectedCategoryCourses.map(
      (course) => course.subCategory
    );
    return [...new Set(subCategories)];
  };

  // Filter and sort courses based on search term and selected filters
  const filteredCourses = courses
    .filter(
      (course) =>
        (course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.no.toString().includes(searchTerm)) && // Multi-search by name or 'no'
        (statusFilter === "" || course.status === statusFilter) &&
        (importantFilter === "" ||
          course.importantStatus === importantFilter) &&
        (categoryFilter === "" || course.category === categoryFilter) &&
        (subCategoryFilter === "" || course.subCategory === subCategoryFilter)
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") {
        return a.durationInHours - b.durationInHours; // Sort from low to high
      } else if (sortOrder === "highToLow") {
        return b.durationInHours - a.durationInHours; // Sort from high to low
      }
      return 0; // No sorting
    });

  // Handle course deletion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await fetch(`https://udemy-tracker.vercel.app/courses/${id}`, {
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

  // Calculate the index of the first course on the current page
  // Calculate pagination details
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

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
        📚 Courses List 📚
      </h2>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="Search by name or course number..."
          className={`border p-2 rounded w-full sm:w-1/3 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setSubCategoryFilter(""); // Reset sub-category when category changes
          }}
        >
          <option value="">All Categories</option>
          {/* Generate unique category options */}
          {[...new Set(courses.map((course) => course.category))].map(
            (category) => (
              <option key={category} value={category}>
                {category}
              </option>
            )
          )}
        </select>

        {/* Sub-category Filter */}
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={subCategoryFilter}
          onChange={(e) => setSubCategoryFilter(e.target.value)}
          disabled={!categoryFilter} // Disable if no category is selected
        >
          <option value="">All Sub-categories</option>
          {/* Render sub-categories based on selected category */}
          {getSubCategories().map((subCategory) => (
            <option key={subCategory} value={subCategory}>
              {subCategory}
            </option>
          ))}
        </select>

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

        {/* Sort Order Filter */}
        <select
          className={`border p-2 rounded w-full sm:w-1/6 h-12 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">Sort by Duration</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
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

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-10 mb-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
          {/* Courses List */}

          {isPasswordPromptVisible && (
            <div
              className={`fixed inset-0 flex justify-center items-center z-50 ${
                isDarkMode
                  ? "bg-black bg-opacity-70"
                  : "bg-gray-100 bg-opacity-50"
              }`}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // Check the password (replace 'yourSecretPassword' with your actual password)
                  if (password === "12345") {
                    handleDelete(courseToDelete); // Proceed with deletion
                    setPasswordPromptVisible(false); // Hide prompt
                    setPassword(""); // Clear password
                  } else {
                    // Optionally, handle incorrect password case (e.g., show a toast)
                    toast.error("Incorrect password!"); // Example using toast for error message
                  }
                }}
                className={`rounded shadow-md p-6 w-96 ${
                  isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <label
                  htmlFor="password"
                  className={`block mb-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  🔒 Prove You're Worthy! Enter the Secret Code for Deletion:
                </label>
                <input
                  type="password"
                  id="password"
                  autoFocus // Add autofocus here
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`border p-2 rounded w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded mt-4"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordPromptVisible(false)} // Close the prompt
                  className="bg-gray-300 text-black p-2 rounded mt-4 ml-2"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentCourses.map((course) => (
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
                  No: {course.no}
                </p>
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
                  Sub-category: {course.subCategory}
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
                    Edit Course
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      navigate(`/courses/${course._id}/notes`);
                    }}
                    className={`p-2 rounded ${
                      isDarkMode
                        ? "bg-yellow-700 hover:bg-yellow-800"
                        : "bg-yellow-500 hover:bg-yellow-600"
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
                        ? "bg-green-700 hover:bg-green-800"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    Add Notes
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering
                      setCourseToDelete(course._id); // Set the course ID to delete
                      setPasswordPromptVisible(true); // Show password prompt
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

export default Courses;
