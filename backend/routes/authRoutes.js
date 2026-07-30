const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const rateLimit = require("../middleware/rateLimit");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeText = (value = "") => String(value).trim();

const formatUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  location: user.location,
  skillOffered: user.skillOffered,
  skillWanted: user.skillWanted,
  availability: user.availability,
  profileImage: user.profileImage
});

const getDefaultNameFromEmail = (email) => {
  const fallbackName = "SkillSwap User";
  const localPart = String(email || "").split("@")[0] || "";
  const cleanedName = localPart.replace(/[._-]+/g, " ").replace(/\s+/g, " ").trim();

  if (!cleanedName) {
    return fallbackName;
  }

  const titleCaseName = cleanedName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return titleCaseName.length >= 2 ? titleCaseName.slice(0, 60) : fallbackName;
};

const isStrongPassword = (password) => {
  const text = String(password || "");
  return (
    text.length >= 8 &&
    /[A-Z]/.test(text) &&
    /[a-z]/.test(text) &&
    /[0-9]/.test(text) &&
    /[^A-Za-z0-9]/.test(text)
  );
};

router.post(
  "/register",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    keyPrefix: "register",
    message: "Too many registration attempts. Please try again later."
  }),
  async (req, res) => {
    try {
      if (process.env.ALLOW_SELF_REGISTER !== "true") {
        return res.status(403).json({
          message: "Self registration is currently disabled. Please contact support."
        });
      }

      const name = sanitizeText(req.body.name);
      const email = sanitizeText(req.body.email).toLowerCase();
      const password = sanitizeText(req.body.password);

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      if (name.length < 2 || name.length > 60) {
        return res.status(400).json({ message: "Name should be 2 to 60 characters" });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address" });
      }

      if (!isStrongPassword(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const savedUser = await User.create({
        name,
        email,
        password: hashedPassword
      });

      const token = generateToken({
        id: savedUser._id,
        email: savedUser.email,
        isAdmin: false
      });

      res.status(201).json({
        message: "Registered successfully",
        token,
        user: formatUserPayload(savedUser)
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    keyPrefix: "login",
    message: "Too many login attempts. Please try again after some time.",
    keyGenerator: (req) => {
      const email = sanitizeText(req.body?.email).toLowerCase();
      const ip = req.ip || req.connection?.remoteAddress || "unknown";
      return `${ip}:${email || "unknown"}`;
    }
  }),
  async (req, res) => {
    try {
      const email = sanitizeText(req.body.email).toLowerCase();
      const password = sanitizeText(req.body.password);

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address" });
      }

      let user = await User.findOne({ email });

      if (!user) {
        if (process.env.ALLOW_SELF_REGISTER !== "true") {
          return res.status(400).json({ message: "Invalid credentials" });
        }

        if (!isStrongPassword(password)) {
          return res.status(400).json({
            message:
              "New accounts need a strong password with uppercase, lowercase, number, and special character"
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({
          name: getDefaultNameFromEmail(email),
          email,
          password: hashedPassword
        });

        const token = generateToken({
          id: user._id,
          email: user.email,
          isAdmin: false
        });

        return res.status(201).json({
          message: "Account created and login successful",
          token,
          user: formatUserPayload(user)
        });
      }

      let isMatch = false;
      const storedPassword = String(user.password || "");

      if (
        storedPassword.startsWith("$2a$") ||
        storedPassword.startsWith("$2b$") ||
        storedPassword.startsWith("$2y$")
      ) {
        isMatch = await bcrypt.compare(password, storedPassword);
      } else if (storedPassword === password) {
        isMatch = true;

        // Upgrade legacy plain-text passwords to bcrypt after a successful login.
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = generateToken({
        id: user._id,
        email: user.email,
        isAdmin: false
      });

      res.json({
        message: "Login successful",
        token,
        user: formatUserPayload(user)
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/admin/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    keyPrefix: "admin_login",
    message: "Too many admin login attempts. Please try again later.",
    keyGenerator: (req) => {
      const email = sanitizeText(req.body?.email).toLowerCase();
      const ip = req.ip || req.connection?.remoteAddress || "unknown";
      return `${ip}:${email || "unknown"}`;
    }
  }),
  async (req, res) => {
    try {
      const email = sanitizeText(req.body.email);
      const password = sanitizeText(req.body.password);

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(400).json({ message: "Invalid admin credentials" });
      }

      const token = generateToken({
        email,
        isAdmin: true
      });

      res.json({
        message: "Admin login successful",
        token,
        admin: {
          email
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
