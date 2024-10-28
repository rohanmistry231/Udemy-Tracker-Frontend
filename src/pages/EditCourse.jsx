// src/pages/EditCourse.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../context/ThemeContext'; // Import theme context

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === 'dark'; // Check if dark mode is enabled
  const [course, setCourse] = useState({
    no: '',
    name: '',
    category: '',
    categoryPriority: 'Medium priority',
    subCategory: '',
    subSubCategory: '',
    importantStatus: 'Normal',
    status: 'Not Started Yet',
    durationInHours: '',
    subLearningSkillsSet: [],
    learningSkillsSet: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Error fetching course data');
      }
    };
    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  const handleSkillsChange = (e) => {
    setCourse({ ...course, subLearningSkillsSet: e.target.value.split(',') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      toast.success('Course updated successfully!');
      navigate(`/courses/${id}/view`); // Redirect to updated course view
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Error updating course data');
    }
  };

  return (
    <div className={`container mx-auto px-4 py-6 mt-8 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-3xl font-bold mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="no"
            value={course.no}
            onChange={handleChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            placeholder="Course Number"
          />
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            placeholder="Course Name"
            required
          />
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            placeholder="Category"
            required
          />
          <select
            name="categoryPriority"
            value={course.categoryPriority}
            onChange={handleChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          >
            <option value="High priority">High priority</option>
            <option value="Medium priority">Medium priority</option>
            <option value="Low priority">Low priority</option>
          </select>
          <input
            type="text"
            name="subCategory"
            value={course.subCategory}
            onChange={handleChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            placeholder="Sub-Category"
          />
          <input
            type="text"
            name="subSubCategory"
            value={course.subSubCategory}
            onChange={handleChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            placeholder="Sub-Sub-Category"
          />
          <select
            name="importantStatus"
            value={course.importantStatus}
            onChange={handleChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
          >
            <option value="Important">Important</option>
            <option value="Normal">Normal</option>
          </select>
          <input
            type="text"
            name="subLearningSkillsSet"
            value={course.subLearningSkillsSet.join(',')}
            onChange={handleSkillsChange}
            className={`border p-2 w-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            placeholder="Sub Learning Skills Set (comma-separated)"
          />
          <button type="submit" className={`bg-blue-500 text-white p-2 rounded ${isDarkMode ? 'hover:bg-blue-600' : 'hover:bg-blue-400'}`}>
            Update Course
          </button>
        </form>
        <Link 
          to={`/courses/${id}/view`} 
          className={`inline-block mt-4 px-4 py-2 rounded shadow-md font-semibold transition-transform transform ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
          Back to Course
        </Link>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditCourse;
