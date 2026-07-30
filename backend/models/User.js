const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    profileImage: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    },
    skillOffered: {
      type: String,
      default: ""
    },
    skillWanted: {
      type: String,
      default: ""
    },
    availability: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
