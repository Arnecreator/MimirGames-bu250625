const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Stats route working!");
});

// Store individual quiz answers immediately (for handling early exits)
router.post("/quiz-answer", async (req, res) => {
  try {
    const { username, gameSessionId, questionIndex, isCorrect, totalQuestions } = req.body;
    
    if (!username || !gameSessionId || typeof questionIndex !== 'number' || typeof isCorrect !== 'boolean') {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Store individual answer in user's session data (we'll aggregate later)
    // For now, just acknowledge the save - we'll use this for recovery if needed
    console.log(`Answer saved: ${username} - Session ${gameSessionId} - Q${questionIndex}: ${isCorrect}`);
    
    res.json({ success: true, message: "Answer saved" });

  } catch (error) {
    console.error("Error saving quiz answer:", error);
    res.status(500).json({ error: "Failed to save answer" });
  }
});

// Final quiz results (called at end or early exit)
router.post("/quiz-final", async (req, res) => {
  try {
    const { username, gameSessionId, totalQuestions, answeredQuestions, correctAnswers, isFullScore, isCompleted } = req.body;
    
    if (!username || typeof totalQuestions !== 'number' || typeof correctAnswers !== 'number') {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find user and update stats
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only count as a completed game if user answered at least 1 question
    const shouldCountGame = (answeredQuestions || totalQuestions) > 0;
    
    // Calculate new stats - treat unanswered questions as answered incorrectly
    const actualAnswered = answeredQuestions || totalQuestions;
    const newTotalAnswers = (user.quizAnswers || 0) + totalQuestions; // Always count full quiz length
    const newCorrectAnswers = (user.quizCorrect || 0) + correctAnswers;
    const newGamesPlayed = (user.quizPlayedDays || user.gamesPlayed || 0) + (shouldCountGame ? 1 : 0);
    const newCorrectPercentage = Math.round((newCorrectAnswers / newTotalAnswers) * 100);
    const newFullScoreGames = (user.quizFullScoreGames || user.fullScores || 0) + (isFullScore && isCompleted ? 1 : 0);

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
      message: "Quiz stats updated successfully",
      gameCompleted: isCompleted,
      stats: {
        totalAnswers: newTotalAnswers,
        correctAnswers: newCorrectAnswers,
        gamesPlayed: newGamesPlayed,
        correctPercentage: newCorrectPercentage,
        fullScoreGames: newFullScoreGames,
        answeredQuestions: actualAnswered
      }
    });

  } catch (error) {
    console.error("Error updating final quiz stats:", error);
    res.status(500).json({ error: "Failed to update stats" });
  }
});

// Legacy endpoint for backward compatibility
router.post("/quiz", async (req, res) => {
  try {
    const { username, totalQuestions, correctAnswers, isFullScore } = req.body;
    
    // Redirect to new final endpoint
    req.body.answeredQuestions = totalQuestions;
    req.body.isCompleted = true;
    req.body.gameSessionId = 'legacy_' + Date.now();
    
    return router.handle(req, res, 'quiz-final');
  } catch (error) {
    console.error("Error with legacy quiz endpoint:", error);
    res.status(500).json({ error: "Failed to update stats" });
  }
});

module.exports = router;
