require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const skillRoutes = require("./routes/skillRoutes");
const requestRoutes = require("./routes/requestRoutes");
const messageRoutes = require("./routes/messageRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8002;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id || decoded.isAdmin) {
      return next(new Error("Invalid socket user"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_conversation", ({ roomId }) => {
    if (!roomId) return;

    const participants = String(roomId)
      .split("_")
      .map((part) => part.trim())
      .filter(Boolean);

    if (participants.length !== 2) {
      return;
    }

    if (!participants.includes(String(socket.user.id))) {
      return;
    }

    socket.join(roomId);
  });

  socket.on("send_message", ({ roomId, message }) => {
    if (!roomId || !message) return;
    socket.to(roomId).emit("receive_message", message);
  });

  socket.on("offer", ({ roomId, offer }) => {
    if (!roomId || !offer) return;
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    if (!roomId || !answer) return;
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    if (!roomId || !candidate) return;
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("call_rejected", ({ roomId }) => {
    if (!roomId) return;
    socket.to(roomId).emit("call_rejected");
  });

  socket.on("call_ended", ({ roomId }) => {
    if (!roomId) return;
    socket.to(roomId).emit("call_ended");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/complaints", complaintRoutes);

app.get("/", (req, res) => {
  res.send("Server working");
});

app.use(notFound);
app.use(errorHandler);

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Stop the existing server or change PORT in backend/.env.`);
    process.exit(1);
  }

  console.error("Server startup error:", error);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`Server + Socket running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

