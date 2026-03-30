const express = require("express");
const router = express.Router();
const Request = require("../models/Request");


// ✅ 1. Create Request
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, skill, message } = req.body;

    const newRequest = new Request({
      sender,
      receiver,
      skill,
      message,
    });

    await newRequest.save();

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ 2. Get Received Requests
router.get("/received/:userId", async (req, res) => {
  try {

    const requests = await Request.find({
      receiver: req.params.userId,
    })
      .populate("sender", "name")
      .populate("skill", "name");

    res.json(requests);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ 3. Update Request Status (Accept / Reject)
router.put("/:id", async (req, res) => {
  try {

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ 4. Get Sent Requests (optional)
router.get("/sent/:userId", async (req, res) => {
  try {

    const requests = await Request.find({
      sender: req.params.userId,
    })
      .populate("receiver", "name")
      .populate("skill", "name");

    res.json(requests);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;