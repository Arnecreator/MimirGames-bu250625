const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Stat = require("../models/Stat");
const Leaderboard = require("../models/Leaderboard");
const Question = require("../models/Question");
const stringSimilarity = require("string-similarity");

// Cleanup orphaned data (for fixing data from users deleted without proper cleanup)
router.post("/cleanup-orphaned-data", async (req, res) => {
  try {
    console.log("🧹 Starting orphaned data cleanup...");
    const existingUsers = await User.find({}, "username");
    const existingUsernames = existingUsers.map((user) => user.username);
    console.log(`Found ${existingUsernames.length} existing users`);

    let cleanupReport = {
      friendsRemoved: 0,
      statsDeleted: 0,
      leaderboardEntriesRemoved: 0,
      orphanedUsernames: [],
    };

    const usersWithFriends = await User.find({
      friends: { $exists: true, $ne: [] },
    });

    for (const user of usersWithFriends) {
      const originalFriends = [...user.friends];
      user.friends = user.friends.filter((friendUsername) =>
        existingUsernames.includes(friendUsername),
      );

      if (user.friends.length !== originalFriends.length) {
        await user.save();
        const removedFriends = originalFriends.filter(
          (f) => !user.friends.includes(f),
        );
        cleanupReport.friendsRemoved += removedFriends.length;
        cleanupReport.orphanedUsernames.push(...removedFriends);
        console.log(
          `Removed orphaned friends from ${user.username}: ${removedFriends.join(", ")}`,
        );
      }
    }

    const orphanedStats = await Stat.find({
      username: { $nin: existingUsernames },
    });

    if (orphanedStats.length > 0) {
      const statDeletionResult = await Stat.deleteMany({
        username: { $nin: existingUsernames },
      });
      cleanupReport.statsDeleted = statDeletionResult.deletedCount;
      console.log(
        `Deleted ${statDeletionResult.deletedCount} orphaned stat records`,
      );
    }

    const leaderboards = await Leaderboard.find({});

    for (const leaderboard of leaderboards) {
      if (leaderboard.rankings && Array.isArray(leaderboard.rankings)) {
        const originalLength = leaderboard.rankings.length;
        leaderboard.rankings = leaderboard.rankings.filter((entry) =>
          existingUsernames.includes(entry.username),
        );

        if (leaderboard.rankings.length !== originalLength) {
          await leaderboard.save();
          cleanupReport.leaderboardEntriesRemoved +=
            originalLength - leaderboard.rankings.length;
          console.log(`Cleaned up leaderboard: ${leaderboard.game}`);
        }
      }
    }

    cleanupReport.orphanedUsernames = [
      ...new Set(cleanupReport.orphanedUsernames),
    ];

    console.log("✅ Orphaned data cleanup completed");
    console.log("📊 Cleanup Report:", cleanupReport);

    res.json({
      success: true,
      message: "Orphaned data cleanup completed",
      report: cleanupReport,
    });
  } catch (error) {
    console.error("Error during orphaned data cleanup:", error);
    res.status(500).json({
      error: "Cleanup failed",
      details: error.message,
    });
  }
});

// Get cleanup status
router.get("/cleanup-status", async (req, res) => {
  try {
    const existingUsers = await User.find({}, "username");
    const existingUsernames = existingUsers.map((user) => user.username);

    const usersWithFriends = await User.find({
      friends: { $exists: true, $ne: [] },
    });
    let orphanedFriends = [];

    for (const user of usersWithFriends) {
      const invalidFriends = user.friends.filter(
        (f) => !existingUsernames.includes(f),
      );
      orphanedFriends.push(...invalidFriends);
    }

    const orphanedStats = await Stat.countDocuments({
      username: { $nin: existingUsernames },
    });

    const leaderboards = await Leaderboard.find({});
    let orphanedLeaderboardEntries = 0;

    for (const leaderboard of leaderboards) {
      if (leaderboard.rankings && Array.isArray(leaderboard.rankings)) {
        orphanedLeaderboardEntries += leaderboard.rankings.filter(
          (entry) => !existingUsernames.includes(entry.username),
        ).length;
      }
    }

    const status = {
      totalUsers: existingUsernames.length,
      orphanedFriendReferences: orphanedFriends.length,
      orphanedStatRecords: orphanedStats,
      orphanedLeaderboardEntries: orphanedLeaderboardEntries,
      needsCleanup:
        orphanedFriends.length > 0 ||
        orphanedStats > 0 ||
        orphanedLeaderboardEntries > 0,
    };

    res.json(status);
  } catch (error) {
    console.error("Error checking cleanup status:", error);
    res.status(500).json({
      error: "Status check failed",
      details: error.message,
    });
  }
});

