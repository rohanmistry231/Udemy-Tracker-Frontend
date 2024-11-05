const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet"); // Import Helmet
const courseRoutes = require("./routes/courseRoutes");
const noteRoutes = require("./routes/noteRoutes");
require("dotenv").config();

const app = express();

// Configure Helmet to allow Vercel live script
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'", "https://vercel.live"],
        "connect-src": ["'self'", "https://vercel.live"],
      },
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection failed", err));

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the API!"); // Basic response for root path
});

// API Routes
app.use("/courses", courseRoutes);
app.use("/courses/:courseId/notes", noteRoutes);
app.use("/notes", noteRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
