
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  question: { type: String, required: true },
  answers: [{ type: String, required: true }],
  correct: { type: Number, required: true, min: 0, max: 3 },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Index for efficient category-based queries
questionSchema.index({ category: 1 });
questionSchema.index({ isActive: 1 });

module.exports = mongoose.model("Question", questionSchema);
