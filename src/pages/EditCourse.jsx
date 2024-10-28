// src/pages/EditCourse.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      navigate(`/courses/${id}/view`); // Redirect to updated course view
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-8">
      <h2 className="text-3xl font-bold mb-4">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="no"
          value={course.no}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Course Number"
        />
        <input
          type="text"
          name="name"
          value={course.name}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Course Name"
        />
        <input
          type="text"
          name="category"
          value={course.category}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Category"
        />
        <select
          name="categoryPriority"
          value={course.categoryPriority}
          onChange={handleChange}
          className="border p-2 w-full"
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
          className="border p-2 w-full"
          placeholder="Sub-Category"
        />
        <input
          type="text"
          name="subSubCategory"
          value={course.subSubCategory}
          onChange={handleChange}
          className="border p-2 w-full"
          placeholder="Sub-Sub-Category"
        />
        <select
          name="importantStatus"
          value={course.importantStatus}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="Important">Important</option>
          <option value="Normal">Normal</option>
        </select>
        <input
          type="text"
          name="subLearningSkillsSet"
          value={course.subLearningSkillsSet.join(',')}
          onChange={handleSkillsChange}
          className="border p-2 w-full"
          placeholder="Sub Learning Skills Set (comma-separated)"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