// Delete category endpoint
router.delete("/deleteCategory", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category parameter required" });
    }

    const Question = require("../models/Question");
    const deleteResult = await Question.deleteMany({ category: category });

    console.log(
      `🗑️ Deleted ${deleteResult.deletedCount} questions from category: ${category}`,
    );

    res.json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} questions from ${category} category`,
      deletedCount: deleteResult.deletedCount,
      category: category,
    });
  } catch (error) {
    console.error("❌ Error deleting category:", error);
    res.status(500).json({
      success: false,
      message: "Database error while deleting category",
      error: error.message,
    });
  }
});

// Seed creative questions
router.post("/seed-creative-questions", async (req, res) => {
  try {
    const { exec } = require("child_process");
    const path = require("path");
    const Question = require("../models/Question");
    const scriptPath = path.join(
      __dirname,
      "../scripts/seedCreativeQuestions.js",
    );

    exec(`node "${scriptPath}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error("Error running creative questions script:", error);
        return res.status(500).json({
          success: false,
          error: "Failed to seed creative questions",
          details: error.message,
        });
      }

      if (stderr) {
        console.warn("Script warnings:", stderr);
      }

      console.log("Creative questions seeding output:", stdout);

      const creativeCategories = [
        "Weird Science",
        "Fun History",
        "Cultural Oddities",
        "True or False",
        "Surprising Animals",
        "Food Facts",
        "Mind-Blowing Facts",
      ];

      const addedCount = await Question.countDocuments({
        category: { $in: creativeCategories },
        isActive: true,
      });

      res.json({
        success: true,
        message: "Creative questions added successfully!",
        added: addedCount,
        categories: creativeCategories,
        scriptOutput: stdout,
      });
    });
  } catch (error) {
    console.error("Error seeding creative questions:", error);
    res.status(500).json({
      success: false,
      error: "Server error while seeding creative questions",
      details: error.message,
    });
  }
});

// ✅ Bulk delete questions by IDs
router.post("/bulk-delete", async (req, res) => {
  try {
    const { questionIds } = req.body;
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Missing or invalid questionIds array",
        });
    }

    const Question = require("../models/Question");
    const result = await Question.deleteMany({ _id: { $in: questionIds } });

    res.json({
      success: true,
      message: `${result.deletedCount} questions deleted`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error during bulk delete:", error);
    res.status(500).json({
      success: false,
      message: "Bulk delete failed",
      error: error.message,
    });
  }
});

// Check for duplicates
router.get("/check-duplicates", async (req, res) => {
  try {
    const questions = await Question.find({});
    const seen = new Set();
    const exactDuplicates = [];
    let exactCount = 0;
    let similarCount = 0;

    // Find and remove exact duplicates
    for (let i = questions.length - 1; i >= 0; i--) {
      const q = questions[i];
      const key = `${q.question.trim().toLowerCase()}|${JSON.stringify(q.answers)}|${q.correct}`;

      if (seen.has(key)) {
        exactDuplicates.push(q._id);
        exactCount++;
      } else {
        seen.add(key);
      }
    }

    // Delete exact duplicates
    if (exactDuplicates.length > 0) {
      await Question.deleteMany({ _id: { $in: exactDuplicates } });
    }

    // Find similar duplicates (≥90% match)
    const remainingQuestions = await Question.find({});
    const similarPairs = new Set();

    for (let i = 0; i < remainingQuestions.length; i++) {
      for (let j = i + 1; j < remainingQuestions.length; j++) {
        const sim = stringSimilarity.compareTwoStrings(
          remainingQuestions[i].question.toLowerCase(),
          remainingQuestions[j].question.toLowerCase()
        );
        if (sim >= 0.9) {
          const pairKey = `${remainingQuestions[i]._id}_${remainingQuestions[j]._id}`;
          if (!similarPairs.has(pairKey)) {
            similarPairs.add(pairKey);
            similarCount++;
          }
        }
      }
    }

    res.json({ exact: exactCount, similar: similarCount });
  } catch (error) {
    console.error("Error checking duplicates:", error);
    res.status(500).json({ error: "Failed to check duplicates" });
  }
});

// Delete similar duplicates
router.post("/delete-similar", async (req, res) => {
  try {
    const questions = await Question.find({});
    const toDelete = new Set();

    for (let i = 0; i < questions.length; i++) {
      for (let j = i + 1; j < questions.length; j++) {
        const sim = stringSimilarity.compareTwoStrings(
          questions[i].question.toLowerCase(),
          questions[j].question.toLowerCase()
        );
        if (sim >= 0.9 && !toDelete.has(questions[j]._id.toString())) {
          toDelete.add(questions[j]._id.toString());
        }
      }
    }

    await Question.deleteMany({ _id: { $in: Array.from(toDelete) } });
    res.json({ deleted: toDelete.size });
  } catch (error) {
    console.error("Error deleting similar duplicates:", error);
    res.status(500).json({ error: "Failed to delete similar duplicates" });
  }
});

module.exports = router;