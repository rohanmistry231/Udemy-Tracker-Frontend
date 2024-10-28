// src/pages/ViewNotes.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ViewNotes = () => {
  const { id } = useParams(); // Get course ID from URL
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
    <div className="container mx-auto px-4 py-6 mt-10">
      <h2 className="text-2xl mb-4">Notes</h2>
      <ul className="space-y-4">
        {notes.length > 0 ? (
          notes.map((note, index) => (
            <li key={index} className="border-b py-4">
              <h3 className="font-bold text-lg">{note.question}</h3>
              <p className="text-gray-600">{note.answer}</p>
            </li>
          ))
        ) : (
          <p>No notes available for this course.</p>
        )}
      </ul>
      <Link to="/courses" className="text-blue-500 mb-4 inline-block mt-4">
        Back to Courses
      </Link>
    </div>
  );
};

export default ViewNotes;
