// src/pages/Courses.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import theme context

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === 'dark';

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on the search term
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle course deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await fetch(`http://localhost:5000/courses/${id}`, {
          method: 'DELETE',
        });
        setCourses(prevCourses => prevCourses.filter(course => course._id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <div className={`container mx-auto px-4 py-6 mt-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          className={`border p-2 rounded w-full mr-2 h-12 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-black border-gray-300'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/add-course" className="w-full sm:w-auto">
          <button
            type="button"
            className={`rounded h-12 w-full sm:w-32 transition duration-200 flex items-center justify-center ${
              isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Add Course
          </button>
        </Link>
      </div>

      <h2 className={`text-2xl mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Courses List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div
            key={course._id}
            className={`shadow-md rounded-lg p-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
          >
            <h3 className="font-bold text-lg">{course.name}</h3>
            <p className={`text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category: {course.category}</p>
            <p className={`text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status: {course.status}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => navigate(`/courses/${course._id}/view`)}
                className={`p-2 rounded ${isDarkMode ? 'bg-green-700 hover:bg-green-800' : 'bg-green-500 hover:bg-green-600'} text-white`}
              >
                View Course
              </button>
              <button
                onClick={() => navigate(`/courses/${course._id}/notes`)}
                className={`p-2 rounded ${isDarkMode ? 'bg-purple-700 hover:bg-purple-800' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
              >
                View Notes
              </button>
              <button
                onClick={() => navigate(`/courses/${course._id}/add-notes`)}
                className={`p-2 rounded ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
              >
                Add Notes
              </button>
              <button
                onClick={() => navigate(`/courses/${course._id}/edit`)}
                className={`p-2 rounded ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                Update Course
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className={`p-2 rounded ${isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'} text-white`}
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
