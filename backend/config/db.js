const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDB = async () => {
    try {
      // Connect using the connection string from .env
      const conn = await mongoose.connect(process.env.MONGO_URI);

      // Log success message
      console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      // If connecion fails, print error and stop app
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
};

// Export function so other files can use it
module.exports = connectDB;