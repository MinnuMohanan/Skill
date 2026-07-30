const express = require("express");
const router = express.Router();
const Request = require("../models/Requests");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimit");

router.use(authMiddleware);

router.post(
  "/",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 25,
    keyPrefix: "send_request",
    message: "Too many request attempts. Please slow down."
  }),
  async (req, res) => {
  try {
    const sender = req.user.id;
    const { receiver, skill } = req.body;
    const message = String(req.body.message || "").trim().slice(0, 500);

    if (!sender || !receiver || !skill) {
      return res.status(400).json({
        message: "Sender, receiver, and skill are required"
      });
    }

    if (String(sender) === String(receiver)) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    const existingRequest = await Request.findOne({
      sender,
      receiver,
      skill,
      status: { $in: ["pending", "accepted"] }
    });

    if (existingRequest) {
      return res.status(400).json({
        message:
          existingRequest.status === "accepted"
            ? "This request is already accepted"
            : "Request already sent"
      });
    }

    const newRequest = new Request({
      sender,
      receiver,
      skill,
      message,
      status: "pending"
    });

    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/received/:userId", async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const requests = await Request.find({
      receiver: req.params.userId
    })
      .populate("sender", "name email")
      .populate("skill", "name");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/sent/:userId", async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.userId) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const requests = await Request.find({
      sender: req.params.userId
    })
      .populate("receiver", "name email")
      .populate("skill", "name");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const existing = await Request.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (String(existing.receiver) !== String(req.user.id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized update" });
    }

    const updated = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/schedule", async (req, res) => {
  try {
    if (!req.body.scheduledAt) {
      return res.status(400).json({ message: "scheduledAt is required" });
    }

    const existing = await Request.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "Request not found" });
    }

    const isOwner =
      String(existing.receiver) === String(req.user.id) ||
      String(existing.sender) === String(req.user.id);

    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized update" });
    }

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { scheduledAt: req.body.scheduledAt },
      { new: true }
    )
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("skill", "name");

    if (!updated) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
