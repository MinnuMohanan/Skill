require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const requestRoutes = require("./routes/requestRoutes");
const skillRoutes = require("./routes/skillRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/skills", skillRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});