
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Stat = require("../models/Stat");
const Leaderboard = require("../models/Leaderboard");

// Cleanup orphaned data (for fixing data from users deleted without proper cleanup)
router.post("/cleanup-orphaned-data", async (req, res) => {
  try {
    console.log("🧹 Starting orphaned data cleanup...");
    
    // Get all existing usernames
    const existingUsers = await User.find({}, 'username');
    const existingUsernames = existingUsers.map(user => user.username);
    console.log(`Found ${existingUsernames.length} existing users`);
    
    let cleanupReport = {
      friendsRemoved: 0,
      statsDeleted: 0,
      leaderboardEntriesRemoved: 0,
      orphanedUsernames: []
    };
    
    // 1. Clean up friends lists - remove references to non-existent users
    const usersWithFriends = await User.find({ friends: { $exists: true, $ne: [] } });
    
    for (const user of usersWithFriends) {
      const originalFriends = [...user.friends];
      user.friends = user.friends.filter(friendUsername => 
        existingUsernames.includes(friendUsername)
      );
      
      if (user.friends.length !== originalFriends.length) {
        await user.save();
        const removedFriends = originalFriends.filter(f => !user.friends.includes(f));
        cleanupReport.friendsRemoved += removedFriends.length;
        cleanupReport.orphanedUsernames.push(...removedFriends);
        console.log(`Removed orphaned friends from ${user.username}: ${removedFriends.join(', ')}`);
      }
    }
    
    // 2. Clean up stats for non-existent users
    const orphanedStats = await Stat.find({ 
      username: { $nin: existingUsernames } 
    });
    
    if (orphanedStats.length > 0) {
      const statDeletionResult = await Stat.deleteMany({ 
        username: { $nin: existingUsernames } 
      });
      cleanupReport.statsDeleted = statDeletionResult.deletedCount;
      console.log(`Deleted ${statDeletionResult.deletedCount} orphaned stat records`);
    }
    
    // 3. Clean up leaderboard entries for non-existent users
    const leaderboards = await Leaderboard.find({});
    
    for (const leaderboard of leaderboards) {
      if (leaderboard.rankings && Array.isArray(leaderboard.rankings)) {
        const originalLength = leaderboard.rankings.length;
        leaderboard.rankings = leaderboard.rankings.filter(
          entry => existingUsernames.includes(entry.username)
        );
        
        if (leaderboard.rankings.length !== originalLength) {
          await leaderboard.save();
          cleanupReport.leaderboardEntriesRemoved += (originalLength - leaderboard.rankings.length);
          console.log(`Cleaned up leaderboard: ${leaderboard.game}`);
        }
      }
    }
    
    // Get unique orphaned usernames
    cleanupReport.orphanedUsernames = [...new Set(cleanupReport.orphanedUsernames)];
    
    console.log("✅ Orphaned data cleanup completed");
    console.log("📊 Cleanup Report:", cleanupReport);
    
    res.json({
      success: true,
      message: "Orphaned data cleanup completed",
      report: cleanupReport
    });
    
  } catch (error) {
    console.error("Error during orphaned data cleanup:", error);
    res.status(500).json({ 
      error: "Cleanup failed", 
      details: error.message 
    });
  }
});

// Get cleanup status - check for orphaned data
router.get("/cleanup-status", async (req, res) => {
  try {
    const existingUsers = await User.find({}, 'username');
    const existingUsernames = existingUsers.map(user => user.username);
    
    // Check for orphaned friends
    const usersWithFriends = await User.find({ friends: { $exists: true, $ne: [] } });
    let orphanedFriends = [];
    
    for (const user of usersWithFriends) {
      const invalidFriends = user.friends.filter(f => !existingUsernames.includes(f));
      orphanedFriends.push(...invalidFriends);
    }
    
    // Check for orphaned stats
    const orphanedStats = await Stat.countDocuments({ 
      username: { $nin: existingUsernames } 
    });
    
    // Check for orphaned leaderboard entries
    const leaderboards = await Leaderboard.find({});
    let orphanedLeaderboardEntries = 0;
    
    for (const leaderboard of leaderboards) {
      if (leaderboard.rankings && Array.isArray(leaderboard.rankings)) {
        orphanedLeaderboardEntries += leaderboard.rankings.filter(
          entry => !existingUsernames.includes(entry.username)
        ).length;
      }
    }
    
    const status = {
      totalUsers: existingUsernames.length,
      orphanedFriendReferences: orphanedFriends.length,
      orphanedStatRecords: orphanedStats,
      orphanedLeaderboardEntries: orphanedLeaderboardEntries,
      needsCleanup: orphanedFriends.length > 0 || orphanedStats > 0 || orphanedLeaderboardEntries > 0
    };
    
    res.json(status);
    
  } catch (error) {
    console.error("Error checking cleanup status:", error);
    res.status(500).json({ 
      error: "Status check failed", 
      details: error.message 
    });
  }
});

module.exports = router;
