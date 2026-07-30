const Feedback = require("../models/Feedback");

// ✅ ADD FEEDBACK
exports.addFeedback = async (req, res) => {
  try {

    const feedback = new Feedback(req.body);
    await feedback.save();

    res.json(feedback);

  } catch (err) {
    res.status(500).json(err);
  }
};


// ✅ GET USER FEEDBACK
exports.getUserFeedback = async (req, res) => {
  try {

    const feedbacks = await Feedback.find({
      toUser: req.params.userId
    }).populate("fromUser", "name");

    res.json(feedbacks);

  } catch (err) {
    res.status(500).json(err);
  }
};