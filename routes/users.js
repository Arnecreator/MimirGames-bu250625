// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 🔍 Hämta alla användare (för test/säkerhet – ta bort i produktion!)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}); // Include all fields for admin view
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE user by ID with cascading cleanup
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First, get the user to find their username
    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const usernameToDelete = userToDelete.username;
    console.log(`🗑️ Starting cascading delete for user: ${usernameToDelete}`);
    
    // 1. Remove this user from all other users' friends lists
    const friendRemovalResult = await User.updateMany(
      { friends: usernameToDelete },
      { $pull: { friends: usernameToDelete } }
    );
    console.log(`✅ Removed ${usernameToDelete} from ${friendRemovalResult.modifiedCount} friend lists`);
    
    // 2. Delete the user document itself
    await User.findByIdAndDelete(id);
    console.log(`✅ Deleted user document for: ${usernameToDelete}`);
    
    // 3. Clean up any quiz-related stats in Stat collection (if it exists)
    const Stat = require("../models/Stat");
    const statDeletionResult = await Stat.deleteMany({ username: usernameToDelete });
    console.log(`✅ Deleted ${statDeletionResult.deletedCount} stat records for: ${usernameToDelete}`);
    
    // 4. Clean up any leaderboard entries (if it exists)
    const Leaderboard = require("../models/Leaderboard");
    const leaderboards = await Leaderboard.find({});
    let leaderboardUpdates = 0;
    
    for (const leaderboard of leaderboards) {
      if (leaderboard.rankings && Array.isArray(leaderboard.rankings)) {
        const originalLength = leaderboard.rankings.length;
        leaderboard.rankings = leaderboard.rankings.filter(
          entry => entry.username !== usernameToDelete
        );
        
        if (leaderboard.rankings.length !== originalLength) {
          await leaderboard.save();
          leaderboardUpdates++;
        }
      }
    }
    console.log(`✅ Updated ${leaderboardUpdates} leaderboard(s), removed entries for: ${usernameToDelete}`);
    
    res.status(200).json({ 
      message: 'User and all associated data deleted successfully',
      details: {
        username: usernameToDelete,
        friendListsUpdated: friendRemovalResult.modifiedCount,
        statsDeleted: statDeletionResult.deletedCount,
        leaderboardsUpdated: leaderboardUpdates
      }
    });
    
  } catch (err) {
    console.error("Error during cascading delete:", err);
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
});

// PATCH user by ID (update specific fields)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await User.updateOne({ _id: id }, { $set: updates });
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// GET user by username - for friends functionality
router.get('/username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Transform user data to match friends table format
    const userData = {
      username: user.username,
      quizPlayedDays: user.quizPlayedDays || user.gamesPlayed || 0,
      quizAnswers: user.quizAnswers || (user.gamesPlayed * 8) || 0,
      quizCorrect: user.quizCorrect || user.correctAnswers || 0,
      quizPercentCorrect: user.quizPercentCorrect || (user.correctAnswers && user.gamesPlayed ? Math.round((user.correctAnswers / (user.gamesPlayed * 8)) * 100) : 0),
      quizFullScoreGames: user.quizFullScoreGames || user.fullScores || 0,
      quizStreak: user.quizStreak || user.bestStreak || 0,
      regDate: user.createdAt ? formatRegDate(user.createdAt) : "------"
    };

    res.json(userData);
  } catch (err) {
    console.error("Error fetching user by username:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Helper function to format registration date
function formatRegDate(createdAt) {
  try {
    const date = new Date(createdAt);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
  } catch (e) {
    return "------";
  }
}

module.exports = router;
