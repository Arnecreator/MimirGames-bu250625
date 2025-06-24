
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

// Pre-delete middleware to clean up associated data
UserSchema.pre('findOneAndDelete', async function() {
  const user = await this.model.findOne(this.getQuery());
  if (user) {
    console.log(`🧹 Pre-delete cleanup for user: ${user.username}`);
    
    // Remove this user from all other users' friends lists
    await this.model.updateMany(
      { friends: user.username },
      { $pull: { friends: user.username } }
    );
    
    // Clean up stats collection
    const Stat = require('./Stat');
    await Stat.deleteMany({ username: user.username });
    
    // Clean up leaderboard entries
    const Leaderboard = require('./Leaderboard');
    const leaderboards = await Leaderboard.find({});
    
    for (const leaderboard of leaderboards) {
      if (leaderboard.rankings && Array.isArray(leaderboard.rankings)) {
        const originalLength = leaderboard.rankings.length;
        leaderboard.rankings = leaderboard.rankings.filter(
          entry => entry.username !== user.username
        );
        
        if (leaderboard.rankings.length !== originalLength) {
          await leaderboard.save();
        }
      }
    }
    
    console.log(`✅ Pre-delete cleanup completed for: ${user.username}`);
  }
});

// Also handle deleteOne method
UserSchema.pre('deleteOne', async function() {
  const user = await this.model.findOne(this.getQuery());
  if (user) {
    console.log(`🧹 Pre-deleteOne cleanup for user: ${user.username}`);
    
    // Remove this user from all other users' friends lists
    await this.model.updateMany(
      { friends: user.username },
      { $pull: { friends: user.username } }
    );
    
    // Clean up stats collection
    const Stat = require('./Stat');
    await Stat.deleteMany({ username: user.username });
    
    // Clean up leaderboard entries
    const Leaderboard = require('./Leaderboard');
    const leaderboards = await Leaderboard.find({});
    
    for (const leaderboard of leaderboards) {
      if (leaderboard.rankings && Array.isArray(leaderboard.rankings)) {
        const originalLength = leaderboard.rankings.length;
        leaderboard.rankings = leaderboard.rankings.filter(
          entry => entry.username !== user.username
        );
        
        if (leaderboard.rankings.length !== originalLength) {
          await leaderboard.save();
        }
      }
    }
    
    console.log(`✅ Pre-deleteOne cleanup completed for: ${user.username}`);
  }
});

module.exports = mongoose.model('User', UserSchema);
