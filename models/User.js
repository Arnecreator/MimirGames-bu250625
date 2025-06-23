const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, length: 7 },
    password: { type: String, required: true },
    plainPassword: { type: String }, // For admin view only - NOT recommended for production
    email: { type: String },
    friends: [String],
    gamesPlayed: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    fullScores: { type: Number, default: 0 },
    fullScorePercentage: { type: String, default: '0%' },
    bestStreak: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
