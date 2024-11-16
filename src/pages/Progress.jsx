import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Progress = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [mainCategories, setMainCategories] = useState([]);
  const [checkedMainCategories, setCheckedMainCategories] = useState({});
  const [checkedMainGoals, setCheckedMainGoals] = useState({});
  const [checkedSubGoals, setCheckedSubGoals] = useState({});
  const [collapsedMainCategories, setCollapsedMainCategories] = useState({});
  const [collapsedMainGoals, setCollapsedMainGoals] = useState({});
  const [priorityFilter, setPriorityFilter] = useState("");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/main-category");
        const mainCategoriesData = await response.json();
        setMainCategories(mainCategoriesData);

        // Initialize states for main categories and goals
        setCheckedMainCategories(
          mainCategoriesData.reduce((acc, category) => ({ ...acc, [category.name]: category.isChecked }), {})
        );
        setCheckedMainGoals(
          mainCategoriesData.reduce((acc, category) => {
            acc[category.name] = category.mainGoals.reduce((goalAcc, goal) => {
              goalAcc[goal.name] = goal.isChecked;
              return goalAcc;
            }, {});
            return acc;
          }, {})
        );
        setCheckedSubGoals(
          mainCategoriesData.reduce((acc, category) => {
            acc[category.name] = category.mainGoals.reduce((goalAcc, goal) => {
              goalAcc[goal.name] = goal.subGoals.reduce((subGoalAcc, subGoal) => {
                subGoalAcc[subGoal.name] = subGoal.isChecked;
                return subGoalAcc;
              }, {});
              return goalAcc;
            }, {});
            return acc;
          }, {})
        );
        setCollapsedMainCategories(
          mainCategoriesData.reduce((acc, category) => ({ ...acc, [category.name]: false }), {})
        );
        setCollapsedMainGoals(
          mainCategoriesData.reduce((acc, category) => {
            acc[category.name] = category.mainGoals.reduce((goalAcc, goal) => {
              goalAcc[goal.name] = false; // Initialize collapse state for each goal
              return goalAcc;
            }, {});
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate overall progress
  const calculateProgress = (checkedItems, totalItems) =>
    totalItems > 0 ? (Object.values(checkedItems).filter(Boolean).length / totalItems) * 100 : 0;

  const overallProgress = calculateProgress(checkedMainCategories, mainCategories.length);

  const toggleMainCategory = (category) => {
    setCheckedMainCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleMainGoal = (category, goal) => {
    setCheckedMainGoals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [goal]: !prev[category][goal],
      },
    }));
  };

  const toggleSubGoal = (category, goal, subGoal) => {
    setCheckedSubGoals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [goal]: {
          ...prev[category][goal],
          [subGoal]: !prev[category][goal][subGoal],
        },
      },
    }));
  };

  const toggleCategoryCollapse = (category) => {
    setCollapsedMainCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleGoalCollapse = (category, goal) => {
    setCollapsedMainGoals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [goal]: !prev[category][goal],
      },
    }));
  };

  const getTextClass = (checked) => {
    return checked ? "text-green-500" : ""; // Apply green text if checked
  };

  const filteredCategories = mainCategories.filter(
    (category) => priorityFilter === "" || category.priority === priorityFilter
  );

  return (
    <div
      className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
    >
      <h2 className="text-3xl font-semibold text-center py-4 mt-14 flex justify-center items-center">
        📈 Progress Tracker 📈
      </h2>

      <div className="flex flex-col sm:flex-row justify-center my-4 space-y-4 sm:space-x-4 sm:space-y-0 px-4">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className={`px-4 py-2 rounded ${isDarkMode
            ? "bg-gray-700 text-white placeholder-gray-400"
            : "border bg-white text-black placeholder-gray-600"}`}
        >
          <option value="">All Priorities</option>
          <option value="High priority">High Priority</option>
          <option value="Medium priority">Medium Priority</option>
          <option value="Low priority">Low Priority</option>
          <option value="Parallel priority">Parallel Priority</option>
        </select>
      </div>

      <div
        className={`my-2 mx-4 ${
          isDarkMode ? "bg-gray-800 text-white" : "border bg-white text-black"
        } rounded-lg shadow-lg p-4`}
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Overall Progress
        </h2>
        <div className="relative w-full h-6 bg-gray-200 rounded-lg overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-600"
            style={{
              width: `${overallProgress}%`,
              transition: "width 0.5s ease-in-out",
            }}
          />
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <span className={`text-black font-semibold`}>
              {Math.round(overallProgress)}%
            </span>
          </div>
        </div>
        <div
          className={`flex justify-between mt-2 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        >
          <span className="text-sm">0%</span>
          <span className="text-sm">100%</span>
        </div>
      </div>

      {filteredCategories.map((category) => {
        const mainGoalsProgress = calculateProgress(checkedMainGoals[category.name], category.mainGoals.length);
        return (
          <div key={category._id} className="my-6 mx-4">
            <div
              className={isDarkMode
                ? "rounded-lg shadow-lg p-4 bg-gray-800 text-white"
                : "border rounded-lg shadow-lg p-4 bg-white text-black"}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checkedMainCategories[category.name]}
                    onChange={() => toggleMainCategory(category.name)}
                    className="mr-2"
                  />
                  <h2
                    className={`text-xl font-semibold cursor-pointer ${getTextClass(
                      checkedMainCategories[category.name]
                    )}`}
                    onClick={() => toggleCategoryCollapse(category.name)}
                  >
                    {category.name}
                  </h2>
                </div>
                <button
                  onClick={() => toggleCategoryCollapse(category.name)}
                  className="text-lg"
                >
                  {collapsedMainCategories[category.name] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronUp />
                  )}
                </button>
              </div>
              <div className="relative w-full h-4 mt-2 bg-gray-200 rounded overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-600"
                  style={{ width: `${mainGoalsProgress}%`,transition: "width 0.5s ease-in-out" }}
                ></div>
              </div>
              <p className="text-sm mt-2">
                Main Goals Progress: {Math.round(mainGoalsProgress)}%
              </p>

              {collapsedMainCategories[category.name] && (
                <div className="mt-4">
                  {category.mainGoals?.map((goal) => {
                    const subGoalsProgress = calculateProgress(
                      checkedSubGoals[category.name]?.[goal.name],
                      goal.subGoals.length
                    );
                    return (
                      <div key={goal._id} className="ml-6 my-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={checkedMainGoals[category.name]?.[goal.name]}
                              onChange={() => toggleMainGoal(category.name, goal.name)}
                              className="mr-2"
                            />
                            <h3
                              className={`text-lg cursor-pointer ${getTextClass(
                                checkedMainGoals[category.name]?.[goal.name]
                              )}`}
                              onClick={() => toggleGoalCollapse(category.name, goal.name)}
                            >
                              {goal.name}
                            </h3>
                          </div>
                          <button
                            onClick={() => toggleGoalCollapse(category.name, goal.name)}
                            className="text-lg"
                          >
                            {collapsedMainGoals[category.name]?.[goal.name] ? (
                              <FaChevronDown />
                            ) : (
                              <FaChevronUp />
                            )}
                          </button>
                        </div>
                        <div className="relative w-full h-4 mt-2 bg-gray-200 rounded overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-teal-500"
                            style={{ width: `${subGoalsProgress}%`,transition: "width 0.5s ease-in-out" }}
                          ></div>
                        </div>
                        <p className="text-sm mt-2">
                          Sub Goals Progress: {Math.round(subGoalsProgress)}%
                        </p>

                        {collapsedMainGoals[category.name]?.[goal.name] && (
                          <ul className="mt-2">
                            {goal.subGoals?.map((subGoal) => (
                              <li key={subGoal._id} className="ml-8 flex items-center">
                                <input
                                  type="checkbox"
                                  checked={
                                    checkedSubGoals[category.name]?.[goal.name]?.[subGoal.name]
                                  }
                                  onChange={() =>
                                    toggleSubGoal(category.name, goal.name, subGoal.name)
                                  }
                                  className="mr-2"
                                />
                                <span
                                  className={`cursor-pointer ${getTextClass(
                                    checkedSubGoals[category.name]?.[goal.name]?.[subGoal.name]
                                  )}`}
                                >
                                  {subGoal.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Progress;
