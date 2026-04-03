const mongoose = require("mongoose");

// Define struture of a User in the database
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // must be provided
        },
        email: {
            type: String,
            required: true,
            unique: true,   // no duplicate emails allowed
        },
        password: {
            type: String,
            required: true, // will be stored as hashed password
        },   
    },
    {
        timestamps: true,   // automatically adds createdAt & updatedAt
    }
);

// Export model so we can use it in controllers
module.exports = mongoose.model("User", userSchema);