const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const friendRoutes = require("./routes/friends");
const statsRoutes = require("./routes/stats");
const leaderboardRoutes = require("./routes/leaderboard");
const usersRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const questionsRoutes = require("./routes/questions");
const toolsRoutes = require("./routes/tools");

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api", (req, res) => {
  res.send("✅ Mimir API is running!");
});

// Core routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api", toolsRoutes);

// Fallback route
app.use((req, res) => {
  res.status(404).send("❌ Route not found");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
});
