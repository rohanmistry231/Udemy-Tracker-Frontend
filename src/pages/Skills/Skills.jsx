import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";

const Skills = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [loading, setLoading] = useState(true); // Loading state
  const [skills, setSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null); // For editing
  const [formData, setFormData] = useState({ name: "", description: "", level: "", icon: "" });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("https://udemy-tracker.vercel.app/skill");
        setSkills(response.data);
      } catch (err) {
        console.error("Error fetching skills data");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  // Dynamically render the icon component based on the icon name
  const renderIcon = (iconName) => {
    let IconComponent = FaIcons[iconName] || SiIcons[iconName];
    return IconComponent ? <IconComponent size={40} /> : <span className="text-gray-400">(No Icon)</span>;
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle adding/updating a skill
  const handleSave = async () => {
    try {
      if (currentSkill) {
        // Update skill
        await axios.put(`https://udemy-tracker.vercel.app/skill/${currentSkill._id}`, formData);
        setSkills((prevSkills) =>
          prevSkills.map((skill) => (skill._id === currentSkill._id ? { ...skill, ...formData } : skill))
        );
      } else {
        // Add skill
        const response = await axios.post("https://udemy-tracker.vercel.app/skill", formData);
        setSkills([...skills, response.data]);
      }
      setShowModal(false);
      setFormData({ name: "", description: "", level: "", icon: "" });
      setCurrentSkill(null);
    } catch (err) {
      alert("Error saving skill. Please try again.");
    }
  };

  // Handle deleting a skill
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await axios.delete(`https://udemy-tracker.vercel.app/skill/${id}`);
        setSkills(skills.filter((skill) => skill._id !== id));
      } catch (err) {
        alert("Error deleting skill. Please try again.");
      }
    }
  };

  // Open modal for adding or editing skill
  const openModal = (skill = null) => {
    setCurrentSkill(skill);
    setFormData(skill || { name: "", description: "", level: "", icon: "" });
    setShowModal(true);
  };

  return (
    <div
      className={`container mx-auto px-4 py-10 mt-8 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex justify-center items-center mb-6">
        <h2 className="text-3xl font-semibold">👨🏻‍💻 Skills 👨🏻‍💻</h2>
      </div>
      <div className="flex justify-center items-center mb-6">
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-md ${
            isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
          }`}
          onClick={() => openModal()}
        >
          <AiOutlinePlus size={20} />
          Add Skill
        </button>
      </div>

      {/* Skills Section */}
      {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-60 mb-60">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
      <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className={`relative p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-gray-100"
            } rounded-lg shadow-md text-center`}
          >
            {/* Delete button */}
            <button
              className={`absolute top-2 left-2 text-gray-500`}
              onClick={() => handleDelete(skill._id)}
            >
              <AiOutlineDelete size={20} />
            </button>

            {/* Update button */}
            <button
              className={`absolute top-2 right-2 text-gray-500`}
              onClick={() => openModal(skill)}
            >
              <FiEdit size={20} />
            </button>

            <div
              className={`flex justify-center items-center mb-4 ${
                isDarkMode ? "text-purple-400" : "text-purple-600"
              }`}
            >
              {renderIcon(skill.icon)}
            </div>
            <h3 className="font-semibold">{skill.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{skill.description}</p>
            <div className="mt-4">
              <span className="font-semibold">{skill.level}</span>
            </div>
          </div>
        ))}
      </div>
      </>
      )}


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div
            className={`p-6 w-full max-w-lg ${
              isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
            } rounded-lg shadow-lg`}
          >
            <h2 className="text-2xl font-semibold mb-4">
              {currentSkill ? "Update Skill" : "Add Skill"}
            </h2>
            <div className="mb-4">
              <label className="block text-sm mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-2 rounded-md ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 rounded-md ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Level</label>
              <input
                type="text"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className={`w-full p-2 rounded-md ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-2">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className={`w-full p-2 rounded-md ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
                }`}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-purple-500 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
