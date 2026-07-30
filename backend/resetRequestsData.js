require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mongoose = require("mongoose");
const readline = require("readline");
const Request = require("./models/Requests");
const Message = require("./models/Message");
const Feedback = require("./models/Feedback");

const askForConfirmation = () =>
  new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(
      'This will permanently delete all requests, messages, and feedback. Type "DELETE" to continue: ',
      (answer) => {
        rl.close();
        resolve(answer.trim() === "DELETE");
      }
    );
  });

const resetRequestsData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing. Check backend/.env");
    }

    const confirmed = await askForConfirmation();

    if (!confirmed) {
      console.log("Reset cancelled.");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const requestCount = await Request.countDocuments();
    const messageCount = await Message.countDocuments();
    const feedbackCount = await Feedback.countDocuments();

    console.log(`Requests: ${requestCount}`);
    console.log(`Messages: ${messageCount}`);
    console.log(`Feedbacks: ${feedbackCount}`);

    await Request.deleteMany({});
    await Message.deleteMany({});
    await Feedback.deleteMany({});

    console.log("Request-related data deleted successfully");
    console.log("Done");
  } catch (error) {
    console.log("Error:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

resetRequestsData();
