// src/pages/ViewCourse.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ViewCourse = () => {
  const { id } = useParams(); // Get course ID from URL params
  const [course, setCourse] = useState(null);

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

  if (!course) return <p>Loading course details...</p>;

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <h2 className="text-4xl font-bold mb-6">{course.name}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><strong>Course Number:</strong> {course.no}</p>
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Priority:</strong> {course.categoryPriority}</p>
          <p><strong>Sub-Category:</strong> {course.subCategory}</p>
          <p><strong>Sub-Sub-Category:</strong> {course.subSubCategory}</p>
        </div>
        
        <div>
          <p><strong>Important Status:</strong> {course.importantStatus}</p>
          <p><strong>Status:</strong> {course.status}</p>
          <p><strong>Duration (Hours):</strong> {course.durationInHours}</p>
          <p><strong>Learning Skills Set:</strong> {course.learningSkillsSet}</p>
          <p><strong>Date Added:</strong> {new Date(course.dateAdded).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-2xl font-bold mb-2">Sub Learning Skills Set:</h3>
        <ul className="list-disc ml-6">
          {course.subLearningSkillsSet.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Notes</h3>
        {course.notes.length > 0 ? (
          <ul className="space-y-4">
            {course.notes.map((note, index) => (
              <li key={index} className="border p-4 rounded shadow">
                <p><strong>Q:</strong> {note.question}</p>
                <p><strong>A:</strong> {note.answer}</p>
                <p className="text-sm text-gray-500">
                  Added on: {new Date(note.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes available for this course.</p>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link to={`/edit-course/${id}`} className="bg-blue-500 text-white p-2 rounded">
          Edit Course
        </Link>
        <Link to="/courses" className="bg-gray-500 text-white p-2 rounded">
          Back to Courses
        </Link>
      </div>
    </div>
  );
};

export default ViewCourse;
