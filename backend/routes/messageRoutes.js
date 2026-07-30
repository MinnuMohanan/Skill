const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const authMiddleware = require("../middleware/authMiddleware");
const rateLimit = require("../middleware/rateLimit");

router.use(authMiddleware);

router.post(
  "/",
  rateLimit({
    windowMs: 60 * 1000,
    max: 40,
    keyPrefix: "send_message",
    message: "Too many messages sent. Please wait for a minute."
  }),
  async (req, res) => {
  try {
    const sender = req.user.id;
    const receiver = req.body.receiver;
    const text = String(req.body.text || "").trim();

    if (!receiver || !text) {
      return res.status(400).json({ message: "Receiver and message text are required" });
    }

    if (text.length > 1000) {
      return res.status(400).json({ message: "Message is too long" });
    }

    if (String(sender) === String(receiver)) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }

    const msg = new Message({
      sender,
      receiver,
      text
    });

    await msg.save();
    res.status(201).json(msg);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:u1/:u2", async (req, res) => {
  try {
    const hasAccess =
      String(req.user.id) === String(req.params.u1) ||
      String(req.user.id) === String(req.params.u2) ||
      req.user.isAdmin;

    if (!hasAccess) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const msgs = await Message.find({
      $or: [
        { sender: req.params.u1, receiver: req.params.u2 },
        { sender: req.params.u2, receiver: req.params.u1 }
      ]
    }).sort({ createdAt: 1 });

    res.json(msgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
