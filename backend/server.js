const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware
const courseRoutes = require("./routes/courseRoutes");
const noteRoutes = require("./routes/noteRoutes");
require('dotenv').config();

const app = express();

// CORS configuration to allow all origins temporarily (Development Mode)
app.use(cors({
  origin: "*", // Replace with specific domain(s) in production: ['http://localhost:3000', 'https://your-frontend.com']
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Middleware to parse incoming requests
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection failed", err));

// Routes
app.use("/courses", courseRoutes);
app.use("/courses/:courseId/notes", noteRoutes);

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
