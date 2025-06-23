// routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 🔍 Hämta alla användare (för test/säkerhet – ta bort i produktion!)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}).select("-password +plainPassword"); // Include plainPassword for admin view
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
