const User = require("../models/User");
const bcrypt = require("bcrypt");  // used to hash passwords
const jwt = require("jsonwebtoken");  // used for login tokens

// Function to create a JWT token
const generateToken = (id) => {
    return jwt.sign(
        { id },                  // payload (user id)
        process.env.JWT_SECRET,  // secret key
        { expiresIn: "7d" }      // token expires in 7 days
    );
};

// Register new user
const registerUser = async (req, res) => {
    try {
        // Get data from request body
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exist "});
        }

        // Hash password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in database
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Send response with user info + token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    }   catch (error) {
        res.status(500).json ({ message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check password matches
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password " });
        }
    } catch (error) {
            res.status(500).json({ message: error.message });
    }
};

// Export functions
module.exports = { registerUser, loginUser };