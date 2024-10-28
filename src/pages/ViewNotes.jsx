// src/pages/ViewNotes.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import theme context

const ViewNotes = () => {
  const { id } = useParams(); // Get course ID from URL
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === 'dark'; // Check if dark mode is enabled
  const [notes, setNotes] = useState([]);

  // Fetch notes for the specific course
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${id}/notes`);
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, [id]);

  return (
    <div className={`container mx-auto px-4 py-6 mt-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl mb-4">Notes</h2>
        <ul className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note, index) => (
              <li key={index} className={`border-b py-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                <h3 className="font-bold text-lg">{note.question}</h3>
                <p className="text-gray-600">{note.answer}</p>
              </li>
            ))
          ) : (
            <p>No notes available for this course.</p>
          )}
        </ul>
        <Link 
          to="/courses" 
          className={`inline-block mt-4 px-4 py-2 rounded-lg shadow-lg transition-transform transform font-semibold ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
          Back to Courses
        </Link>
      </div>
    </div>
  );
};

export default ViewNotes;
