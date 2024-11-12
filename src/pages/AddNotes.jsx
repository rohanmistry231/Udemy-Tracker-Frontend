import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext"; // Import theme context
import { addNoteToCourse, getCourseDetails } from "../dataService";
import { categories, targetGoals, subGoals } from "../db";
import { Editor } from "@tinymce/tinymce-react";

const AddNotes = () => {
  const handleEditorChange = (content) => setAnswer(content);
  const correctPassword = "12345";
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === "dark"; // Check if dark mode is enabled

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [courseName, setCourseName] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [mainCategory, setMainCategory] = useState("");
  const [targetGoal, setTargetGoal] = useState("");
  const [subTargetGoal, setSubTargetGoal] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course name and category details
        const courseDetails = getCourseDetails(id);
        setCourseName(courseDetails.name); // Assuming courseDetails contains name
        setMainCategory(courseDetails.mainCategory);
        setTargetGoal(courseDetails.targetGoal);

        // Check if user is already authorized
        const storedPassword = localStorage.getItem("password");
        if (storedPassword === correctPassword) {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
        setCourseName("Error fetching course name"); // Optional fallback
      }
    };

    fetchCourseData();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();

    const noteData = {
      question,
      answer,
      mainTargetCategory: mainCategory,
      mainTargetGoal: targetGoal,
      subTargetGoal,
    };

    try {
      // Call the service function to add the note
      await addNoteToCourse(id, noteData);

      // Navigate to the notes page after successful addition
      navigate(`/courses/${id}/notes`);
      toast.success("Note added successfully!");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note. Please try again.");
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
            <h2 className="text-2xl font-bold mb-4">
              Add Notes for {courseName}
            </h2>
            {console.log(mainCategory)}
            {console.log(targetGoal)}
            <form onSubmit={handleAddNote} className="space-y-4">
              {/* Main Category Select */}
              <select
                value={mainCategory}
                onChange={(e) => setMainCategory(mainCategory)}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                disabled
              >
                <option value="">Select Main Category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Target Goal Select */}
              <select
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                className={`border p-2 rounded w-full ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
                disabled
              >
                <option value="">Select Target Goal</option>
                {mainCategory &&
                  targetGoals[mainCategory]?.map((goal) => (
                    <option key={goal} value={goal}>
                      {goal}
                    </option>
                  ))}
              </select>

              {/* Sub Target Goal Select */}
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

              {/* Question Input */}
              <div>
                <label htmlFor="question" className="block mb-1">
                  Question:
                </label>
                <input
                  placeholder="Question..."
                  type="text"
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className={`border p-2 rounded w-full ${
                    isDarkMode
                      ? "bg-gray-700 text-white"
                      : "bg-white text-black"
                  }`}
                  required
                />
              </div>

              {/* Answer Textarea */}
              <div>
                <label htmlFor="answer" className="block mb-1">
                  Answer:
                </label>
                <Editor
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
                      // Your account includes a free trial of TinyMCE premium features
                      // Try the most popular premium features until Nov 26, 2024:
                      "checklist",
                      "mediaembed",
                      "casechange",
                      "export",
                      "formatpainter",
                      "pageembed",
                      "a11ychecker",
                      "tinymcespellchecker",
                      "permanentpen",
                      "powerpaste",
                      "advtable",
                      "advcode",
                      "editimage",
                      "advtemplate",
                      "ai",
                      "mentions",
                      "tinycomments",
                      "tableofcontents",
                      "footnotes",
                      "mergetags",
                      "autocorrect",
                      "typography",
                      "inlinecss",
                      "markdown",
                      // Early access to document converters
                      "importword",
                      "exportword",
                      "exportpdf",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                      { value: "First.Name", title: "First Name" },
                      { value: "Email", title: "Email" },
                    ],
                    ai_request: (request, respondWith) =>
                      respondWith.string(() =>
                        Promise.reject("See docs to implement AI Assistant")
                      ),
                    exportpdf_converter_options: {
                      format: "Letter",
                      margin_top: "1in",
                      margin_right: "1in",
                      margin_bottom: "1in",
                      margin_left: "1in",
                    },
                    exportword_converter_options: {
                      document: { size: "Letter" },
                    },
                    importword_converter_options: {
                      formatting: {
                        styles: "inline",
                        resets: "inline",
                        defaults: "inline",
                      },
                    },
                    placeholder: "Answer...",
                    skin: isDarkMode ? "oxide-dark" : "oxide",
                    content_css: isDarkMode ? "dark" : "default",
                  }}
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Note
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default AddNotes;
