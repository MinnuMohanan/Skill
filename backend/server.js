require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ✅ Routes
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const skillRoutes = require("./routes/skillRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// ✅ Middleware
app.use(cors()); // 🔥 IMPORTANT (frontend connect)
app.use(express.json());

// ✅ Routes
app.use("/api", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/skills", skillRoutes);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server working! 🚀");
});

// ✅ MongoDB Connection + Server Start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌:", err);
  });