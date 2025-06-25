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

// Delete category route
app.get('/api/deleteCategory', async (req, res) => {
  const category = req.query.category;
  console.log("Received request to delete category:", category);
  
  if (!category) {
    return res.status(400).json({ success: false, message: "Category parameter required" });
  }
  
  // Import Question model
  const Question = require('./models/Question');
  
  try {
    // Delete all questions in the specified category
    const deleteResult = await Question.deleteMany({ category: category });
    
    console.log(`🗑️ Deleted ${deleteResult.deletedCount} questions from category: ${category}`);
    
    res.json({ 
      success: true, 
      message: `Successfully deleted ${deleteResult.deletedCount} questions from ${category} category`,
      deletedCount: deleteResult.deletedCount,
      category: category
    });
    
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database error while deleting category",
      error: error.message 
    });
  }
});

// Add questions to category route
app.get('/api/addQuestions', async (req, res) => {
  const category = req.query.category;
  console.log("Received request to add questions to:", category);
  
  if (!category) {
    return res.status(400).json({ success: false, message: "Category parameter required" });
  }
  
  // Import Question model
  const Question = require('./models/Question');
  
  // Create 10 sample questions for the category
  const questionsToAdd = Array.from({ length: 10 }, (_, i) => ({
    category: category,
    question: `Sample ${category} Question ${i + 1}: What is a key concept in ${category}?`,
    answers: [
      `Correct answer for ${category}`,
      `Wrong answer 1 for ${category}`,
      `Wrong answer 2 for ${category}`,
      `Wrong answer 3 for ${category}`
    ],
    correct: 0, // First answer is correct
    difficulty: ['easy', 'medium', 'hard'][i % 3], // Rotate difficulties
    isActive: true
  }));
  
  try {
    const insertedQuestions = await Question.insertMany(questionsToAdd);
    console.log(`✅ Successfully added ${insertedQuestions.length} questions to ${category}`);
    
    res.json({ 
      success: true, 
      message: `10 questions added to ${category}!`,
      inserted: insertedQuestions.length,
      category: category
    });
  } catch (error) {
    console.error("❌ Error adding questions:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database error while adding questions",
      error: error.message 
    });
  }
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
