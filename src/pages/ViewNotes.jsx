// src/pages/ViewNotes.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import theme context

const ViewNotes = () => {
  const { id } = useParams(); // Get course ID from URL
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === 'dark'; // Check if dark mode is enabled
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null); // Track the note being edited
  const [question, setQuestion] = useState(''); // State for editing question
  const [answer, setAnswer] = useState(''); // State for editing answer

  // Fetch notes for the specific course
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/courses/${id}/notes`);
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

  // Delete a specific note
  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/courses/${id}/notes/${noteId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete note');
        }
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  // Enable edit mode and pre-fill form with note details
  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setQuestion(note.question);
    setAnswer(note.answer);
  };

  // Update a specific note
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://udemy-tracker.vercel.app/courses/${id}/notes/${editingNote}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question, answer }),
      });
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      const updatedNote = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === editingNote ? updatedNote.note : note))
      );
      setEditingNote(null); // Exit edit mode
      setQuestion(''); // Clear form fields
      setAnswer('');
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  return (
    <div className={`container mx-auto px-4 py-6 mt-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`shadow-md rounded-lg p-6 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl mb-4">Notes</h2>
        <ul className="space-y-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <li
                key={note._id}
                className={`border-b py-4 flex justify-between items-start ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}
              >
                {editingNote === note._id ? (
                  // Edit form for the selected note
                  <form onSubmit={handleUpdate} className={`flex flex-col space-y-2 w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Question"
                      className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    />
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Answer"
                      className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                    ></textarea>
                    <button
                      type="submit"
                      className={`p-2 rounded ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingNote(null)}
                      className="text-red-500 mt-2"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  // Display note and actions
                  <>
                    <div>
                      <h3 className="font-bold text-lg">{note.question}</h3>
                      <p className="text-gray-600">{note.answer}</p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(note)}
                        className={`p-2 rounded transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className={`p-2 rounded transition-transform transform hover:scale-105 ${isDarkMode ? 'bg-red-700 hover:bg-red-800' : 'bg-red-500 hover:bg-red-600'} text-white`}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <p>No notes available for this course.</p>
          )}
        </ul>
        <Link
          to="/courses"
          className={`inline-block mt-4 px-4 py-2 rounded-lg shadow-lg transition-transform transform font-semibold ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Back to Courses
        </Link>
      </div>
    </div>
  );
};

export default ViewNotes;
