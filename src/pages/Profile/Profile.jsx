import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import { getCoursesFromLocalStorage } from "../../dataService";
import { FaGlobe, FaLinkedin, FaGithub, FaMedium } from "react-icons/fa";

const Profile = () => {
  const { theme } = useTheme();
  const [courses, setCourses] = useState([]);
  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);
  const isDarkMode = theme === "dark";
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    avatarUrl: "", // Placeholder for user avatar
    socialLinks: {
      portfolio: "", // Default empty string to avoid undefined errors
      linkedin: "",
      github: "",
      medium: "",
    },
  });

  useEffect(() => {
    setIsLoading(true); // Set loading to true when fetching starts

    // Function to get courses from localStorage
    const fetchCoursesFromLocalStorage = () => {
      try {
        const storedCourses = getCoursesFromLocalStorage(); // Get courses from localStorage

        if (storedCourses.length > 0) {
          // If courses are found in localStorage, update state
          setCourses(storedCourses);

          // Count completed courses
          const completedCount = storedCourses.filter(
            (course) => course.status === "Completed"
          ).length;
          setCompletedCoursesCount(completedCount);
        } else {
          console.error("No courses found in localStorage.");
        }
      } catch (error) {
        console.error("Error fetching courses from localStorage:", error);
      } finally {
        setIsLoading(false); // Set loading to false when fetching completes
      }
    };

    fetchCoursesFromLocalStorage(); // Call function to fetch data from localStorage
  }, []);

  // Key for localStorage
  const localStorageKey = "userProfile";

  // Save data to localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  // Load data from localStorage
  const loadFromLocalStorage = () => {
    const storedData = localStorage.getItem(localStorageKey);
    return storedData ? JSON.parse(storedData) : null;
  };

  // Simulate fetching user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);

        // Check localStorage for user data
        const storedData = loadFromLocalStorage();
        if (storedData) {
          setUser(storedData);
        } else {
          // Simulate fetching user data (replace with actual API call)
          const userData = {
            name: "Rohan Mistry",
            email: "rohanmistry231@gmail.com",
            bio: "A passionate learner exploring the world of technology.",
            avatarUrl: "profile.jpg", // Example avatar URL
            socialLinks: {
              portfolio: "https://irohanportfolio.netlify.app",
              linkedin: "https://linkedin.com/in/rohan-mistry-493987202",
              github: "https://github.com/rohanmistry231",
              medium: "https://medium.com/@rohanmistry231",
            },
          };

          // Set user data and save to localStorage
          setUser(userData);
          saveToLocalStorage(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div
      className={`min-h-screen p-6 mt-14 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Profile Card */}
      <div
        className={`max-w-8xl mx-auto rounded-lg shadow-lg p-6 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="flex items-center space-x-4">
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-24 h-24 rounded-full object-cover"
                loading="lazy" // Lazy loading added here
              />
              <div>
                <h1 className="text-3xl font-semibold">{user.name}</h1>
                <a
                  href="mailto:rohanmistry231@gmail.com"
                  className="text-sm text-gray-500"
                >
                  {user.email}
                </a>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold">Bio</h2>
              <p
                className={`text-lg ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } mt-2`}
              >
                {user.bio}
              </p>
            </div>

            {/* Additional Information Section */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Progress Overview</h3>
                <Link to="/progress">
                  <button className="px-4 py-2 rounded-md bg-blue-500 text-white">
                    View Full Progress
                  </button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {/* Total Courses Card */}
                <div
                  className={`p-4 rounded-md shadow-md ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <h4 className="text-lg font-medium">Total Courses</h4>
                  <p className="text-2xl font-semibold mt-2">
                    {courses.length}
                  </p>
                </div>

                {/* Completed Courses Card */}
                <div
                  className={`p-4 rounded-md shadow-md ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                  }`}
                >
                  <h4 className="text-lg font-medium">Completed Courses</h4>
                  <p className="text-2xl font-semibold mt-2">
                    {completedCoursesCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h3 className="text-lg font-medium">Social Media Links</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <a
                  href={user.socialLinks.portfolio || "#"}
                  className={`text-xl text-center flex flex-col items-center ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGlobe className="w-6 h-6 mb-2" />
                  Portfolio
                </a>
                <a
                  href={user.socialLinks.linkedin || "#"}
                  className={`text-xl text-center flex flex-col items-center ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaLinkedin className="w-6 h-6 mb-2" />
                  LinkedIn
                </a>
                <a
                  href={user.socialLinks.github || "#"}
                  className={`text-xl text-center flex flex-col items-center ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-6 h-6 mb-2" />
                  GitHub
                </a>
                <a
                  href={user.socialLinks.medium || "#"}
                  className={`text-xl text-center flex flex-col items-center ${isDarkMode ? "text-blue-300" : "text-blue-600"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaMedium className="w-6 h-6 mb-2" />
                  Medium
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
