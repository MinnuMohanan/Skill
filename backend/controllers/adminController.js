const User = require("../models/User");
const Skill = require("../models/skill");
const Request = require("../models/Requests");
const Feedback = require("../models/Feedback");
const Message = require("../models/Message");
const Complaint = require("../models/Complaint");

exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: "pending" });
    const totalFeedbacks = await Feedback.countDocuments();

    const latestUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestRequests = await Request.find()
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("skill", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalSkills,
      totalRequests,
      pendingRequests,
      totalFeedbacks,
      latestUsers,
      latestRequests
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .populate("skill", "name")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaintStatusByAdmin = async (req, res) => {
  try {
    const status = String(req.body.status || "").trim();

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid complaint status" });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");

    if (!updatedComplaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userSkills = await Skill.find({ userId: user._id }).select("_id");
    const skillIds = userSkills.map((skill) => skill._id);

    await Promise.all([
      Skill.deleteMany({ userId: user._id }),
      Request.deleteMany({
        $or: [
          { sender: user._id },
          { receiver: user._id },
          { skill: { $in: skillIds } }
        ]
      }),
      Message.deleteMany({
        $or: [{ sender: user._id }, { receiver: user._id }]
      }),
      Feedback.deleteMany({
        $or: [{ fromUser: user._id }, { toUser: user._id }]
      }),
      Complaint.deleteMany({ user: user._id }),
      User.findByIdAndDelete(user._id)
    ]);

    res.json({ message: "User and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequestByAdmin = async (req, res) => {
  try {
    const deletedRequest = await Request.findByIdAndDelete(req.params.id);

    if (!deletedRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSkillByAdmin = async (req, res) => {
  try {
    const deletedSkill = await Skill.findByIdAndDelete(req.params.id);

    if (!deletedSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await Request.deleteMany({ skill: deletedSkill._id });

    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
