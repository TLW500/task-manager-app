const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (only logged-in users can access)
const protect = async (req, res, next) => {
    let token;

    // Check if request has Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
          // Extract token from header
          token = req.headers.authorization && req.headers.authorization.split(" ")[1];

          // Verify token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Get user from database (excluding password)
          req.user = await User.findById(decoded.id).select("-password");

          // Continue to next function
          next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    // If not token
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
