const Request = require("../models/request");

// Get requests received by a user
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      receiver: req.params.userId
    })
    .populate("sender", "name email")
    .populate("skill", "name");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send Request
exports.sendRequest = async (req, res) => {
  try {

    const { sender, receiver, skill, message } = req.body;

    const existingRequest = await Request.findOne({
      sender,
      receiver,
      skill
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent"
      });
    }

    const newRequest = new Request({
      sender,
      receiver,
      skill,
      message,
      status: "pending"
    });

    const savedRequest = await newRequest.save();

    res.status(201).json(savedRequest);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update request status
exports.updateRequestStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const updatedRequest = await Request.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(updatedRequest);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get All Requests
exports.getRequests = async (req, res) => {
  try {

    const requests = await Request.find()
    .populate("sender", "name email")
    .populate("receiver", "name email")
    .populate("skill", "name");

    res.json(requests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};