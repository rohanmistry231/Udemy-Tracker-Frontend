import React from "react";
import { useTheme } from "../context/ThemeContext"; // Importing the useTheme hook
import { FaPython, FaJs, FaReact, FaNodeJs, FaHtml5, FaCss3Alt } from "react-icons/fa"; // Icons for skills
import { SiTailwindcss, SiMongodb, SiDocker, SiGit } from "react-icons/si"; // More icons for skills

const skills = [
  { 
    name: 'Python', 
    icon: <FaPython size={40} />, 
    description: 'Experienced in data science, machine learning, and automation.',
    level: 'Advanced' // Skill level
  },
  { 
    name: 'JavaScript', 
    icon: <FaJs size={40} />, 
    description: 'Proficient in web development, both frontend and backend.',
    level: 'Intermediate' // Skill level
  },
  { 
    name: 'React', 
    icon: <FaReact size={40} />, 
    description: 'Building responsive web applications with React.',
    level: 'Intermediate' // Skill level
  },
  { 
    name: 'Node.js', 
    icon: <FaNodeJs size={40} />, 
    description: 'Backend development using Node.js and Express.',
    level: 'Advanced' // Skill level
  },
  { 
    name: 'HTML5', 
    icon: <FaHtml5 size={40} />, 
    description: 'Expert in creating semantic and accessible HTML structures.',
    level: 'Advanced' // Skill level
  },
  { 
    name: 'CSS3', 
    icon: <FaCss3Alt size={40} />, 
    description: 'Building responsive layouts and animations with CSS.',
    level: 'Advanced' // Skill level
  },
  { 
    name: 'Tailwind CSS', 
    icon: <SiTailwindcss size={40} />, 
    description: 'Utilizing Tailwind CSS for rapid UI development.',
    level: 'Intermediate' // Skill level
  },
  { 
    name: 'MongoDB', 
    icon: <SiMongodb size={40} />, 
    description: 'Database management with MongoDB for NoSQL applications.',
    level: 'Intermediate' // Skill level
  },
  { 
    name: 'Docker', 
    icon: <SiDocker size={40} />, 
    description: 'Containerization with Docker for deployment and scalability.',
    level: 'Beginner' // Skill level
  },
  { 
    name: 'Git', 
    icon: <SiGit size={40} />, 
    description: 'Version control using Git and GitHub for collaborative projects.',
    level: 'Advanced' // Skill level
  }
];

const Skills = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className={`container mx-auto px-4 py-10 mt-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <h2 className="text-3xl font-semibold mb-6 text-center">
       👨🏻‍💻 Skills 👨🏻‍💻
      </h2>

      {/* Skills Section */}
      <div className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {skills.map((skill, index) => (
            <div key={index} className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-md text-center`}>
                <div className={`flex justify-center items-center mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{skill.icon}</div>
                <h3 className="font-semibold">{skill.name}</h3>
                <p className="text-gray-600 text-sm mt-2">{skill.description}</p>
                <div className="mt-4">
                <span className="font-semibold">{skill.level}</span>
                </div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
