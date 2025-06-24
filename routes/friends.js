const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/friends - Return friends list for logged-in user
router.get("/", async (req, res) => {
  try {
    // For demo purposes, we'll use a hardcoded username
    // In production, this would come from authentication middleware
    const currentUsername = "admin123"; // This should be from req.user or session
    
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

// POST /api/friends - Add a friend
router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // For demo purposes, we'll use a hardcoded current user
    // In production, this would come from authentication middleware
    const currentUsername = "admin123"; // This should be from req.user or session
    
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

module.exports = router;
