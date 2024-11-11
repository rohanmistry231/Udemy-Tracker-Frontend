// src/pages/AddNote.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";
import Select from "react-select";
import {
  getCoursesFromLocalStorage,
  getNotesFromLocalStorage,
  saveNotesToLocalStorage,
} from "../dataService";
import { categories, targetGoals, subGoals } from '../db';

const AddNote = () => {
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
        // Fetch courses from localStorage
        const storedCourses = getCoursesFromLocalStorage();

        // If courses are found in localStorage, format them accordingly
        const formattedCourses = storedCourses.map((course) => ({
          value: course._id,
          label: course.name,
        }));

        // Set the courses in the state
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

  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }

    try {
      // Prepare the note object to be added
      const newNote = {
        question,
        answer,
        mainTargetCategory: mainCategory,
        mainTargetGoal: targetGoal,
        subTargetGoal,
      };

      // POST the new note to the backend
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

      // Add the new note to localStorage if the backend request succeeds
      const newNoteData = await response.json();

      // Assuming the localStorage already contains notes for the course, update them
      let storedNotes = getNotesFromLocalStorage();
      storedNotes = storedNotes || {}; // Initialize an empty object if no notes exist
      if (!storedNotes[selectedCourse.value]) {
        storedNotes[selectedCourse.value] = []; // Create an empty array for the course if it doesn't exist
      }

      // Add the newly created note to the specific course's notes
      storedNotes[selectedCourse.value].push(newNoteData);

      // Save the updated notes back to localStorage
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
    const correctPassword = "12345"; // Define the correct password here
    if (password === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem("password", password); // Store the password in localStorage
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
            autoFocus // Add autofocus here
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
        <h2 className="text-2xl font-bold mb-4">Add Note</h2>

        <form onSubmit={handleAddNote} className="space-y-4">
          {/* Searchable Course Dropdown */}
          <Select
            options={courses}
            value={selectedCourse}
            onChange={(selectedOption) => setSelectedCourse(selectedOption)}
            placeholder="Select Course"
            className="w-full"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: isDarkMode ? "#1f2937" : "#fff",
                primary25: isDarkMode ? "#4b5563" : "#e2e8f0",
                neutral0: isDarkMode ? "#1f2937" : "#fff", // Background color
                neutral80: isDarkMode ? "#fff" : "#000", // Text color in the input area
              },
            })}
          />

          {/* Main Category Dropdown */}
          <select
            value={mainCategory}
            onChange={(e) => {
              setMainCategory(e.target.value);
              setTargetGoal("");
              setSubTargetGoal("");
            }}
            className={`border p-2 rounded w-full ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
          >
            <option value="">Select Main Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Target Goal Dropdown */}
          <select
            value={targetGoal}
            onChange={(e) => {
              setTargetGoal(e.target.value);
              setSubTargetGoal("");
            }}
            className={`border p-2 rounded w-full ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            disabled={!mainCategory}
          >
            <option value="">Select Target Goal</option>
            {mainCategory &&
              targetGoals[mainCategory]?.map((goal) => (
                <option key={goal} value={goal}>
                  {goal}
                </option>
              ))}
          </select>

          {/* Sub Target Goal Dropdown */}
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

          {/* Question and Answer Fields */}
          <div>
            <label htmlFor="question" className="block mb-1">
              Question:
            </label>
            <input
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              required
            />
          </div>

          <div>
            <label htmlFor="answer" className="block mb-1">
              Answer:
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`border p-2 rounded w-full ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
              required
            />
          </div>

          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Note
          </button>
        </form>
      </div>
      </> )}
    </div>
  );
};

export default AddNote;
