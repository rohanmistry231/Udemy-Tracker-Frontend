// src/components/Progress.js
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext'; // Import theme context

const Progress = () => {
  const { theme } = useTheme(); // Use theme context
  const isDarkMode = theme === 'dark';

  // Initial structure of main targets and sub-targets
  const [targets, setTargets] = useState([
    {
      name: 'Python',
      isCompleted: false,
      subTargets: [
        { name: 'Data Types', isCompleted: false },
        { name: 'Loops', isCompleted: false },
        { name: 'Functions', isCompleted: false },
        { name: 'Modules', isCompleted: false }
      ]
    },
    {
      name: 'JavaScript',
      isCompleted: false,
      subTargets: [
        { name: 'Variables', isCompleted: false },
        { name: 'Functions', isCompleted: false },
        { name: 'DOM Manipulation', isCompleted: false },
        { name: 'ES6 Features', isCompleted: false }
      ]
    }
  ]);

  // Toggle sub-target completion status
  const toggleSubTargetCompletion = (mainTargetIndex, subTargetIndex) => {
    const updatedTargets = targets.map((mainTarget, mIndex) => {
      if (mIndex === mainTargetIndex) {
        const updatedSubTargets = mainTarget.subTargets.map((subTarget, sIndex) => {
          if (sIndex === subTargetIndex) {
            return { ...subTarget, isCompleted: !subTarget.isCompleted };
          }
          return subTarget;
        });
        // Check if all sub-targets are completed
        const allCompleted = updatedSubTargets.every(subTarget => subTarget.isCompleted);
        return { ...mainTarget, subTargets: updatedSubTargets, isCompleted: allCompleted };
      }
      return mainTarget;
    });

    setTargets(updatedTargets);
  };

  return (
    <div className={`p-6 rounded-lg shadow-md mt-16 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-2xl font-bold mb-4">Progress Tracker</h2>
      {targets.map((mainTarget, mainIndex) => (
        <div key={mainIndex} className="mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={mainTarget.isCompleted}
              readOnly
              className="mr-2"
            />
            <h3 className={`text-xl font-semibold ${mainTarget.isCompleted ? 'text-green-500' : ''}`}>
              {mainTarget.name}
            </h3>
          </div>
          <div className="ml-4 mt-2">
            {mainTarget.subTargets.map((subTarget, subIndex) => (
              <div key={subIndex} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={subTarget.isCompleted}
                  onChange={() => toggleSubTargetCompletion(mainIndex, subIndex)}
                  className="mr-2"
                />
                <label className={`${subTarget.isCompleted ? 'text-gray-400 line-through' : ''}`}>
                  {subTarget.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Progress;
