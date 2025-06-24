
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Middleware to get current user - for now using hardcoded admin123
// In production, this would come from JWT token or session
const getCurrentUser = (req, res, next) => {
  // For demo purposes, we'll use a hardcoded username
  // In production, this would come from authentication middleware
  req.currentUser = "admin123"; // This should be from req.user or session
  next();
};

// Apply middleware to all routes
router.use(getCurrentUser);

// GET /api/friends - Return friends list for current user only
router.get("/", async (req, res) => {
  try {
    const currentUsername = req.currentUser;
    
    const user = await User.findOne({ username: currentUsername });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ friends: user.friends || [] });
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/friends - Add a friend to current user's list
router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    const currentUsername = req.currentUser;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Check if target user exists
    const targetUser = await User.findOne({ username: username });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get current user
    const currentUser = await User.findOne({ username: currentUsername });
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Check if already friends
    if (currentUser.friends && currentUser.friends.includes(username)) {
      return res.status(400).json({ error: "Already friends with this user" });
    }

    // Can't add yourself as friend
    if (username === currentUsername) {
      return res.status(400).json({ error: "Cannot add yourself as a friend" });
    }

    // Add friend to current user's friends list
    await User.updateOne(
      { username: currentUsername },
      { $addToSet: { friends: username } }
    );

    res.json({ success: true, message: `${username} added as friend` });
  } catch (err) {
    console.error("Error adding friend:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/friends/:friendUsername - Remove a friend from current user's list
router.delete("/:friendUsername", async (req, res) => {
  try {
    const { friendUsername } = req.params;
    const currentUsername = req.currentUser;
    
    if (!friendUsername) {
      return res.status(400).json({ error: "Friend username is required" });
    }

    // Get current user
    const currentUser = await User.findOne({ username: currentUsername });
    if (!currentUser) {
      return res.status(404).json({ error: "Current user not found" });
    }

    // Check if user is actually in friends list
    if (!currentUser.friends || !currentUser.friends.includes(friendUsername)) {
      return res.status(400).json({ error: "User is not in your friends list" });
    }

    // Remove friend from current user's friends list
    await User.updateOne(
      { username: currentUsername },
      { $pull: { friends: friendUsername } }
    );

    res.json({ success: true, message: `${friendUsername} removed from friends` });
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
