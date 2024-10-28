// src/pages/AddNotes.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/courses/${id}`);
        const data = await response.json();
        setCourseName(data.name);
      } catch (error) {
        console.error('Error fetching course name:', error);
      }
    };

    fetchCourseName();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/courses/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer }), // Send both question and answer
      });
      navigate(`/courses/${id}/view`); // Redirect after adding the note
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Add Notes for {courseName}</h2>
      <form onSubmit={handleAddNote} className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 w-full h-24"
          placeholder="Enter your question..."
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border p-2 w-full h-24"
          placeholder="Enter your answer..."
        />

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNotes;
