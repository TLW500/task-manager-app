const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (only logged-in users can access)
const protect = async (req, res, next) => {
    let token;

    // Check if request has Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
          // Extract token from header
          token = req.headers.authorization.split(" ")[1];

          // Verify token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          // Get user from database (excluding password)
          const user = await User.findById(decoded.id).select("-password");

          // Make sure the user still exists
          if (!user) {
            return res.status(401).json({
                message: "Not authorized, user not found",
            });
         }

         // Attach user to request object
         req.user = user;

        // Continue to next function
        return next();

        } catch (error) {
           return res.status(401).json({ 
              message: "Not authorized, token failed",
            });
        }
    }

    // If not token
    return res.status(401).json({ 
        message: "Not authorized, no token",
    });
};

module.exports = { protect };
