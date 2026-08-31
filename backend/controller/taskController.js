const Task = require("../models/Task");

// Get all tasks for logged-in user
const getTasks = async (req, res) => {
    try {
        // Find tasks that belong to the current user
        const tasks = await Task.find({ user: req.user._id })
        .sort({ createdAt: -1 });

        res.json(tasks);
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new task
const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, dueTime } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required",
            });
        }

        const task = await Task.create({
            user: req.user._id,
            title: title.trim(),
            description,
            dueDate,
            dueTime,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update task
const updateTask = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "No task data was received.",
            });
        }

        const task = await Task.findById(req.params.id);

        // Check if task exists
        if (!task) {
            return res.status(404).json({ message: "Task not found "});
        }

        // Ensure user owns this task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        if (req.body.title !== undefined && !req.body.title.trim()) {
            return res.status(400).json({
                message: "Task title is required",
            });
        }

        // Update fields if provided
        task.title = 
          req.body.title !== undefined
            ? req.body.title.trim()
            : task.title;
        
        task.description = req.body.description ?? task.description;
        task.completed = req.body.completed ?? task.completed;
        task.dueDate = req.body.dueDate ?? task.dueDate;
        task.dueTime = req.body.dueTime ?? task.dueTime;

        const updatedTask = await task.save();

        res.json(updatedTask);
    }   catch (error) {
        console.error("UPDATE TASK ERROR:", error);

        res.status(500).json({ 
            message: error.message,
        });
    }
};

// Delete task
const deleteTask = async (req, res ) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found "});
        }

        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized "});
        }

        await task.deleteOne();

        res.json({ message: "Task removed" });
    }   catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleTaskCompletion = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        // Make sure the logged-in user owns this task
        if (task.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
            });
        }

        task.completed = !task.completed;

        const updatedTask = await task.save();

        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {getTasks, createTask, updateTask, deleteTask, toggleTaskCompletion };