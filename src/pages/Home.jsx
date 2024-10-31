import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Home = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [courses, setCourses] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [importantCourses, setImportantCourses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    axios.get('https://udemy-tracker.vercel.app/courses/')
      .then((response) => {
        const data = response.data;
        setCourses(data);

        // Calculate total hours and important courses
        const hours = data.reduce((acc, course) => acc + course.durationInHours, 0);
        setTotalHours(hours);

        const important = data.filter(course => course.importantStatus === 'Important');
        setImportantCourses(important);
      })
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const groupBy = (array, key) => {
    return array.reduce((acc, item) => {
      const value = item[key] || 'Unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  };

  const getFilteredData = (filterKey, value) => {
    return courses.filter(course => course[filterKey] === value);
  };

  const getChartData = (key, filteredCourses) => {
    const groupedData = groupBy(filteredCourses, key);
    return {
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: `Courses by ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          data: Object.values(groupedData),
          backgroundColor: isDarkMode ? ['#FF6384', '#36A2EB', '#FFCE56', '#66BB6A'] : ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          borderWidth: 1,
        },
      ],
    };
  };

  const categoryOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          boxWidth: 10,
          boxHeight: 10,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Extract unique categories and sub-categories
  const categories = [...new Set(courses.map(course => course.category))];
  const subCategories = [...new Set(getFilteredData('category', selectedCategory).map(course => course.subCategory))];

  const selectClassName = `p-2 rounded-md shadow-md ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Category Filter */}
          <div className="flex flex-col mb-4">
            <label htmlFor="category" className="font-medium">Select Category:</label>
            <select
              id="category"
              className={selectClassName}
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory(''); // Reset sub-category on category change
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Sub-Category Filter */}
          <div className="flex flex-col mb-4">
            <label htmlFor="subCategory" className="font-medium">Select Sub-Category:</label>
            <select
              id="subCategory"
              className={selectClassName}
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
            >
              <option value="">All Sub-Categories</option>
              {subCategories.map(subCategory => (
                <option key={subCategory} value={subCategory}>{subCategory}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {/* Category Chart */}
          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium mb-4 text-center">Courses by Category</h2>
            <div className="h-64">
              <Bar
                data={getChartData('category', courses)}
                options={categoryOptions}
              />
            </div>
          </div>

          {/* Sub-Category Chart */}
          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium mb-4 text-center">Courses by Sub-Category</h2>
            <div className="h-64">
              <Bar
                data={getChartData('subCategory', selectedCategory ? getFilteredData('category', selectedCategory) : courses)}
                options={categoryOptions}
              />
            </div>
          </div>

          {/* Importance Chart */}
          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium mb-4 text-center">Courses by Importance</h2>
            <div className="h-64">
              <Bar
                data={getChartData('importantStatus', selectedSubCategory ? getFilteredData('subCategory', selectedSubCategory) : selectedCategory ? getFilteredData('category', selectedCategory) : courses)}
                options={categoryOptions}
              />
            </div>
          </div>

          {/* Status Chart */}
          <div className={`p-4 rounded-md shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-medium mb-4 text-center">Courses by Status</h2>
            <div className="h-64">
              <Bar
                data={getChartData('status', selectedSubCategory ? getFilteredData('subCategory', selectedSubCategory) : selectedCategory ? getFilteredData('category', selectedCategory) : courses)}
                options={categoryOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
