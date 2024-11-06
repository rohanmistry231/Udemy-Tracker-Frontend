import { createContext, useState, useContext, useEffect } from 'react';

// Colors based on Udemy palette
const themes = {
  dark: {
    background: '#111827',
    color: '#be30f6',
  },
  light: {
    background: '#ffffff',
    color: '#111827',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or default to 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // Toggle between dark and light modes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme); // Persist theme in localStorage
  };

  useEffect(() => {
    // Apply theme colors to document body
    document.body.style.backgroundColor = themes[theme].background;
    document.body.style.color = themes[theme].color;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
