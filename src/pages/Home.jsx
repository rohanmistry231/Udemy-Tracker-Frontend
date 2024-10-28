// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios'; // For fetching backend data

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

const Home = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [courses, setCourses] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [importantCourses, setImportantCourses] = useState([]);
  const [recentNotes, setRecentNotes] = useState([]);

  // Fetch data from backend
  useEffect(() => {
    axios.get('http://localhost:5000/courses/') // Adjust endpoint if needed
      .then((response) => {
        const data = response.data;
        setCourses(data);

        // Calculate total learning hours
        const hours = data.reduce((acc, course) => acc + course.durationInHours, 0);
        setTotalHours(hours);

        // Filter important courses
        const important = data.filter(course => course.importantStatus === 'Important');
        setImportantCourses(important);

        // Extract recent notes (sorted by date)
        const notes = data.flatMap(course => course.notes)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentNotes(notes);
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  // Prepare data for course status chart
  const statusCounts = {
    'Not Started Yet': courses.filter(c => c.status === 'Not Started Yet').length,
    'In Progress': courses.filter(c => c.status === 'In Progress').length,
    'Completed': courses.filter(c => c.status === 'Completed').length,
  };

  const statusData = {
    labels: ['Not Started', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Course Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <h1 className="text-2xl font-bold text-center mb-6">Course Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium">Total Courses</h2>
          <p className="text-3xl font-semibold mt-2">{courses.length}</p>
        </div>
        <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium">Total Learning Hours</h2>
          <p className="text-3xl font-semibold mt-2">{totalHours} hrs</p>
        </div>
        <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium">Important Courses</h2>
          <p className="text-3xl font-semibold mt-2">{importantCourses.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium mb-4">Course Status Overview</h2>
          <div className="h-64">
            <Bar data={statusData} />
          </div>
        </div>
      </div>

      {/* Important Courses List */}
      <div className={`mt-8 p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-lg font-medium mb-4">Important Courses</h2>
        <ul className="list-disc list-inside">
          {importantCourses.map(course => (
            <li key={course.no}>{course.name}</li>
          ))}
        </ul>
      </div>

      {/* Recent Notes Section */}
      <div className={`mt-8 p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h2 className="text-lg font-medium mb-4">Recent Notes</h2>
        <ul className="space-y-2">
          {recentNotes.map((note, index) => (
            <li key={index}>
              <p className="font-semibold">{note.question}</p>
              <p className="text-sm">{note.answer}</p>
              <p className="text-xs text-gray-400">{new Date(note.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
