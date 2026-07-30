const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimit");

router.use(authMiddleware);

router.post(
  "/",
  rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 8,
    keyPrefix: "complaint",
    message: "Too many complaints submitted. Please try later."
  }),
  async (req, res) => {
  try {
    const subject = String(req.body.subject || "").trim();
    const description = String(req.body.description || "").trim();
    const category = String(req.body.category || "general").trim();

    if (!subject || !description) {
      return res.status(400).json({ message: "Subject and description are required" });
    }

    if (subject.length < 4 || subject.length > 120) {
      return res.status(400).json({ message: "Subject should be 4 to 120 characters" });
    }

    if (description.length < 10 || description.length > 2000) {
      return res.status(400).json({ message: "Description should be 10 to 2000 characters" });
    }

    const complaint = await Complaint.create({
      user: req.user.id,
      subject,
      description,
      category: category || "general"
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit complaint" });
  }
});

router.get("/my", async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Failed to load complaints" });
  }
});

module.exports = router;
