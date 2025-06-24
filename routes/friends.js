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

module.exports = router;
