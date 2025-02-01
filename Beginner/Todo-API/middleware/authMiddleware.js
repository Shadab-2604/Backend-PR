// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/UserTemp");
exports.protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized" });
  }
};