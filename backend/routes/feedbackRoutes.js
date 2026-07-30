const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", async (req, res) => {
  try {
    const fromUser = req.user.id;
    const toUser = req.body.toUser;
    const rating = Number(req.body.rating);
    const review = String(req.body.review || "").trim().slice(0, 500);

    if (!toUser || !rating) {
      return res.status(400).json({ message: "toUser and rating are required" });
    }

    if (String(fromUser) === String(toUser)) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating should be between 1 and 5" });
    }

    const existing = await Feedback.findOne({ fromUser, toUser });

    const feedback = existing
      ? await Feedback.findByIdAndUpdate(
          existing._id,
          { rating, review },
          { new: true, runValidators: true }
        )
      : await Feedback.create({ fromUser, toUser, rating, review });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ toUser: req.params.userId })
      .populate("fromUser", "name")
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
