const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: [
        "Care",
        "IT",
        "Education",
        "Cooking",
        "Design",
        "Language",
        "Music",
        "Fitness",
        "Business",
        "Others"
      ],
      default: "Others"
    },
    image: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
