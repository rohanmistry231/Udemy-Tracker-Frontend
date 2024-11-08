import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Progress = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const categories = [
    "Data Science",
    "Database",
    "IT & Software",
    "Web Development",
    "Business",
    "Filmmaking",
    "Graphics Design",
    "Marketing",
    "Office Productivity",
    "Music",
    "Cloud",
    "DevOps",
    "Health & Fitness",
    "Language",
    "Operating System",
    "Personal Development",
    "Version Control",
  ];

  const targetGoals = {
    "Data Science": ["Algorithms", "Artificial Intelligence"],
    "Database": ["DBMS", "MySQL", "NoSQL", "SQL"],
    "IT & Software": [
      "API",
      "Artificial Intelligence",
      "Business Intelligence",
      "Network & Security",
    ],
    "Web Development": ["API", "Backend", "Frontend", "Full Stack"],
    "Business": ["Business Strategy", "Digital Marketing", "E-Commerce"],
  };

  const subGoals = {
    "Algorithms": ["Sorting", "Graph Theory", "Dynamic Programming"],
    "Artificial Intelligence": [
      "Machine Learning",
      "Neural Networks",
      "Natural Language Processing",
    ],
  };

  const [checkedCategories, setCheckedCategories] = useState(() => {
    const storedCategories = JSON.parse(
      localStorage.getItem("checkedCategories")
    );
    return (
      storedCategories ||
      categories.reduce((acc, category) => ({ ...acc, [category]: false }), {})
    );
  });

  const [checkedGoals, setCheckedGoals] = useState(() => {
    const storedGoals = JSON.parse(localStorage.getItem("checkedGoals"));
    return (
      storedGoals ||
      Object.keys(targetGoals).reduce(
        (acc, category) => ({
          ...acc,
          [category]: targetGoals[category]?.reduce((goalAcc, goal) => {
            goalAcc[goal] = false;
            return goalAcc;
          }, {}),
        }),
        {}
      )
    );
  });

  const [checkedSubGoals, setCheckedSubGoals] = useState(() => {
    const storedSubGoals = JSON.parse(localStorage.getItem("checkedSubGoals"));
    return (
      storedSubGoals ||
      Object.keys(subGoals).reduce(
        (acc, goal) => ({
          ...acc,
          [goal]: subGoals[goal]?.reduce((subAcc, subGoal) => {
            subAcc[subGoal] = false;
            return subAcc;
          }, {}),
        }),
        {}
      )
    );
  });

  const [collapsedCategories, setCollapsedCategories] = useState(
    categories.reduce((acc, category) => ({ ...acc, [category]: false }), {})
  );

  const [collapsedGoals, setCollapsedGoals] = useState(
    Object.keys(targetGoals).reduce(
      (acc, category) => ({
        ...acc,
        [category]: targetGoals[category]?.reduce((goalAcc, goal) => {
          goalAcc[goal] = false;
          return goalAcc;
        }, {}),
      }),
      {}
    )
  );

  useEffect(() => {
    // Save the checked states to localStorage whenever they change
    localStorage.setItem(
      "checkedCategories",
      JSON.stringify(checkedCategories)
    );
  }, [checkedCategories]);

  useEffect(() => {
    // Save the checked goals to localStorage whenever they change
    localStorage.setItem("checkedGoals", JSON.stringify(checkedGoals));
  }, [checkedGoals]);

  useEffect(() => {
    // Save the checked subgoals to localStorage whenever they change
    localStorage.setItem("checkedSubGoals", JSON.stringify(checkedSubGoals));
  }, [checkedSubGoals]);

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

  const toggleCategoryCollapse = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleGoalCollapse = (category, goal) => {
    setCollapsedGoals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [goal]: !prev[category][goal],
      },
    }));
  };

  const getProgress = (checked, total) => {
    if (!total) return 0;
    return (Object.values(checked).filter(Boolean).length / total) * 100;
  };

  const overallProgress = getProgress(checkedCategories, categories.length);

  const getTextClass = (checked) => {
    return checked ? "text-green-500" : ""; // Apply green text if checked
  };

  return (
    <div
      className={isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}
    >
      <h2 className="text-3xl font-semibold text-center py-4 mt-14 flex justify-center items-center">
        📈 Progress Tracker 📈
      </h2>

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

      {categories.map((category) => (
        <div key={category} className="my-6 mx-4">
          <div
            className={
              isDarkMode
                ? "rounded-lg shadow-lg p-4 bg-gray-800 text-white"
                : "border rounded-lg shadow-lg p-4 bg-white text-black"
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={checkedCategories[category]}
                  onChange={() => toggleCategory(category)}
                  className="mr-2"
                />
                <h2
                  className={`text-xl font-semibold cursor-pointer ${getTextClass(
                    checkedCategories[category]
                  )}`}
                  onClick={() => toggleCategoryCollapse(category)}
                >
                  {category}
                </h2>
              </div>
              <button
                onClick={() => toggleCategoryCollapse(category)}
                className="text-lg"
              >
                {collapsedCategories[category] ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronUp />
                )}
              </button>
            </div>

            {collapsedCategories[category] && targetGoals[category] && (
              <div className="mt-4">
                {targetGoals[category]?.map((goal) => (
                  <div key={goal} className="ml-6 my-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checkedGoals[category]?.[goal]}
                          onChange={() => toggleGoal(category, goal)}
                          className="mr-2"
                        />
                        <h3
                          className={`text-lg cursor-pointer ${getTextClass(
                            checkedGoals[category]?.[goal]
                          )}`}
                          onClick={() => toggleGoalCollapse(category, goal)}
                        >
                          {goal}
                        </h3>
                      </div>
                      <button
                        onClick={() => toggleGoalCollapse(category, goal)}
                        className="text-lg"
                      >
                        {collapsedGoals[category]?.[goal] ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronUp />
                        )}
                      </button>
                    </div>

                    {collapsedGoals[category]?.[goal] && subGoals[goal] && (
                      <div className="mt-2">
                        {subGoals[goal]?.map((subGoal) => (
                          <div key={subGoal} className="ml-6 my-2">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={checkedSubGoals[goal]?.[subGoal]}
                                onChange={() => toggleSubGoal(goal, subGoal)}
                                className="mr-2"
                              />
                              <span
                                className={`${getTextClass(
                                  checkedSubGoals[goal]?.[subGoal]
                                )}`}
                              >
                                {subGoal}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="my-2">
                      <label className="text-sm">Progress:</label>
                      <div className="relative w-full h-4 mt-2 bg-gray-200 rounded overflow-hidden">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-indigo-600"
                          style={{
                            width: `${getProgress(
                              checkedSubGoals[goal],
                              subGoals[goal]?.length
                            )}%`,
                            transition: "width 0.5s ease-in-out",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="my-2">
                  <label className="text-sm">Overall Goal Progress:</label>
                  <div className="relative w-full h-4 mt-2 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-teal-500"
                      style={{
                        width: `${getProgress(
                          checkedGoals[category],
                          targetGoals[category]?.length
                        )}%`,
                        transition: "width 0.5s ease-in-out",
                      }}
                    />
                  </div>
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
