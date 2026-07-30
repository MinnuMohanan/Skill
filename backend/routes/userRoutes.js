const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/users", async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/users/:id/profile", async (req, res) => {
  try {
    if (String(req.user.id) !== String(req.params.id) && !req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized update" });
    }

    const name = String(req.body.name || "").trim();
    const profileImage = String(req.body.profileImage || "").trim();
    const location = String(req.body.location || "").trim();
    const skillOffered = String(req.body.skillOffered || "").trim();
    const skillWanted = String(req.body.skillWanted || "").trim();
    const availability = String(req.body.availability || "").trim();

    if (!name || !location || !skillOffered || !skillWanted || !availability) {
      return res.status(400).json({ message: "All profile fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        profileImage,
        location,
        skillOffered,
        skillWanted,
        availability
      },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
