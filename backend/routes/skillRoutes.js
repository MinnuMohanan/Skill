const express = require("express");
const router = express.Router();
const Skill = require("../models/skill");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimit");

router.use(authMiddleware);

router.post(
  "/",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 20,
    keyPrefix: "add_skill",
    message: "Too many skill submissions. Please try later."
  }),
  async (req, res) => {
  try {
    const { name, category, image, description } = req.body;
    const safeName = String(name || "").trim();
    const safeCategory = String(category || "").trim();
    const safeImage = String(image || "").trim();
    const safeDescription = String(description || "").trim();

    if (!safeName || !safeCategory) {
      return res.status(400).json({ message: "Skill name and category are required" });
    }

    if (safeName.length < 2 || safeName.length > 80) {
      return res.status(400).json({ message: "Skill name should be 2 to 80 characters" });
    }

    const skill = await Skill.create({
      name: safeName,
      category: safeCategory,
      image: safeImage,
      description: safeDescription.slice(0, 1000),
      userId: req.user.id
    });

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().populate("userId", "name email");
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
