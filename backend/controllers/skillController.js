const Skill = require("../models/skill");

// Add Skill
exports.addSkill = async (req, res) => {
  try {

    const skill = new Skill({
      name: req.body.name
    });

    const savedSkill = await skill.save();

    res.status(201).json(savedSkill);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Skills
exports.getSkills = async (req, res) => {
  try {

    const skills = await Skill.find();

    res.json(skills);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};