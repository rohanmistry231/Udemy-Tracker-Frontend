// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import the theme context

const Navbar = () => {
  const { theme, toggleTheme } = useTheme(); // Use theme context
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isDarkMode = theme === 'dark'; // Check if dark mode is active

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed w-full top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className={`${isDarkMode ? 'text-white' : 'text-purple-600'} text-3xl font-bold`}>
              Udemy Tracker
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/courses" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} hover:text-purple-500 transition duration-150`}>
              Courses
            </Link>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-lg shadow-md border focus:outline-none transition duration-300 ${
                isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              style={{ width: '100px' }}
            >
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className={`mr-2 px-2 py-1 rounded-lg shadow-md border focus:outline-none transition duration-300 ${
                isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-300'
              }`}
              style={{ width: '50px' }}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={toggleMenu} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'} focus:outline-none`}>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-2 px-4 pt-2 pb-3 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } fixed top-14 right-0 h-screen w-64 overflow-y-auto z-40`}
        style={{ borderRadius: '10px' }}
      >
        <Link to="/courses" className={`block ${isDarkMode ? 'text-gray-300' : 'text-gray-800'} hover:text-purple-500 py-2`} onClick={toggleMenu}>
          Courses
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
