import React, { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaChevronDown, FaChevronUp, FaPlus } from "react-icons/fa";

const Progress = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [loading, setLoading] = useState(true);
  const [mainCategories, setMainCategories] = useState([]);
  const [checkedMainCategories, setCheckedMainCategories] = useState({});
  const [checkedMainGoals, setCheckedMainGoals] = useState({});
  const [checkedSubGoals, setCheckedSubGoals] = useState({});
  const [collapsedMainCategories, setCollapsedMainCategories] = useState({});
  const [collapsedMainGoals, setCollapsedMainGoals] = useState({});
  const [priorityFilter, setPriorityFilter] = useState("");

   // Modal states
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalType, setModalType] = useState("");
   const [newMainCategoryName, setNewMainCategoryName] = useState("");
   const [selectedMainCategory, setSelectedMainCategory] = useState("");
   const [newMainGoalName, setNewMainGoalName] = useState("");
   const [selectedMainGoal, setSelectedMainGoal] = useState("");
   const [newSubGoalName, setNewSubGoalName] = useState("");

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://udemy-tracker.vercel.app/main-category");
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
      } finally{
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addMainCategory = async () => {
    if (!newMainCategoryName.trim()) return;
    const newCategory = { name: newMainCategoryName, mainGoals: [] };

    try {
      const response = await fetch("https://udemy-tracker.vercel.app/main-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategory),
      });
      if (response.ok) {
        const savedCategory = await response.json();
        setMainCategories((prev) => [...prev, savedCategory]);
        setIsModalOpen(false);
        setNewMainCategoryName("");
      }
    } catch (error) {
      console.error("Failed to add Main Category:", error);
    }
  };

  const addMainGoal = async () => {
    if (!selectedMainCategory || !newMainGoalName.trim()) return;
    try {
      const response = await fetch(
        `https://udemy-tracker.vercel.app/main-category/${selectedMainCategory}/main-goal`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newMainGoalName }),
        }
      );
      if (response.ok) {
        const updatedCategory = await response.json();
        setMainCategories((prev) =>
          prev.map((category) =>
            category.name === updatedCategory.name ? updatedCategory : category
          )
        );
        setIsModalOpen(false);
        setSelectedMainCategory("");
        setNewMainGoalName("");
      }
    } catch (error) {
      console.error("Failed to add Main Goal:", error);
    }
  };

  const addSubGoal = async () => {
    if (!selectedMainCategory || !selectedMainGoal || !newSubGoalName.trim()) return;
    try {
      const response = await fetch(
        `https://udemy-tracker.vercel.app/main-category/${selectedMainCategory}/main-goal/${selectedMainGoal}/sub-goal`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newSubGoalName }),
        }
      );
      if (response.ok) {
        const updatedCategory = await response.json();
        setMainCategories((prev) =>
          prev.map((category) =>
            category.name === updatedCategory.name ? updatedCategory : category
          )
        );
        setIsModalOpen(false);
        setSelectedMainCategory("");
        setSelectedMainGoal("");
        setNewSubGoalName("");
      }
    } catch (error) {
      console.error("Failed to add Sub Goal:", error);
    }
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  // Function to update the backend
  const updateBackend = async (url, method, body) => {
    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error("Failed to update backend:", error);
    }
  };

  // Toggle functions with backend updates
  const toggleMainCategory = (category) => {
    const newCheckedState = !checkedMainCategories[category];
    setCheckedMainCategories((prev) => ({
      ...prev,
      [category]: newCheckedState,
    }));

    // Update backend
    const categoryId = mainCategories.find((cat) => cat.name === category)._id;
    updateBackend(`https://udemy-tracker.vercel.app/main-category/${categoryId}`, "PUT", {
      isChecked: newCheckedState,
    });
  };

  const toggleMainGoal = (category, goal) => {
    const newCheckedState = !checkedMainGoals[category][goal];
    setCheckedMainGoals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [goal]: newCheckedState,
      },
    }));

    // Update backend
    const categoryId = mainCategories.find((cat) => cat.name === category)._id;
    const goalId = mainCategories
      .find((cat) => cat.name === category)
      .mainGoals.find((g) => g.name === goal)._id;

    updateBackend(`https://udemy-tracker.vercel.app/main-category/${categoryId}/main-goal/${goalId}`, "PUT", {
      isChecked: newCheckedState,
    });
  };

  const toggleSubGoal = (category, goal, subGoal) => {
    const newCheckedState = !checkedSubGoals[category][goal][subGoal];
    setCheckedSubGoals((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [goal]: {
          ...prev[category][goal],
          [subGoal]: newCheckedState,
        },
      },
    }));

    // Update backend
    const categoryId = mainCategories.find((cat) => cat.name === category)._id;
    const goalId = mainCategories
      .find((cat) => cat.name === category)
      .mainGoals.find((g) => g.name === goal)._id;
    const subGoalId = mainCategories
      .find((cat) => cat.name === category)
      .mainGoals.find((g) => g.name === goal)
      .subGoals.find((sg) => sg.name === subGoal)._id;

    updateBackend(
      `https://udemy-tracker.vercel.app/main-category/${categoryId}/main-goal/${goalId}/sub-goal/${subGoalId}`,
      "PUT",
      { isChecked: newCheckedState }
    );
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

  const calculateProgress = (checkedItems, totalItems) =>
    totalItems > 0 ? (Object.values(checkedItems).filter(Boolean).length / totalItems) * 100 : 0;

  const filteredCategories = mainCategories.filter(
    (category) => priorityFilter === "" || category.priority === priorityFilter
  );

  const overallProgress = calculateProgress(checkedMainCategories, mainCategories.length);

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
      <div className="flex flex-col sm:flex-row sm:justify-center sm:space-x-4 space-y-3 sm:space-y-0 mb-6 px-4">
  <button
    onClick={() => handleModalOpen("MainCategory")}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
  >
    <FaPlus className="mr-2" /> Add Main Category
  </button>
  <button
    onClick={() => handleModalOpen("MainGoal")}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
  >
    <FaPlus className="mr-2" /> Add Main Target Goal
  </button>
  <button
    onClick={() => handleModalOpen("SubGoal")}
    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 flex items-center"
  >
    <FaPlus className="mr-2" /> Add Sub Goal
  </button>
