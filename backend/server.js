const express = require("express");  // Web freamwork for No
const cors = require("cors");        // Allows frontend to communicate with backend
const dotenv = require("dotenv");    // Loads environment variables from .env
const connectDB = require("./config/db") // Function to connect to MongoDB

// Load environment variables
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create Express app
const app = express();

// Middleware (runs before routes)
// Allows cross-origin requests (frontend <-> backend)
app.use(cors());

// Allows server to accept JSON data in requests
app.use(express.json());

// Route handling
// Any request to /api/auth goes to authRoutes
app.use("/api/auth", require("./routes/authRoutes"));

// Any request to /api/task goes to teasRoutes
app.use("/api/tasks", require("./routes/taskRoutes"));

// Simple test route
app.get("/", (req, res) => {
    res.send("Task Manager API is running");
});

// Set port (from .env or default 5000)
const PORT = process.env.PORT || 5000;

// Start server 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});