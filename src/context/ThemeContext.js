import { createContext, useState, useContext, useEffect } from 'react';

// Colors based on Udemy palette
const themes = {
  dark: {
    background: '#000000',
    color: '#be30f6',
  },
  light: {
    background: '#ffffff',
    color: '#000000',
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Switch between dark and light modes
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
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
