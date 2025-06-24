import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/ThemeContext";
import { fetchNoteById } from "../../dataService";
import {
  categories as mainTargetCategories,
  targetGoals,
  subGoals as subTargetGoals,
} from "../../db";
import { Editor } from "@tinymce/tinymce-react";

const EditNote = () => {
  const correctPassword = "12345";
  const { id } = useParams(); // Note ID for fetching/updating specific note
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [note, setNote] = useState({
    question: "",
    answer: "",
    mainTargetCategory: "",
    mainTargetGoal: "",
    subTargetGoal: "",
  });

  useEffect(() => {
    const fetchNoteDetails = async () => {
      try {
        const data = await fetchNoteById(id); // Call the service function to fetch the note data
        setNote({
          question: data.note?.question || "",
          answer: data.note?.answer || "",
          mainTargetCategory: data.note?.mainTargetCategory || "",
          mainTargetGoal: data.note?.mainTargetGoal || "",
          subTargetGoal: data.note?.subTargetGoal || "",
        });
        const storedPassword = localStorage.getItem("password");
        if (storedPassword === correctPassword) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        toast.error("Error fetching note data");
      }
    };

    if (id) {
      fetchNoteDetails(); // Fetch the note details when the component mounts or id changes
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value || "",
    }));
  };

  const handleCategoryChange = (e) => {
    setNote({
      ...note,
      mainTargetCategory: e.target.value || "",
      mainTargetGoal: "",
      subTargetGoal: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://udemy-tracker.vercel.app/notes/update/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(note),
        }
      );
      if (!response.ok) throw new Error("Failed to update note");

      toast.success("Note updated successfully!");
      navigate(`/notes/${id}/view`);
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Error updating note data");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const correctPassword = "12345";
    if (password === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem("password", password); // Store the password in localStorage
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  const handleEditorChange = (content) => {
    setNote((prevNote) => ({
      ...prevNote,
      answer: content, // Update the answer with the editor content
    }));
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
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
            <h2 className="text-3xl font-bold mb-4">Edit Note</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label htmlFor="question" className="block mb-2">
                  Question:
                </label>
                <input
                  type="text"
                  id="question"
                  name="question"
                  value={note.question}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="answer" className="block mb-2">
                  Answer:
                </label>
                <Editor
                  value={note.answer}
                  onEditorChange={handleEditorChange}
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
              </div>
              <div className="mb-4">
                <label htmlFor="mainTargetCategory" className="block mb-2">
                  Main Target Category:
                </label>
                <select
                  id="mainTargetCategory"
                  name="mainTargetCategory"
                  value={note.mainTargetCategory}
                  onChange={handleCategoryChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  disabled
                  required
                >
                  <option value="">Select a main target category</option>
                  {mainTargetCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="mainTargetGoal" className="block mb-2">
                  Main Target Goal:
                </label>
                <select
                  id="mainTargetGoal"
                  name="mainTargetGoal"
                  value={note.mainTargetGoal}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  disabled
                  required
                >
                  <option value="">Select a main target goal</option>
                  {note.mainTargetCategory &&
                    targetGoals[note.mainTargetCategory]?.map((goal) => (
                      <option key={goal} value={goal}>
                        {goal}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="subTargetGoal" className="block mb-2">
                  Sub Target Goal:
                </label>
                <select
                  id="subTargetGoal"
                  name="subTargetGoal"
                  value={note.subTargetGoal}
                  onChange={handleChange}
                  className={`border p-2 w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <option value="">Select a sub target goal</option>
                  {note.mainTargetGoal &&
                    subTargetGoals[note.mainTargetGoal]?.map((subGoal) => (
                      <option key={subGoal} value={subGoal}>
                        {subGoal}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                  Update Note
                </button>
                <Link to="/notes" className="text-gray-600 hover:underline">
                  Back to Notes
                </Link>
              </div>
            </form>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default EditNote;
