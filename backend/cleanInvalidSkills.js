require("dotenv").config();
const mongoose = require("mongoose");
const Skill = require("./models/skill");

const cleanInvalidSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const invalidSkills = await Skill.find({
      $or: [
        { userId: { $exists: false } },
        { userId: null }
      ]
    });

    console.log(`Found ${invalidSkills.length} invalid skill records`);

    if (invalidSkills.length > 0) {
      invalidSkills.forEach((skill) => {
        console.log(`Deleting: ${skill.name} (${skill._id})`);
      });

      await Skill.deleteMany({
        $or: [
          { userId: { $exists: false } },
          { userId: null }
        ]
      });

      console.log("Invalid skills deleted successfully");
    } else {
      console.log("No invalid skills found");
    }

    await mongoose.disconnect();
    console.log("Done");
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

cleanInvalidSkills();
