// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [totalCertificates, setTotalCertificates] = useState(0);
  const [importantCoursesCount, setImportantCoursesCount] = useState(0);
  const [totalLearningHours, setTotalLearningHours] = useState(0);

  useEffect(() => {
    // Fetch courses and calculate details
    axios.get('https://udemy-tracker.vercel.app/courses/')
      .then(response => {
        const courses = response.data;

        // Count certificates and important courses
        const certificates = courses.filter(course => course.certified).length;
        const importantCourses = courses.filter(course => course.importantStatus === 'Important').length;

        // Calculate total hours
        const learningHours = courses.reduce((acc, course) => acc + course.durationInHours, 0);

        setTotalCertificates(certificates);
        setImportantCoursesCount(importantCourses);
        setTotalLearningHours(learningHours);
      })
      .catch(error => console.error('Error fetching course data:', error));
  }, []);

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Certificates */}
        <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium">Total Certificates</h2>
          <p className="text-3xl font-semibold mt-2">{totalCertificates}</p>
        </div>

        {/* Important Courses */}
        <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium">Important Courses</h2>
          <p className="text-3xl font-semibold mt-2">{importantCoursesCount}</p>
        </div>

        {/* Total Learning Hours */}
        <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-lg font-medium">Total Learning Hours</h2>
          <p className="text-3xl font-semibold mt-2">{totalLearningHours} hrs</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
