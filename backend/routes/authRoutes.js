const express = require("express");
const router = express.Router();
const User = require("../models/User");
router.get("/", async (req, res) => {
  try {

    const users = await User.find();

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST /api/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();

    res.status(201).json({ userId: savedUser._id, name: savedUser.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// POST /api/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", userId: user._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;