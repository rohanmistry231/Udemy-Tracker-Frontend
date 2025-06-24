// src/components/Footer.js
import React from "react";
import { useTheme } from "../context/ThemeContext"; // Adjust the path if necessary

const Footer = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark"; // Check if dark mode is active

  return (
    <footer
      className={`${isDarkMode ? "bg-gray-800" : "bg-white"} text-${
        isDarkMode ? "white" : "gray-800"
      } py-4 shadow-[0_4px_8px_0px_rgba(0,0,0,0.4)]`}
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        {/* Left: Brand and Copyright */}
        <div className="text-sm text-center sm:text-left mb-2 sm:mb-0">
          &copy; {new Date().getFullYear()} Own Udemy Tracker. All Rights
          Reserved.
        </div>

        {/* Right: Contact Email */}
        <div className="text-sm text-center sm:text-right">
          <a
            href="mailto:admin@udemyhub.com"
            className="hover:text-blue-500 transition duration-300"
          >
            own.ai.231@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
