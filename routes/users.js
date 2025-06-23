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

module.exports = router;