</div>

      {/* Modal */}
      {isModalOpen && (
  <div className={`fixed inset-0 ${isDarkMode ? "bg-black bg-opacity-70" : "bg-black bg-opacity-50"} flex items-center justify-center z-50`}>
    <div className={`rounded-lg p-6 w-96 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"} z-50`}>
      {modalType === "MainCategory" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Add Main Category</h2>
          <input
            type="text"
            value={newMainCategoryName}
            onChange={(e) => setNewMainCategoryName(e.target.value)}
            placeholder="Category Name"
            className={`w-full p-2 mb-4 border rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={addMainCategory}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          </div>
        </>
      )}

      {modalType === "MainGoal" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Add Main Goal</h2>
          <select
            value={selectedMainCategory}
            onChange={(e) => setSelectedMainCategory(e.target.value)}
            className={`w-full p-2 mb-4 border rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <option value="" disabled className={`${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
              Select Main Category
            </option>
            {mainCategories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={newMainGoalName}
            onChange={(e) => setNewMainGoalName(e.target.value)}
            placeholder="Main Goal Name"
            className={`w-full p-2 mb-4 border rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={addMainGoal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Main Goal
            </button>
          </div>
        </>
      )}

      {modalType === "SubGoal" && (
        <>
          <h2 className="text-xl font-semibold mb-4">Add Sub Goal</h2>
          <select
            value={selectedMainCategory}
            onChange={(e) => {
              setSelectedMainCategory(e.target.value);
              setSelectedMainGoal("");
            }}
            className={`w-full p-2 mb-4 border rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          >
            <option value="" disabled>
              Select Main Category
            </option>
            {mainCategories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedMainGoal}
            onChange={(e) => setSelectedMainGoal(e.target.value)}
            className={`w-full p-2 mb-4 border rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
            disabled={!selectedMainCategory}
          >
            <option value="" disabled>
              Select Main Goal
            </option>
            {selectedMainCategory &&
              mainCategories
                .find((category) => category._id === selectedMainCategory)
                ?.mainGoals?.map((goal) => (
                  <option key={goal._id} value={goal._id}>
                    {goal.name}
                  </option>
                ))}
          </select>
          <input
            type="text"
            value={newSubGoalName}
            onChange={(e) => setNewSubGoalName(e.target.value)}
            placeholder="Sub Goal Name"
            className={`w-full p-2 mb-4 border rounded ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={addSubGoal}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={!selectedMainCategory || !selectedMainGoal || !newSubGoalName.trim()}
            >
              Add Sub Goal
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}
{loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-10 mb-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
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
      </>
      )}
    </div>
  );
};

export default Progress;
