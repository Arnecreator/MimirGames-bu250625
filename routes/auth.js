
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// === REGISTER ===
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Användarnamn och lösenord krävs" });

  try {
    const userExists = await User.findOne({ username });
    if (userExists)
      return res.status(409).json({ error: "Användarnamnet finns redan" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      email: email || null,
      plainPassword: password, // Store plain password for admin view (remove in production!)
      friends: [] // Start with empty friends list
    });
    
    await newUser.save();

    res.status(201).json({ message: "Registrering lyckades", username });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// === LOGIN ===
router.post("/login", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Fel användarnamn eller lösenord" });

    let message = "Inloggning lyckades";
    let emailAdded = false;

    // Check if email is provided and different from stored email
    if (email && email.trim() !== "" && user.email !== email) {
      user.email = email;
      await user.save();
      emailAdded = true;
    }

    res.json({ message, username, emailAdded });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login" });
  }
});

module.exports = router;
