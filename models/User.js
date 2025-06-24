
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, maxlength: 20 },
    password: { type: String, required: true },
    plainPassword: { type: String }, // For admin view only - remove in production!
    email: { type: String },
    friends: [String],
    // Legacy fields (for compatibility)
    gamesPlayed: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    fullScores: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    // New quiz-specific fields
    quizPlayedDays: { type: Number, default: 0 },
    quizAnswers: { type: Number, default: 0 },
    quizCorrect: { type: Number, default: 0 },
    quizPercentCorrect: { type: Number, default: 0 },
    quizFullScoreGames: { type: Number, default: 0 },
    quizStreak: { type: Number, default: 0 }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);
