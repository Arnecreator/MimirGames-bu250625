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

// DELETE user by ID
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: 'Delete failed' });
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

module.exports = router;
