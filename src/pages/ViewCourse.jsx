import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const ViewCourse = () => {
  const { id } = useParams(); // Get course ID from URL params
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === 'dark'; // Determine if dark mode is active
  const [course, setCourse] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [mainTargetCategory, setMainTargetCategory] = useState('');
  const [mainTargetGoal, setMainTargetGoal] = useState('');
  const [subTargetGoal, setSubTargetGoal] = useState('');

  // Fetch course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/courses/${id}`);
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };
    fetchCourse();
  }, [id]);

  // Handle deleting a note with confirmation
  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://udemy-tracker.vercel.app/courses/${id}/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCourse((prevCourse) => ({
          ...prevCourse,
          notes: prevCourse.notes.filter((note) => note._id !== noteId),
        }));
      } else {
        console.error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  // Set the note fields to be edited
  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setQuestion(note.question);
    setAnswer(note.answer);
    setMainTargetCategory(note.mainTargetCategory);
    setMainTargetGoal(note.mainTargetGoal);
    setSubTargetGoal(note.subTargetGoal || '');
  };

  // Handle updating the edited note
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://udemy-tracker.vercel.app/courses/${id}/notes/${editingNote}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, mainTargetCategory, mainTargetGoal, subTargetGoal }),
      });
      
      if (response.ok) {
        const updatedNote = await response.json();
        setCourse((prevCourse) => ({
          ...prevCourse,
          notes: prevCourse.notes.map((note) =>
            note._id === editingNote ? updatedNote.note : note
          ),
        }));
        setEditingNote(null); // Exit edit mode
        setQuestion('');
        setAnswer('');
        setMainTargetCategory('');
        setMainTargetGoal('');
        setSubTargetGoal('');
      } else {
        console.error('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

    // Handle deleting all notes with confirmation
    const handleDeleteAllNotes = async () => {
      const confirmed = window.confirm('Are you sure you want to delete all notes for this course?');
      if (!confirmed) return;
  
      try {
        const response = await fetch(`https://udemy-tracker.vercel.app/notes/deleteAllNotes/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setCourse((prevCourse) => ({
            ...prevCourse,
            notes: [],
          }));
        } else {
          console.error('Failed to delete all notes');
        }
      } catch (error) {
        console.error('Error deleting all notes:', error);
      }
    };

  if (!course) return <p>Loading course details...</p>;

  return (
    <div className={`container mx-auto px-4 py-8 mt-10 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className={`rounded-lg shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <h2 className="text-4xl font-bold mb-4">{course.name}</h2>
        
        {/* Course Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="text-2xl font-semibold mb-2">Course Details</h3>
            <p><strong>Course Number:</strong> {course.no}</p>
            <p><strong>Category:</strong> {course.category}</p>
            <p><strong>Priority:</strong> {course.categoryPriority}</p>
            <p><strong>Sub-Category:</strong> {course.subCategory}</p>
            <p><strong>Sub-Sub-Category:</strong> {course.subSubCategory}</p>
          </div>
          <div className={`p-4 rounded-lg shadow ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h3 className="text-2xl font-semibold mb-2">Additional Info</h3>
            <p><strong>Important Status:</strong> {course.importantStatus}</p>
            <p><strong>Status:</strong> {course.status}</p>
            <p><strong>Duration (Hours):</strong> {course.durationInHours}</p>
            <p><strong>Learning Skills Set:</strong> {course.learningSkillsSet}</p>
            <p><strong>Date Added:</strong> {new Date(course.dateAdded).toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="mt-8">
  <h3 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Notes</h3>
  {course.notes.length > 0 ? (
    <ul className="space-y-4">
      {course.notes.map((note) => (
        <li
          key={note._id}
          className={`border p-4 rounded shadow ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-gray-100 border-gray-200 text-black'}`}
        >
          {editingNote === note._id ? (
            // Edit form for the selected note
            <form onSubmit={handleUpdate} className="flex flex-col space-y-2 w-full">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Question"
                className={`p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                required
              />
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Answer"
                className={`p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
                required
              ></textarea>
              <input
                type="text"
                value={mainTargetCategory}
                onChange={(e) => setMainTargetCategory(e.target.value)}
                placeholder="Main Target Goal"
                className={`p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
              <input
                type="text"
                value={mainTargetGoal}
                onChange={(e) => setMainTargetGoal(e.target.value)}
                placeholder="Target Goal"
                className={`p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
              <input
                type="text"
                value={subTargetGoal}
                onChange={(e) => setSubTargetGoal(e.target.value)}
                placeholder="Sub Target Goal"
                className={`p-2 border rounded ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'}`}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="text-red-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Display note and actions
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p><strong>Q:</strong> {note.question}</p>
                <p><strong>A:</strong> {note.answer}</p>
                <p><strong>Main Target Category:</strong> {note.mainTargetCategory}</p>
                <p><strong>Main Target Goal:</strong> {note.mainTargetGoal}</p>
                <p><strong>Sub Target Goal:</strong> {note.subTargetGoal}</p>
              </div>
              <div className="flex space-x-2 sm:space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEditClick(note)}
                  className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className={`px-4 py-2 rounded ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  ) : (
    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No notes available for this course.</p>
  )}
</div>




        {/* Course and Notes Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link to={`/courses/${course._id}/edit`} className={`px-4 py-2 rounded ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}>
            Edit Course
          </Link>
          <Link to={`/courses/${course._id}/add-notes`} className={`px-4 py-2 rounded ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}>
            Add Note
          </Link>
          {/* Delete All Notes Button */}
          <div className="flex justify-end">
            <button
              onClick={handleDeleteAllNotes}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Delete All Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourse;
