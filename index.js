// index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const friendRoutes = require("./routes/friends");
const statsRoutes = require("./routes/stats");
const leaderboardRoutes = require("./routes/leaderboard");
const usersRoutes = require("./routes/users"); // ⬅️ NY RAD

const app = express();
app.use(cors());
app.use(express.json());

// 📂 Serva statiska filer från "public"-mappen
app.use(express.static(path.join(__dirname, "public")));

// ✅ Test-rout för att bekräfta att API körs
app.get("/api", (req, res) => {
  res.send("✅ Mimir API is running!");
});

// 🧩 API-routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", usersRoutes); // ⬅️ NY ROUTE

// 🛑 Fallback för ogiltiga endpoints
app.use((req, res) => {
  res.status(404).send("❌ Route not found");
});

// 🔌 Anslut till MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 🚀 Starta server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}`);
});
