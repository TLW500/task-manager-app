const mongoose = require("mongoose");

// Define structure of a Task
const taskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // links task to a specific user
            required: true,
        },
        title: {
            type: String,
            required: true, // task must have a title
        },
        description: {
            type: String,
            default: "", // optional
        },

        dueDate: {
            type: Date,
        },

        dueTime: {
            type: String,
            defualt:"",
        },
        
        completed: {
            type: Boolean,
            default: false, // starts as not completed
        },
    },
    {
        timestamps: true,
    }
);

// Export Task model
module.exports = mongoose.model("Task", taskSchema);