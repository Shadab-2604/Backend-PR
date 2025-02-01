// controllers/authController.js
const User = require("../models/UserTemp");
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.json({ token: user.getSignedJwtToken() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) return res.status(401).json({ error: "Invalid credentials" });
    res.json({ token: user.getSignedJwtToken() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};