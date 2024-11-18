import React from "react";
import { useTheme } from "../context/ThemeContext"; // Importing the useTheme hook

const projects = [
  {
    title: "Udemy Tracker",
    description: "A MERN stack app to track and manage online courses.",
    tech: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    link: "https://github.com/rohanmistry231/udemy-tracker",
    liveDemo: "https://yourlivewebsite.com",
  },
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio website to showcase skills and projects.",
    tech: ["HTML", "CSS", "JavaScript", "React"],
    link: "https://github.com/yourusername/portfolio",
    liveDemo: "https://yourliveportfolio.com",
  },
  {
    title: "E-commerce App",
    description:
      "Full-stack e-commerce web application with payment integration.",
    tech: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://github.com/yourusername/e-commerce-app",
    liveDemo: "https://yourecommerceapp.com",
  },
];

const Projects = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div
      className={`container mx-auto px-4 py-10 mt-8 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">
        💼 Projects 💼
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className={`p-6 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"} rounded-lg shadow-md flex flex-col`}
          >
            <h3 className={`text-xl font-bold ${isDarkMode ? "text-purple-400" : "text-black"}`}>{project.title}</h3>
            <p className="text-gray-400 mt-3">{project.description}</p>

            {/* Tech Stack Section */}
            <div className="flex flex-wrap items-center mt-4 gap-4">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">Tech Stack:</h4>
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((tech, idx) => (
                    <li
                      key={idx}
                      className={`text-sm ${isDarkMode ? "bg-gray-200 opacity-80 text-black" : "bg-gray-200 text-gray-600"} px-2 py-1 rounded-lg`}
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Links Section */}
            <div className="flex mt-4 space-x-4">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                GitHub
              </a>
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
