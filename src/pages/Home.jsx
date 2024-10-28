import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

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
  const [categories, setCategories] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/courses/')
      .then((response) => {
        const data = response.data;
        setCourses(data);

        const hours = data.reduce((acc, course) => acc + course.durationInHours, 0);
        setTotalHours(hours);

        const important = data.filter(course => course.importantStatus === 'Important');
        setImportantCourses(important);

        const categoryCounts = groupBy(data, 'category');
        setCategories(categoryCounts);
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const groupBy = (array, key) => {
    return array.reduce((acc, item) => {
      acc[item[key]] = (acc[item[key]] || 0) + 1;
      return acc;
    }, {});
  };

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

  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Courses per Category',
        data: Object.values(categories),
        backgroundColor: ['#FFCE56', '#66BB6A', '#42A5F5'],
      },
    ],
  };

  const categoryOptions = {
    plugins: {
      legend: {
        position: 'right',
        align: 'center',
        labels: {
          boxWidth: 10,
          boxHeight: 10,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div
      className={`min-h-screen flex flex-col p-6 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
      }`}
    >
      <div className="flex-grow">
        <h1 className="text-2xl font-bold text-center mb-6">Course Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Courses Card */}
          <Link to="/courses" className={`p-4 rounded-md shadow-md cursor-pointer ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium">Total Courses</h2>
            <p className="text-3xl font-semibold mt-2">{courses.length}</p>
          </Link>

          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium">Total Learning Hours</h2>
            <p className="text-3xl font-semibold mt-2">{totalHours} hrs</p>
          </div>
          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium">Important Courses</h2>
            <p className="text-3xl font-semibold mt-2">{importantCourses.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium mb-4">Course Status Overview</h2>
            <div className="h-64">
              <Bar data={statusData} />
            </div>
          </div>
          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium mb-4">Courses by Category</h2>
            <div className="h-64 flex">
              <div className="w-2/3">
                <Pie data={categoryData} options={categoryOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
