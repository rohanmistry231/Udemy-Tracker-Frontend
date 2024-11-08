// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Courses from "./pages/Courses";
import AddCourse from "./pages/AddCourse";
import EditCourse from "./pages/EditCourse";
import ViewCourse from "./pages/ViewCourse";
import AddNotes from "./pages/AddNotes";
import ViewNotes from "./pages/ViewNotes";
import AddNote from "./pages/AddNote"; // Import the new AddNote page
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Progress from "./pages/Progress";
import Notes from "./pages/Notes";
import EditNote from "./pages/EditNote";
import ViewNote from "./pages/ViewNote";
import ViewCourseNote from "./pages/ViewCourseNote";

function App() {
  const { isDarkMode } = useTheme();
  const [courses, setCourses] = useState([]);

  const handleAddCourse = (newCourse) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  return (
    <Router>
      <div
        className={`flex flex-col min-h-screen ${isDarkMode ? "dark" : "light"}`}
      >
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses courses={courses} />} />
            <Route
              path="/add-course"
              element={<AddCourse onAdd={handleAddCourse} />}
            />
            <Route path="/courses/:id/view" element={<ViewCourse />} />
            <Route path="/courses/:id/edit" element={<EditCourse />} />
            <Route path="/courses/:id/add-notes" element={<AddNotes />} />
            <Route path="/notes/:id/edit" element={<EditNote />} />
            <Route path="/courses/:id/notes" element={<ViewNotes />} />
            <Route path="/notes/:id/view" element={<ViewNote />} />
            <Route path="courses/:courseid/notes/:id/view" element={<ViewCourseNote />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/add-note" element={<AddNote />} /> {/* New route for AddNote */}
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
