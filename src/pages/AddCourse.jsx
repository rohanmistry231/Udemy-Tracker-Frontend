// src/pages/AddCourse.js
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast

const AddCourse = ({ onAdd }) => {
  const [courseData, setCourseData] = useState({
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourseData((prevData) => ({
      ...prevData,
      [name]: 
        name === 'subLearningSkillsSet' 
          ? value.split(',').map((skill) => skill.trim()) // Convert comma-separated input into array
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert 'no' and 'durationInHours' to numbers if they're not empty
    const preparedData = {
      ...courseData,
      no: courseData.no ? parseInt(courseData.no, 10) : '',
      durationInHours: courseData.durationInHours 
        ? parseFloat(courseData.durationInHours) 
        : '',
    };

    try {
      const response = await fetch('http://localhost:5000/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedData),
      });

      if (response.ok) {
        const newCourse = await response.json();
        onAdd(newCourse);

        // Show success toast
        toast.success('Course added successfully!', {
          position: 'bottom-right',
          autoClose: 3000,
        });

        // Reset form
        setCourseData({
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
      } else {
        console.error('Failed to add course:', response.statusText);
        toast.error('Failed to add course!', { position: 'bottom-right' });
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast.error('Error adding course!', { position: 'bottom-right' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-2" htmlFor="no">Course No:</label>
          <input
            type="number"
            id="no"
            name="no"
            value={courseData.no}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="name">Course Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="category">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={courseData.category}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="categoryPriority">Category Priority:</label>
          <select
            id="categoryPriority"
            name="categoryPriority"
            value={courseData.categoryPriority}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="High priority">High priority</option>
            <option value="Medium priority">Medium priority</option>
            <option value="Low priority">Low priority</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="subCategory">Sub Category:</label>
          <input
            type="text"
            id="subCategory"
            name="subCategory"
            value={courseData.subCategory}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="subSubCategory">Sub Sub Category:</label>
          <input
            type="text"
            id="subSubCategory"
            name="subSubCategory"
            value={courseData.subSubCategory}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="importantStatus">Important Status:</label>
          <select
            id="importantStatus"
            name="importantStatus"
            value={courseData.importantStatus}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="Important">Important</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={courseData.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="Not Started Yet">Not Started Yet</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="durationInHours">Duration (in hours):</label>
          <input
            type="number"
            id="durationInHours"
            name="durationInHours"
            value={courseData.durationInHours}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
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
            value={courseData.subLearningSkillsSet.join(', ')}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2" htmlFor="learningSkillsSet">Learning Skills Set:</label>
          <input
            type="text"
            id="learningSkillsSet"
            name="learningSkillsSet"
            value={courseData.learningSkillsSet}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Course
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AddCourse;
