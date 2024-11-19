import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/ThemeContext";
import Select from "react-select";
import {
  getCoursesFromLocalStorage,
  getNotesFromLocalStorage,
  saveNotesToLocalStorage,
} from "../../dataService";
import { categories, targetGoals, subGoals } from "../../db";
import { Editor } from "@tinymce/tinymce-react";

const AddNote = () => {
  const handleEditorChange = (content) => setAnswer(content);
  const correctPassword = "12345";
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [targetGoal, setTargetGoal] = useState("");
  const [subTargetGoal, setSubTargetGoal] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchCourses = () => {
      try {
        const storedCourses = getCoursesFromLocalStorage();
        const formattedCourses = storedCourses.map((course) => ({
          value: course._id,
          label: course.name,
          mainCategory: course.category,
          targetGoal: course.subCategory,
        }));
        setCourses(formattedCourses);

        const storedPassword = localStorage.getItem("password");
        if (storedPassword === correctPassword) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error fetching courses from localStorage:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseChange = (selectedOption) => {
    setSelectedCourse(selectedOption);
    if (selectedOption) {
      setMainCategory(selectedOption.mainCategory || "");
      setTargetGoal(selectedOption.targetGoal || "");
      setSubTargetGoal("");
    } else {
      setMainCategory("");
      setTargetGoal("");
      setSubTargetGoal("");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }

    try {
      const newNote = {
        question,
        answer,
        mainTargetCategory: mainCategory,
        mainTargetGoal: targetGoal,
        subTargetGoal,
      };

      const response = await fetch(
        `https://udemy-tracker.vercel.app/courses/${selectedCourse.value}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      const newNoteData = await response.json();
      let storedNotes = getNotesFromLocalStorage() || {};
      if (!storedNotes[selectedCourse.value]) {
        storedNotes[selectedCourse.value] = [];
      }
      storedNotes[selectedCourse.value].push(newNoteData);
      saveNotesToLocalStorage(storedNotes);

      toast.success("Note added successfully!");
      navigate(`/courses/${selectedCourse.value}/view`);
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note. Please try again.");
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem("password", password);
      toast.success("Access granted!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
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
          className={`p-6 rounded shadow-md mt-12 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
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
        <div
          className={`shadow-md rounded-lg p-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <h2 className="text-2xl font-bold mb-4">Add Note</h2>

          <form onSubmit={handleAddNote} className="space-y-4">
            <Select
              options={courses}
              value={selectedCourse}
              onChange={handleCourseChange}
              placeholder="Select Course"
              className="w-full"
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: isDarkMode ? "#1f2937" : "#fff",
                  primary25: isDarkMode ? "#4b5563" : "#e2e8f0",
                  neutral0: isDarkMode ? "#1f2937" : "#fff",
                  neutral80: isDarkMode ? "#fff" : "#000",
                },
              })}
            />

            <select
              value={mainCategory}
              onChange={(e) => setMainCategory(e.target.value)}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              disabled={Boolean(mainCategory)}
            >
              <option value="">Select Main Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={targetGoal}
              onChange={(e) => setTargetGoal(e.target.value)}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              disabled={Boolean(targetGoal)}
            >
              <option value="">Select Target Goal</option>
              {mainCategory &&
                targetGoals[mainCategory]?.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
            </select>

            <select
              value={subTargetGoal}
              onChange={(e) => setSubTargetGoal(e.target.value)}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              disabled={!targetGoal}
            >
              <option value="">Select Sub Target Goal</option>
              {targetGoal &&
                subGoals[targetGoal]?.map((subGoal) => (
                  <option key={subGoal} value={subGoal}>
                    {subGoal}
                  </option>
                ))}
            </select>

            <input
              type="text"
              id="question"
              placeholder="Question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              required
            />

            <Editor
              onEditorChange={handleEditorChange}
              apiKey="tbfczm3qaa8n4zsi2ru3iiemt1loveg07jq70ahk7isz17zx"
              init={{
                plugins: [
                  // Core editing features
                  'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 
                  'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 
                  'wordcount'
                ],
                toolbar: 
                  'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                placeholder: "Answer...",
                skin: isDarkMode ? "oxide-dark" : "oxide",
                content_css: isDarkMode ? "dark" : "default",
              }}
            />

            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Note
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddNote;
