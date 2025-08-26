// backend/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      console.log("Token found:", token); // ✅ Log the token for debugging

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, so proceed
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// ✅ ADDED: Middleware to check if the user is a broker
const broker = (req, res, next) => {
  if (req.user && req.user.role === 'broker') {
    next(); // User is a broker, so proceed
  } else {
    res.status(401);
    throw new Error('Not authorized as a broker');
  }
};

// ✅ UPDATED: Export statement to include the new 'broker' middleware
export { protect, admin, broker };