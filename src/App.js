// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Courses from "./pages/Courses/Courses";
import AddCourse from "./pages/Courses/AddCourse";
import EditCourse from "./pages/Courses/EditCourse";
import ViewCourse from "./pages/Courses/ViewCourse";
import AddNotes from "./pages/Notes/AddNotes";
import ViewNotes from "./pages/Notes/ViewNotes";
import AddNote from "./pages/Notes/AddNote"; // Import the new AddNote page
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Progress from "./pages/Progress/Progress";
import Notes from "./pages/Notes/Notes";
import EditNote from "./pages/Notes/EditNote";
import ViewNote from "./pages/Notes/ViewNote";
import ViewCourseNote from "./pages/Notes/ViewCourseNote";
import ViewNoteOfViewNotes from "./pages/Notes/ViewNoteOfViewNotes";
import EditNoteOfViewNotes from "./pages/Notes/EditNoteOfViewNotes";
import Certificate from "./pages/Certificate/Certificate";
import Skills from "./pages/Skills/Skills";
import Projects from "./pages/Projects/Projects";

function App() {
  const { isDarkMode } = useTheme();
  const [courses, setCourses] = useState([]);

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
              element={<AddCourse onAdd={handleAddCourse} />}
            />
            <Route path="/courses/:id/view" element={<ViewCourse />} />
            <Route path="/courses/:id/edit" element={<EditCourse />} />
            <Route path="/courses/:id/add-notes" element={<AddNotes />} />
            <Route path="/notes/:id/edit" element={<EditNote />} />
            <Route
              path="courses/:courseid/notes/note/:id/edit"
              element={<EditNoteOfViewNotes />}
            />
            <Route path="/courses/:id/notes" element={<ViewNotes />} />
            <Route path="/notes/:id/view" element={<ViewNote />} />
            <Route
              path="courses/:courseid/notes/:id/view"
              element={<ViewCourseNote />}
            />
            <Route
              path="courses/:courseid/notes/note/:id/view"
              element={<ViewNoteOfViewNotes />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/add-note" element={<AddNote />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            {/* New route for AddNote */}
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
