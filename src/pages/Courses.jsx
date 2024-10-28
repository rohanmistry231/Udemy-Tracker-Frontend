// src/pages/Courses.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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
    <div className="container mx-auto px-4 py-6 mt-10">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          className="border border-gray-300 p-2 rounded w-full mr-2 h-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/add-course" className="w-full sm:w-auto">
          <button
            type="button"
            className="bg-blue-500 text-white rounded h-12 w-full sm:w-32 transition duration-200 hover:bg-blue-600 flex items-center justify-center"
          >
            Add Course
          </button>
        </Link>
      </div>

      <h2 className="text-2xl mb-4">Courses List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="font-bold text-lg">{course.name}</h3>
            <p className="text-gray-600">Category: {course.category}</p>
            <p className="text-gray-600">Status: {course.status}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => navigate(`/courses/${course._id}/view`)}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                View Course
              </button>
              <button
                onClick={() => navigate(`/courses/${course._id}/notes`)} // Link to View Notes
                className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
              >
                View Notes
              </button>
              <button
                onClick={() => navigate(`/courses/${course._id}/add-notes`)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Add Notes
              </button>
              <button
                onClick={() => navigate(`/courses/${course._id}/edit`)}
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              >
                Update Course
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
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
