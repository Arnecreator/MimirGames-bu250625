
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, maxlength: 20 },
    password: { type: String, required: true },
    plainPassword: { type: String }, // For admin view only - remove in production!
    email: { type: String },
    friends: [String],
    gamesPlayed: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    fullScores: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', UserSchema);
