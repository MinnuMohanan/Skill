const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userName, partnerName, skillName, completedDate } = req.body;

    const certificate = {
      title: "Certificate of Completion",
      userName,
      partnerName,
      skillName,
      completedDate
    };

    res.status(201).json({ certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
