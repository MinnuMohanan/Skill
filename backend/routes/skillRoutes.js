const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD skill
router.post("/", async (req, res) => {
  try {
    const newSkill = new Skill(req.body);
    const saved = await newSkill.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;