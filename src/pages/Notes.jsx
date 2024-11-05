import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Import theme context

const Notes = () => {
  const [courses, setCourses] = useState([]); // Initialize courses as an empty array
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Fetch all courses and their notes from backend
  useEffect(() => {
    const fetchCoursesWithNotes = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://udemy-tracker.vercel.app/courses");
        const data = await response.json();

        // Ensure that data is an array
        if (Array.isArray(data)) {
          const coursesWithNotes = await Promise.all(
            data.map(async (course) => {
              const notesResponse = await fetch(`https://udemy-tracker.vercel.app/courses/${course._id}/notes`);
              const notes = await notesResponse.json();
              return { ...course, notes }; // Merge course data with its notes
            })
          );
          setCourses(coursesWithNotes);
        } else {
          console.error("Unexpected response format:", data);
          setCourses([]); // Set to empty array if data is not an array
        }
      } catch (error) {
        console.error("Error fetching courses or notes:", error);
        setCourses([]); // Set to empty array in case of error
      } finally {
        setLoading(false);
      }
    };
    fetchCoursesWithNotes();
  }, []); // Fetch data once on component mount

  // Filtered notes based on search term
  const filteredNotes = courses.flatMap(course => 
    course.notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    ).map(note => ({ ...note, courseId: course._id, courseName: course.title }))
  );

  // Calculate indices for pagination
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  return (
    <div className={`container mx-auto px-4 py-6 mt-12 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}>
      <h2 className={`text-3xl font-semibold mb-6 text-center ${isDarkMode ? "text-white" : "text-gray-800"}`}>
        📝 All Notes 📝
      </h2>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Search Field */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search notes by title or content..."
              className={`border p-2 rounded w-full h-12 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Notes List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {currentNotes.map(note => (
              <div
                key={note._id}
                onClick={() => navigate(`/notes/${note._id}/view`)}
                className={`shadow-md rounded-lg p-4 cursor-pointer ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
              >
                <h3 className="font-bold text-lg">{note.title}</h3>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Course: {note.courseName}</p>
                <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Content: {note.content}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/notes/${note._id}/edit`); }} className={`p-2 rounded ${isDarkMode ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-500 hover:bg-blue-600"} text-white`}>Edit Note</button>
                  <button onClick={(e) => { e.stopPropagation(); /* handle delete logic here */ }} className={`p-2 rounded ${isDarkMode ? "bg-red-700 hover:bg-red-800" : "bg-red-500 hover:bg-red-600"} text-white`}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Notes;
    