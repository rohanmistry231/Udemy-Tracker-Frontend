import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Assuming your theme context file is named themeContext.js
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // For collapse functionality

const Progress = () => {
  const { theme } = useTheme(); // Access theme from context
  const isDarkMode = theme === 'dark'; // Check if dark mode is active
  
  // Data
  const categories = [
    "Data Science", "Database", "IT & Software", "Web Development", "Business",
    "Filmmaking", "Graphics Design", "Marketing", "Office Productivity", "Music",
    "Cloud", "DevOps", "Health & Fitness", "Language", "Operating System", 
    "Personal Development", "Version Control"
  ];

  const targetGoals = {
    "Data Science": ["Algorithms", "Artificial Intelligence", "Big Data", "Data Analysis"],
    "Database": ["DBMS", "MySQL", "NoSQL", "SQL"],
    "IT & Software": ["API", "Artificial Intelligence", "Business Intelligence", "Network & Security"],
    "Web Development": ["API", "Backend", "Frontend", "Full Stack"],
    "Business": ["Business Strategy", "Digital Marketing", "E-Commerce"],
  };

  const subGoals = {
    "Algorithms": ["Sorting", "Graph Theory", "Dynamic Programming"],
    "Artificial Intelligence": ["Machine Learning", "Neural Networks", "Natural Language Processing"],
  };

  // State for tracking completion and collapsible sections
  const [checkedCategories, setCheckedCategories] = useState(
    categories.reduce((acc, category) => {
      acc[category] = false;
      return acc;
    }, {})
  );

  const [checkedGoals, setCheckedGoals] = useState(
    Object.keys(targetGoals).reduce((acc, category) => {
      acc[category] = targetGoals[category]?.reduce((goalAcc, goal) => {
        goalAcc[goal] = false;
        return goalAcc;
      }, {});
      return acc;
    }, {})
  );

  const [checkedSubGoals, setCheckedSubGoals] = useState(
    Object.keys(subGoals).reduce((acc, goal) => {
      acc[goal] = subGoals[goal]?.reduce((subAcc, subGoal) => {
        subAcc[subGoal] = false;
        return subAcc;
      }, {});
      return acc;
    }, {})
  );

  const [collapsed, setCollapsed] = useState(
    categories.reduce((acc, category) => {
      acc[category] = false;
      return acc;
    }, {})
  );

  // Toggle checkboxes
  const toggleCategory = (category) => {
    setCheckedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleGoal = (category, goal) => {
    setCheckedGoals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [goal]: !prev[category][goal],
      },
    }));
  };

  const toggleSubGoal = (goal, subGoal) => {
    setCheckedSubGoals((prev) => ({
      ...prev,
      [goal]: {
        ...prev[goal],
        [subGoal]: !prev[goal][subGoal],
      },
    }));
  };

  const toggleCollapse = (category) => {
    setCollapsed((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Calculate progress
  const getProgress = (checked, total) => {
    if (!total) return 0; // Guard against division by 0
    return (Object.values(checked).filter(Boolean).length / total) * 100;
  };

  // Calculate overall progress
  const overallProgress = getProgress(checkedCategories, categories.length);

  return (
    <div className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}> 
  {/* Apply conditional classes based on dark mode */}
  <h1 className="text-3xl font-bold text-center py-4 mt-14">Progress Tracker</h1> {/* Reduced padding and margin */}

  {/* Overall Progress Bar */}
  <div className={`my-2 mx-4 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} border rounded-lg shadow-lg p-4`}>
  {/* Title */}
  <h2 className="text-2xl font-semibold mb-4 text-center">Overall Progress</h2>

  {/* Custom Progress Bar */}
  <div className="relative w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
    <div
      className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-600"
      style={{ width: `${overallProgress}%` }} // Dynamic width based on progress
    />
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <span className="text-white font-semibold">{Math.round(overallProgress)}%</span>
    </div>
  </div>

  {/* Progress Percentage */}
  <div className="flex justify-between mt-2">
    <span className="text-sm text-gray-600">0%</span>
    <span className="text-sm text-gray-600">100%</span>
  </div>
</div>



      {categories.map((category) => (
        <div key={category} className="my-6 mx-4">
          {/* Category Card */}
          <div className={isDarkMode ? "border rounded-lg shadow-lg p-4 bg-gray-800 text-white" : "border rounded-lg shadow-lg p-4 bg-white text-black"}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="mr-2"
                />
                <h2 className="text-xl font-semibold">{category}</h2>
              </div>
              <button
                onClick={() => toggleCollapse(category)}
                className="text-lg"
              >
                {collapsed[category] ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>

            {/* Collapse Content */}
            {!collapsed[category] && (
              <div className="mt-4">
                {targetGoals[category]?.map((goal) => (
                  <div key={goal} className="ml-6 my-3">
                    {/* Goal Section */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={checkedGoals[category]?.[goal]}
                        onChange={() => toggleGoal(category, goal)}
                        className="mr-2"
                      />
                      <h3 className="text-lg">{goal}</h3>
                    </div>

                    {subGoals[goal]?.map((subGoal) => (
                      <div key={subGoal} className="ml-6 my-2">
                        {/* Sub Goal Section */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={checkedSubGoals[goal]?.[subGoal]}
                            onChange={() => toggleSubGoal(goal, subGoal)}
                            className="mr-2"
                          />
                          <span>{subGoal}</span>
                        </div>
                      </div>
                    ))}

                    <div className="my-2">
                      <label className="text-sm">Progress:</label>
                      <progress
                        value={getProgress(checkedSubGoals[goal], subGoals[goal]?.length)}
                        max={100}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}

                <div className="my-2">
                  <label className="text-sm">Overall Goal Progress:</label>
                  <progress
                    value={getProgress(checkedGoals[category], targetGoals[category]?.length)}
                    max={100}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Progress;
