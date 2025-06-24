// src/pages/EditCourse.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/ThemeContext";
import { updateCourse } from "../../dataService";
import { categories, targetGoals as subCategories } from "../../db";

const EditCourse = () => {
  const correctPassword = "12345";
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [course, setCourse] = useState({
    no: "",
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

  useEffect(() => {
    const fetchCourse = async () => {
      // Check if the course data exists in localStorage
      const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
      const courseFromLocalStorage = storedCourses.find(
        (course) => course.id === id
      );

      if (courseFromLocalStorage) {
        // If the course is found in localStorage, use it
        setCourse(courseFromLocalStorage);
      } else {
        // If the course is not found, fetch it from the API
        try {
          const response = await fetch(
            `https://udemy-tracker.vercel.app/courses/${id}`
          );
          const data = await response.json();
          setCourse(data);

          // After fetching from the API, save it in localStorage
          storedCourses.push(data);
          localStorage.setItem("courses", JSON.stringify(storedCourses));
          const storedPassword = localStorage.getItem("password");
          if (storedPassword === correctPassword) {
            setIsAuthorized(true);
          }
        } catch (error) {
          console.error("Error fetching course:", error);
          toast.error("Error fetching course data");
        }
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setCourse({ ...course, category: e.target.value, subCategory: "" });
  };

  const handleSkillsChange = (e) => {
    setCourse({
      ...course,
      subLearningSkillsSet: e.target.value
        .split(",")
        .map((skill) => skill.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call the updateCourse function from dataService without assigning it to a variable
      await updateCourse(id, course);

      // Show success toast
      toast.success("Course updated successfully!");

      // Navigate to the course view page
      navigate(`/courses/${id}/view`);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error("Error updating course data");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem("password", password); // Store the password in localStorage
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
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
            autoFocus
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
          <div
            className={`shadow-md rounded-lg p-6 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-3xl font-bold mb-4">Edit Course</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="no" className="block mb-2">
                  Course No:
                </label>
                <input
                  type="number"
                  id="no"
                  name="no"
                  value={course.no}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2">
                  Course Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={course.name}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block mb-2">
                  Category:
                </label>
                <select
                  id="category"
                  name="category"
                  value={course.category}
                  onChange={handleCategoryChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  required
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
                <label htmlFor="subCategory" className="block mb-2">
                  Sub Category:
                </label>
                <select
                  id="subCategory"
                  name="subCategory"
                  value={course.subCategory}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  required
                >
                  <option value="">Select a sub-category</option>
                  {course.category &&
                    subCategories[course.category]?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="subSubCategory" className="block mb-2">
                  Sub-Sub Category:
                </label>
                <input
                  type="text"
                  id="subSubCategory"
                  name="subSubCategory"
                  value={course.subSubCategory}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="categoryPriority" className="block mb-2">
                  Category Priority:
                </label>
                <select
                  id="categoryPriority"
                  name="categoryPriority"
                  value={course.categoryPriority}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <option value="High priority">High priority</option>
                  <option value="Medium priority">Medium priority</option>
                  <option value="Low priority">Low priority</option>
                  <option value="Parallel priority">Parallel priority</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="importantStatus" className="block mb-2">
                  Important Status:
                </label>
                <select
                  id="importantStatus"
                  name="importantStatus"
                  value={course.importantStatus}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <option value="Very Important">Very Important</option>
                  <option value="Important">Important</option>
                  <option value="Not Important">Not Important</option>
                  <option value="Extra">Extra</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block mb-2">
                  Status:
                </label>
                <select
                  id="status"
                  name="status"
                  value={course.status}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <option value="Not Started Yet">Not Started Yet</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="durationInHours" className="block mb-2">
                  Duration in Hours:
                </label>
                <input
                  type="number"
                  id="durationInHours"
                  name="durationInHours"
                  value={course.durationInHours}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="subLearningSkillsSet" className="block mb-2">
                  Sub Learning Skills Set (comma-separated):
                </label>
                <input
                  type="text"
                  id="subLearningSkillsSet"
                  name="subLearningSkillsSet"
                  value={course.subLearningSkillsSet.join(", ")}
                  onChange={handleSkillsChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="learningSkillsSet" className="block mb-2">
                  Learning Skills Set:
                </label>
                <input
                  type="text"
                  id="learningSkillsSet"
                  name="learningSkillsSet"
                  value={course.learningSkillsSet}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Update Course
                </button>
                <Link
                  to={`/courses/${id}/view`}
                  className="text-gray-600 hover:underline"
                >
                  Cancel
                </Link>
                <Link
                  to="/courses"
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
                >
                  Back to Courses
                </Link>
              </div>
            </form>
          </div>
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default EditCourse;
