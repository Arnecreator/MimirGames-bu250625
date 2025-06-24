const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Stats route working!");
});

// Update quiz stats for a user
router.post("/quiz", async (req, res) => {
  try {
    const { username, totalQuestions, correctAnswers, isFullScore } = req.body;
    
    if (!username || typeof totalQuestions !== 'number' || typeof correctAnswers !== 'number') {
      return res.status(400).json({ error: "Missing required fields: username, totalQuestions, correctAnswers" });
    }

    // Find user and update stats
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Calculate new stats
    const newTotalAnswers = (user.quizAnswers || 0) + totalQuestions;
    const newCorrectAnswers = (user.quizCorrect || 0) + correctAnswers;
    const newGamesPlayed = (user.quizPlayedDays || user.gamesPlayed || 0) + 1;
    const newCorrectPercentage = Math.round((newCorrectAnswers / newTotalAnswers) * 100);
    const newFullScoreGames = (user.quizFullScoreGames || user.fullScores || 0) + (isFullScore ? 1 : 0);

    // Update user document with new quiz stats
    await User.findByIdAndUpdate(user._id, {
      $set: {
        quizAnswers: newTotalAnswers,
        quizCorrect: newCorrectAnswers,
        quizPlayedDays: newGamesPlayed,
        quizPercentCorrect: newCorrectPercentage,
        quizFullScoreGames: newFullScoreGames,
        // Also update legacy fields for compatibility
        gamesPlayed: newGamesPlayed,
        correctAnswers: newCorrectAnswers,
        fullScores: newFullScoreGames
      }
    });

    res.json({ 
      success: true, 
      message: "Stats updated successfully",
      stats: {
        totalAnswers: newTotalAnswers,
        correctAnswers: newCorrectAnswers,
        gamesPlayed: newGamesPlayed,
        correctPercentage: newCorrectPercentage,
        fullScoreGames: newFullScoreGames
      }
    });

  } catch (error) {
    console.error("Error updating quiz stats:", error);
    res.status(500).json({ error: "Failed to update stats" });
  }
});

module.exports = router;
