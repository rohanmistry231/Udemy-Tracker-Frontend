// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse"; // Import the AddCourse page
import EditCourse from "./pages/EditCourse"; // Import the AddCourse page
import ViewCourse from "./pages/ViewCourse"; // Import the AddCourse page
import AddNotes from "./pages/AddNotes"; // Import the AddCourse page
import ViewNotes from "./pages/ViewNotes"; // Import the AddCourse page
import { ThemeProvider, useTheme } from "./context/ThemeContext"; // Import ThemeContext
import Home from "./pages/Home";

function App() {
  const { isDarkMode } = useTheme(); // Get isDarkMode from ThemeContext
  const [courses, setCourses] = useState([]); // State to store courses

  // Define the onAdd function to add a new course
  const handleAddCourse = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  return (
    <Router>
      <div
        className={`flex flex-col min-h-screen ${
          isDarkMode ? "dark" : "light"
        }`}
      >
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses courses={courses} />} />
            <Route
              path="/add-course"
              element={<AddCourse onAdd={handleAddCourse} />} // Pass handleAddCourse as prop
            />
            <Route path="/courses/:id/view" element={<ViewCourse />} />
            <Route path="/courses/:id/edit" element={<EditCourse />} />
            <Route path="/courses/:id/add-notes" element={<AddNotes />} />
            <Route path="/courses/:id/notes" element={<ViewNotes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

const MainApp = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default MainApp;
