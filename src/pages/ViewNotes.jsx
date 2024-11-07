import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import theme context
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ViewNotes = () => {
  const { id } = useParams(); // Get course ID from URL
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === 'dark'; // Check if dark mode is enabled
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null); // Track the note being edited
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [mainTargetCategory, setMainTargetCategory] = useState('');
  const [mainTargetGoal, setMainTargetGoal] = useState('');
  const [subTargetGoal, setSubTargetGoal] = useState('');
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "12345"; // Define the correct password here
    if (password === correctPassword) {
      setIsAuthorized(true);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  // Fetch notes for the specific course
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/courses/${id}/notes`);
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const data = await response.json();
        setNotes(data.notes); // Update to use the 'notes' property from the response
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast.error('Failed to load notes. Please try again later.');
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
        toast.success('Note deleted successfully');
      } catch (error) {
        console.error('Error deleting note:', error);
        toast.error('Failed to delete note. Please try again later.');
      }
    }
  };

  // Enable edit mode and pre-fill form with note details
  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setQuestion(note.question);
    setAnswer(note.answer);
    setMainTargetCategory(note.mainTargetCategory);
    setMainTargetGoal(note.mainTargetGoal || ''); // Ensure it’s initialized
    setSubTargetGoal(note.subTargetGoal || ''); // Ensure it’s initialized
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
        body: JSON.stringify({ question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal }),
      });
      if (!response.ok) {
        throw new Error('Failed to update note');
      }
      const updatedNote = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === editingNote ? updatedNote.note : note))
      );
      toast.success('Note updated successfully');
      setEditingNote(null); // Exit edit mode
      setQuestion('');
      setAnswer('');
      setMainTargetCategory('');
      setMainTargetGoal('');
      setSubTargetGoal('');
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note. Please try again later.');
    }
  };

  return (
    <div className={`container mx-auto px-4 py-6 mt-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {!isAuthorized ? (
        <form
          onSubmit={handlePasswordSubmit}
          className={`p-6 rounded shadow-md ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
        >
          <label htmlFor="password" className="block mb-2">
            🔒 Prove You're Worthy! Enter the Secret Code:
          </label>
          <input
            type="password"
            id="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border p-2 rounded w-full ${isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mt-4"
          >
            Submit
          </button>
        </form>
      ) : (
        <>
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
                          required
                        />
                        <textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Answer"
                          className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                          required
                        ></textarea>
                        <input
                          type="text"
                          value={mainTargetCategory}
                          onChange={(e) => setMainTargetCategory(e.target.value)}
                          placeholder="Main Target Goal"
                          className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                          required
                        />
                        <input
                          type="text"
                          value={mainTargetGoal}
                          onChange={(e) => setMainTargetGoal(e.target.value)}
                          placeholder="Target Goal"
                          className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                        />
                        <input
                          type="text"
                          value={subTargetGoal}
                          onChange={(e) => setSubTargetGoal(e.target.value)}
                          placeholder="Sub Target Goal"
                          className={`p-2 rounded border ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
                        />
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
                          <p className="text-gray-600">Main Target Goal: {note.mainTargetCategory}</p>
                          <p className="text-gray-600">Target Goal: {note.mainTargetGoal || 'N/A'}</p>
                          <p className="text-gray-600">Sub Target Goal: {note.subTargetGoal || 'N/A'}</p>
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleEditClick(note)}
                            className={`text-blue-500 ${isDarkMode ? 'hover:text-blue-300' : 'hover:text-blue-700'}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className={`text-red-500 ${isDarkMode ? 'hover:text-red-300' : 'hover:text-red-700'}`}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No notes available.</li>
              )}
            </ul>
            <Link to={`/courses/${id}/add-notes`} className="mt-4 inline-block text-blue-500">
              Add a new note
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewNotes;
