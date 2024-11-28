import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; // Import theme context
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf"; // Import jsPDF
import { Editor } from "@tinymce/tinymce-react";
import html2canvas from "html2canvas";

const ViewNotes = () => {
  const correctPassword = "12345";
  const navigate = useNavigate();
  const { id } = useParams(); // Get course ID from URL
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === "dark"; // Check if dark mode is enabled
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null); // Track the note being edited
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [mainTargetCategory, setMainTargetCategory] = useState("");
  const [mainTargetGoal, setMainTargetGoal] = useState("");
  const [subTargetGoal, setSubTargetGoal] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState([]); // New state to track selected notes

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
        const response = await fetch(
          `https://udemy-tracker.vercel.app/courses/${id}/notes`
        );

        // Check if the response status is ok (200-299 range)
        if (!response.ok) {
          throw new Error(`Failed to fetch notes. Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the 'notes' field exists in the response and update state
        if (data && data.notes) {
          setNotes(data.notes);
        } else {
          throw new Error("Notes field is missing in the response.");
        }
        const storedPassword = localStorage.getItem("password");
        if (storedPassword === correctPassword) {
          setIsAuthorized(true);
        }
        // Extract unique subTargetGoals for filter dropdown
        const uniqueSubTargetGoals = [
          ...new Set(
            data.notes.map((note) => note.subTargetGoal).filter((goal) => goal)
          ),
        ];
        setSubTargetGoalOptions(uniqueSubTargetGoals);
      } catch (error) {
        // Log error details for debugging
        console.error("Error fetching notes:", error);

        // Display an error message to the user
        toast.error("Failed to load notes. Please try again later.");
      }
    };

    // Call fetchNotes whenever 'id' changes
    fetchNotes();
  }, [id]);

  // Delete a specific note
  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        const response = await fetch(
          `https://udemy-tracker.vercel.app/courses/${id}/notes/${noteId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete note");
        }
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note._id !== noteId)
        );
        toast.success("Note deleted successfully");
      } catch (error) {
        console.error("Error deleting note:", error);
        toast.error("Failed to delete note. Please try again later.");
      }
    }
  };

  // Enable edit mode and pre-fill form with note details
  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setQuestion(note.question);
    setAnswer(note.answer);
    setMainTargetCategory(note.mainTargetCategory);
    setMainTargetGoal(note.mainTargetGoal || ""); // Ensure it’s initialized
    setSubTargetGoal(note.subTargetGoal || ""); // Ensure it’s initialized
  };

  // Update a specific note
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://udemy-tracker.vercel.app/courses/${id}/notes/${editingNote}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            answer,
            mainTargetCategory,
            mainTargetGoal,
            subTargetGoal,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update note");
      }
      const updatedNote = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === editingNote ? updatedNote.note : note
        )
      );
      toast.success("Note updated successfully");
      setEditingNote(null); // Exit edit mode
      setQuestion("");
      setAnswer("");
      setMainTargetCategory("");
      setMainTargetGoal("");
      setSubTargetGoal("");
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Failed to update note. Please try again later.");
    }
  };

  // Delete all notes for this course
  const handleDeleteAllNotes = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete all notes for this course?"
      )
    ) {
      try {
        const response = await fetch(
          `https://udemy-tracker.vercel.app/notes/deleteAllNotes/${id}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete all notes");
        }
        setNotes([]); // Clear the notes state
        toast.success("All notes deleted successfully");
      } catch (error) {
        console.error("Error deleting all notes:", error);
        toast.error("Failed to delete all notes. Please try again later.");
      }
    }
  };

  const saveAllNotesAsPDF = async () => {
    const pdf = new jsPDF();
    let yPosition = 10;

    pdf.setFontSize(20);
    pdf.text("All Notes", 10, yPosition);
    yPosition += 10;

    for (const note of notes) {
      // Create a temporary container for the note's HTML content
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-9999px";
      container.style.fontFamily = "Arial, sans-serif";
      container.style.lineHeight = "1.6";
      container.innerHTML = `
        <div style="font-size: 14px; padding: 10px; width: 180mm; color: black;">
          <h1 style="font-size: 18px;">Note Details</h1>
          <p><strong>Question:</strong> ${note.question}</p>
          <p><strong>Main Goal:</strong> ${note.mainTargetCategory}</p>
          <p><strong>Target Goal:</strong> ${note.mainTargetGoal}</p>
          <p><strong>Sub Goal:</strong> ${note.subTargetGoal}</p>
          <h2 style="font-size: 16px;">Answer:</h2>
          <div>${note.answer}</div>
        </div>
      `;

      document.body.appendChild(container);

      // Capture the container as a canvas and add it to the PDF
      const canvas = await html2canvas(container, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180; // A4 width in mm with some padding
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if a new page is needed
      if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - 10) {
        pdf.addPage();
        yPosition = 10; // Reset position on new page
      }

      pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10; // Space between notes

      document.body.removeChild(container); // Clean up
    }

    pdf.save("all_notes.pdf");
  };

  const saveSelectedNotesAsPDF = async () => {
    const pdf = new jsPDF();
    let yPosition = 10;

    pdf.setFontSize(20);
    pdf.text("Selected Notes", 10, yPosition);
    yPosition += 10;

    for (const noteId of selectedNotes) {
      const note = notes.find((n) => n._id === noteId);
      if (note) {
        // Create a temporary container for each note's HTML
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "-9999px";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.lineHeight = "1.6";
        container.innerHTML = `
        <div style="font-size: 14px; padding: 10px; width: 180mm; color: black;">
          <h1 style="font-size: 18px;">Note Details</h1>
          <p><strong>Question:</strong> ${note.question}</p>
          <p><strong>Main Goal:</strong> ${note.mainTargetCategory}</p>
          <p><strong>Target Goal:</strong> ${note.mainTargetGoal}</p>
          <p><strong>Sub Goal:</strong> ${note.subTargetGoal}</p>
          <h2 style="font-size: 16px;">Answer:</h2>
          <div>${note.answer}</div>
        </div>
      `;

        document.body.appendChild(container);

        // Convert the container to canvas and add it to the PDF
        const canvas = await html2canvas(container, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180; // A4 width in mm with some padding
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if a new page is needed
        if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - 10) {
          pdf.addPage();
          yPosition = 10; // Reset position on new page
        }

        pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10; // Space between notes

        document.body.removeChild(container); // Clean up
      }
    }

    pdf.save("selected_notes.pdf");
  };

  const handleSelectNote = (noteId) => {
    setSelectedNotes(
      (prevSelected) =>
        prevSelected.includes(noteId)
          ? prevSelected.filter((id) => id !== noteId) // Deselect if already selected
          : [...prevSelected, noteId] // Select if not already selected
    );
  };

  const saveAsPDF = async (note) => {
    const pdf = new jsPDF();
    let yPosition = 20;

    pdf.setFontSize(20);
    pdf.text("Note Details", 10, 10);

    // Create a temporary container for the answer's HTML content
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.lineHeight = "1.6";
    container.innerHTML = `
    <div style="font-size: 14px; padding: 10px; width: 180mm; color: black;">
      <h1 style="font-size: 18px;">Note Details</h1>
      <p><strong>Question:</strong> ${note.question}</p>
      <p><strong>Main Goal:</strong> ${note.mainTargetCategory}</p>
      <p><strong>Target Goal:</strong> ${note.mainTargetGoal}</p>
      <p><strong>Sub Goal:</strong> ${note.subTargetGoal}</p>
      <h2 style="font-size: 16px;">Answer:</h2>
      <div>${note.answer}</div>
    </div>
  `;

    document.body.appendChild(container);

    // Capture the container content as an image using html2canvas
    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 180; // A4 width in mm with padding
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);

    document.body.removeChild(container); // Clean up

    pdf.save(`note_${note._id}.pdf`);
  };

  const [filterSubTargetGoal, setFilterSubTargetGoal] = useState(""); // For filtering
  const [subTargetGoalOptions, setSubTargetGoalOptions] = useState([]); // Store unique subTargetGoals

  // Filter notes by selected subTargetGoal
  const filteredNotes = filterSubTargetGoal
    ? notes.filter((note) => note.subTargetGoal === filterSubTargetGoal)
    : notes;

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-10 ${
        isDarkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      {!isAuthorized ? (
        <form
          onSubmit={handlePasswordSubmit}
          className={`p-6 rounded shadow-md ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <label htmlFor="password" className="block mb-2">
            🔒 Prove You're Worthy! Enter the Secret Code:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border p-2 rounded w-full ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
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
          <div
            className={`shadow-md rounded-lg p-6 ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <h2 className="text-3xl font-bold mb-4">Notes</h2>
            {/* Filter dropdown */}
            <div className="flex flex-col sm:flex-row justify-center py-2 space-y-4 sm:space-x-4 sm:space-y-0 px-4">
              <select
                id="filter"
                value={filterSubTargetGoal}
                onChange={(e) => setFilterSubTargetGoal(e.target.value)}
                className={`px-4 py-2 rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "border bg-white text-black placeholder-gray-600"
                }`}
              >
                <option value="">All Sub Target Goals</option>
                {subTargetGoalOptions.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>
            <ul className="space-y-4">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <li
                    key={note._id}
                    className={`border-b py-4 flex justify-between items-start ${
                      isDarkMode ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    {editingNote === note._id ? (
                      // Edit form for the selected note
                      <form
                        onSubmit={handleUpdate}
                        className={`flex flex-col space-y-2 w-full ${
                          isDarkMode ? "bg-gray-800" : "bg-white"
                        }`}
                      >
                        <input
                          type="text"
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Question"
                          className={`p-2 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-black"
                          }`}
                          required
                        />
                        <Editor
                          value={answer}
                          onEditorChange={(content) => setAnswer(content)}
                          apiKey="tbfczm3qaa8n4zsi2ru3iiemt1loveg07jq70ahk7isz17zx"
                          init={{
                            plugins: [
                              // Core editing features
                              "anchor",
                              "autolink",
                              "charmap",
                              "codesample",
                              "emoticons",
                              "image",
                              "link",
                              "lists",
                              "media",
                              "searchreplace",
                              "table",
                              "visualblocks",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                            placeholder: "Answer...",
                            skin: isDarkMode ? "oxide-dark" : "oxide",
                            content_css: isDarkMode ? "dark" : "default",
                          }}
                        />
                        <input
                          type="text"
                          value={mainTargetCategory}
                          onChange={(e) =>
                            setMainTargetCategory(e.target.value)
                          }
                          placeholder="Main Target Goal"
                          className={`p-2 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-black"
                          }`}
                          disabled
                          required
                        />
                        <input
                          type="text"
                          value={mainTargetGoal}
                          onChange={(e) => setMainTargetGoal(e.target.value)}
                          placeholder="Target Goal"
                          className={`p-2 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-black"
                          }`}
                          disabled
                          required
                        />
                        <input
                          type="text"
                          value={subTargetGoal}
                          onChange={(e) => setSubTargetGoal(e.target.value)}
                          placeholder="Sub Target Goal"
                          className={`p-2 rounded border ${
                            isDarkMode
                              ? "bg-gray-700 text-white"
                              : "bg-white text-black"
                          }`}
                          disabled
                          required
                        />
                        <button
                          type="submit"
                          className={`p-2 rounded ${
                            isDarkMode
                              ? "bg-blue-700 hover:bg-blue-800"
                              : "bg-blue-500 hover:bg-blue-600"
                          } text-white`}
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
                          <h3
                            onClick={() =>
                              navigate(
                                `/courses/${id}/notes/note/${note._id}/view`
                              )
                            }
                            className="font-bold text-lg cursor-pointer"
                          >
                            {note.question}
                          </h3>
                          <div
                            className="text-gray-600 text-ellipsis overflow-hidden line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: note.answer }}
                          />
                          <p className="text-gray-600">
                            Sub Target Goal: {note.subTargetGoal || "N/A"}
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedNotes.includes(note._id)}
                            onChange={() => handleSelectNote(note._id)}
                            className="mr-2"
                          />
                          <button
                            onClick={() => saveAsPDF(note)}
                            className={`text-green-500 ${
                              isDarkMode
                                ? "hover:text-green-300"
                                : "hover:text-green-700"
                            }`}
                          >
                            Save as PDF
                          </button>
                          <button
                            onClick={() => handleEditClick(note)}
                            className={`text-blue-500 ${
                              isDarkMode
                                ? "hover:text-blue-300"
                                : "hover:text-blue-700"
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className={`text-red-500 ${
                              isDarkMode
                                ? "hover:text-red-300"
                                : "hover:text-red-700"
                            }`}
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
            {selectedNotes.length > 0 && (
              <button
                onClick={saveSelectedNotesAsPDF}
                className="mt-4 p-2 text-green-500 rounded"
              >
                Save Selected Notes as PDF
              </button>
            )}
            <button
              onClick={saveAllNotesAsPDF}
              className="mt-4 mr-2 p-2 text-green-500 rounded"
            >
              Save All Notes as PDF
            </button>
            <Link
              to={`/courses/${id}/add-notes`}
              className="mt-4 inline-block text-blue-500"
            >
              Add a new note
            </Link>
            {/* Delete All Notes button */}
            {notes.length > 0 && (
              <button
                onClick={handleDeleteAllNotes}
                className={`p-2 rounded text-red-500`}
              >
                Delete All Notes
              </button>
            )}
            <Link to={`/courses/`} className="mt-4 inline-block text-gray-500">
              Back to CourseList
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewNotes;
