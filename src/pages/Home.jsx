import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Home = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [courses, setCourses] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedImportantStatus, setSelectedImportantStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    axios
      .get("https://udemy-tracker.vercel.app/courses/")
      .then((response) => {
        const data = response.data;
        setCourses(data);

        const hours = data.reduce(
          (acc, course) => acc + course.durationInHours,
          0
        );
        setTotalHours(hours);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const groupBy = (array, key) => {
    return array.reduce((acc, item) => {
      const value = item[key] || "Unknown";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  };

  const getFilteredData = () => {
    return courses.filter(
      (course) =>
        (selectedCategory ? course.category === selectedCategory : true) &&
        (selectedSubCategory
          ? course.subCategory === selectedSubCategory
          : true) &&
        (selectedImportantStatus
          ? course.importantStatus === selectedImportantStatus
          : true) &&
        (selectedStatus ? course.status === selectedStatus : true)
    );
  };

  const getChartData = (key, filteredCourses) => {
    const groupedData = groupBy(filteredCourses, key);
    return {
      labels: Object.keys(groupedData),
      datasets: [
        {
          label: `Courses by ${key.charAt(0).toUpperCase() + key.slice(1)}`,
          data: Object.values(groupedData),
          backgroundColor: isDarkMode
            ? ["#FF6384", "#36A2EB", "#FFCE56", "#66BB6A"]
            : ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
          borderWidth: 1,
        },
      ],
    };
  };

  const categoryOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "#FFFFFF" : "#000000",
        },
      },
    },
    maintainAspectRatio: false,
  };

  const categories = [...new Set(courses.map((course) => course.category))];
  const subCategories = [
    ...new Set(getFilteredData().map((course) => course.subCategory)),
  ];
  const importanceStatuses = [
    ...new Set(courses.map((course) => course.importantStatus)),
  ];
  const statuses = [...new Set(courses.map((course) => course.status))];

  const selectClassName = `p-2 rounded-md shadow-md ${
    isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
  }`;

  const filteredData = getFilteredData();

  return (
    <div
      className={`min-h-screen flex flex-col p-6 transition-colors duration-300 mt-12 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-center mb-6">
          Udemy Courses Analysis
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          <div
            className={`p-4 rounded-md shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-medium">Total Courses</h2>
            <p className="text-3xl font-semibold mt-2">{courses.length}</p>
          </div>
          <div
            className={`p-4 rounded-md shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-lg font-medium">Total Learning Hours</h2>
            <p className="text-3xl font-semibold mt-2">{totalHours} hrs</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="flex flex-col mb-4">
          <label htmlFor="category" className="font-medium">
            Select Category:
          </label>
          <select
            id="category"
            className={selectClassName}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("");
            }}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="subCategory" className="font-medium">
            Select Sub-Category:
          </label>
          <select
            id="subCategory"
            className={selectClassName}
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
          >
            <option value="">All Sub-Categories</option>
            {subCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="importantStatus" className="font-medium">
            Select Important Status:
          </label>
          <select
            id="importantStatus"
            className={selectClassName}
            value={selectedImportantStatus}
            onChange={(e) => setSelectedImportantStatus(e.target.value)}
          >
            <option value="">All Importance</option>
            {importanceStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col mb-4">
          <label htmlFor="status" className="font-medium">
            Select Status:
          </label>
          <select
            id="status"
            className={selectClassName}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div
          className={`p-4 rounded-md shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-medium">Category Count</h2>
          <p className="text-3xl font-semibold mt-2">
            {
              filteredData.filter(
                (course) => course.category === selectedCategory
              ).length
            }
          </p>
        </div>

        <div
          className={`p-4 rounded-md shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-medium">Sub-Category Count</h2>
          <p className="text-3xl font-semibold mt-2">
            {
              filteredData.filter(
                (course) => course.subCategory === selectedSubCategory
              ).length
            }
          </p>
        </div>

        <div
          className={`p-4 rounded-md shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-medium">Important Status Count</h2>
          <p className="text-3xl font-semibold mt-2">
            {
              filteredData.filter(
                (course) => course.importantStatus === selectedImportantStatus
              ).length
            }
          </p>
        </div>

        <div
          className={`p-4 rounded-md shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-medium">Status Count</h2>
          <p className="text-3xl font-semibold mt-2">
            {
              filteredData.filter((course) => course.status === selectedStatus)
                .length
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <div className="h-80">
          <Bar
            data={getChartData("category", filteredData)}
            options={categoryOptions}
          />
        </div>
        <div className="h-80">
          <Bar
            data={getChartData("subCategory", filteredData)}
            options={categoryOptions}
          />
        </div>
        <div className="h-80">
          <Bar
            data={getChartData("importantStatus", filteredData)}
            options={categoryOptions}
          />
        </div>
        <div className="h-80">
          <Bar
            data={getChartData("status", filteredData)}
            options={categoryOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
