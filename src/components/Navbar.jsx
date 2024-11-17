import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();  // Use useLocation hook to track current path

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isDarkMode = theme === 'dark';

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'text-purple-500'  // Active link in purple
      : `${isDarkMode ? 'text-gray-300' : 'text-gray-800'} hover:text-purple-500`;  // Default link style
  };

  return (
    <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md fixed w-full top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex-shrink-0">
            <Link to="/" className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-3xl font-bold`}>
              Udemy Tracker
            </Link>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className={`transition duration-150 ${getLinkClass('/')}`}>
              Home
            </Link>
            <Link to="/courses" className={`transition duration-150 ${getLinkClass('/courses')}`}>
              Courses
            </Link>
            <Link to="/notes" className={`transition duration-150 ${getLinkClass('/notes')}`}>
              Notes
            </Link>
            <Link to="/progress" className={`transition duration-150 ${getLinkClass('/progress')}`}>
              Progress
            </Link>
            <Link to="/certificate" className={`transition duration-150 ${getLinkClass('/certificate')}`}>
              Certificates
            </Link>
            <Link to="/profile" className={`transition duration-150 ${getLinkClass('/profile')}`}>
              Profile
            </Link>
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

      <div
        className={`md:hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg space-y-2 px-4 pt-2 pb-3 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        } fixed top-14 right-0 h-screen w-64 overflow-y-auto z-40`} 
      >
        <Link to="/" className={`block ${getLinkClass('/')} py-2`} onClick={toggleMenu}>
          Home
        </Link>
        <Link to="/courses" className={`block ${getLinkClass('/courses')} py-2`} onClick={toggleMenu}>
          Courses
        </Link>
        <Link to="/notes" className={`block ${getLinkClass('/notes')} py-2`} onClick={toggleMenu}>
          Notes
        </Link>
        <Link to="/progress" className={`block ${getLinkClass('/progress')} py-2`} onClick={toggleMenu}>
          Progress
        </Link>
        <Link to="/certificate" className={`block ${getLinkClass('/certificate')} py-2`} onClick={toggleMenu}>
          Certificates
        </Link>
        <Link to="/profile" className={`block ${getLinkClass('/profile')} py-2`} onClick={toggleMenu}>
          Profile
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
