import { createContext, useState, useContext, useEffect } from "react";

// Updated Colors based on Udemy palette
const themes = {
  dark: {
    background: "#111827",
    color: "#e5e7eb",
    scrollbarTrack: "#1f2937", // Darker gray for track
    scrollbarThumb: "#4b5563", // Medium gray for thumb
    scrollbarThumbHover: "#6b7280", // Slightly lighter gray for hover
  },
  light: {
    background: "#ffffff",
    color: "#111827",
    scrollbarTrack: "#e5e7eb", // Light gray for track
    scrollbarThumb: "#111827", // Dark color for thumb
    scrollbarThumbHover: "#374151", // Slightly darker gray for hover
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const currentTheme = themes[theme];
    document.body.style.backgroundColor = currentTheme.background;
    document.body.style.color = currentTheme.color;

    // Apply scrollbar colors based on the theme
    document.documentElement.style.setProperty(
      "--scrollbar-track-color",
      currentTheme.scrollbarTrack
    );
    document.documentElement.style.setProperty(
      "--scrollbar-thumb-color",
      currentTheme.scrollbarThumb
    );
    document.documentElement.style.setProperty(
      "--scrollbar-thumb-hover-color",
      currentTheme.scrollbarThumbHover
    );
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
