// index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Wrap the App component with ThemeProvider to provide theme context */}
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
