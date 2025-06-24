
const express = require("express");
const Question = require("../models/Question");
const router = express.Router();

// Get random questions for quiz
router.get("/random/:count?", async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    
    // Get all active questions
    const allQuestions = await Question.find({ isActive: true });
    
    if (allQuestions.length < count) {
      return res.status(400).json({ 
        error: `Not enough questions available. Requested: ${count}, Available: ${allQuestions.length}` 
      });
    }

    // Proper Fisher-Yates shuffle
    const shuffled = [...allQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Select first 'count' questions after shuffle
    const selectedQuestions = shuffled.slice(0, count).map(q => ({
      _id: q._id,
      category: q.category,
      question: q.question,
      answers: q.answers,
      correct: q.correct,
      difficulty: q.difficulty
    }));

    res.json({ questions: selectedQuestions });

  } catch (error) {
    console.error("Error fetching random questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Get questions by category
router.get("/category/:category", async (req, res) => {
  try {
    const questions = await Question.find({ 
      category: req.params.category, 
      isActive: true 
    });
    res.json({ questions });
  } catch (error) {
    console.error("Error fetching questions by category:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// Get all categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Question.distinct("category", { isActive: true });
    res.json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Admin: Add new question
router.post("/", async (req, res) => {
  try {
    const { category, question, answers, correct, difficulty } = req.body;
    
    if (!category || !question || !answers || typeof correct !== 'number') {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (answers.length !== 4) {
      return res.status(400).json({ error: "Exactly 4 answers required" });
    }

    if (correct < 0 || correct > 3) {
      return res.status(400).json({ error: "Correct answer index must be 0-3" });
    }

    const newQuestion = new Question({
      category,
      question,
      answers,
      correct,
      difficulty: difficulty || 'medium'
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully", question: newQuestion });

  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ error: "Failed to add question" });
  }
});

// Admin: Get all questions with stats
router.get("/admin/all", async (req, res) => {
  try {
    const questions = await Question.find({}).sort({ category: 1, createdAt: -1 });
    const categories = await Question.distinct("category");
    
    const stats = {
      totalQuestions: questions.length,
      activeQuestions: questions.filter(q => q.isActive).length,
      categories: categories.length,
      byCategory: {}
    };

    categories.forEach(cat => {
      stats.byCategory[cat] = questions.filter(q => q.category === cat).length;
    });

    res.json({ questions, stats });
  } catch (error) {
    console.error("Error fetching all questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

module.exports = router;
