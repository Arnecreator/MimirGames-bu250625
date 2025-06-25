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
const adminRoutes = require("./routes/admin");
const questionsRoutes = require("./routes/questions");

const app = express();
app.use(cors());
app.use(express.json());

// 📂 Serva statiska filer från "public"-mappen
app.use(express.static(path.join(__dirname, "public")));

// ✅ Test-rout för att bekräfta att API körs
app.get("/api", (req, res) => {
  res.send("✅ Mimir API is running!");
});

// Add questions to category route
app.get('/api/addQuestions', async (req, res) => {
  const category = req.query.category;
  console.log("Received request to add questions to:", category);
  
  if (!category) {
    return res.status(400).json({ success: false, message: "Category parameter required" });
  }
  
  // TODO: Insert logic to add 10 questions to this category
  // For now, just return success to test the route
  res.json({ success: true, message: `10 questions would be added to ${category}` });
});

// 🧩 API-routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", usersRoutes); // ⬅️ NY ROUTE
app.use("/api/admin", adminRoutes);
app.use("/api/questions", questionsRoutes);

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
