
const express = require("express");
const Question = require("../models/Question");
const router = express.Router();

// Get random questions for quiz with balanced category distribution
router.get("/random/:count?", async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const excludeIds = req.query.exclude ? req.query.exclude.split(',') : [];
    
    // Get all available categories
    const categories = await Question.distinct("category", { isActive: true });
    
    if (categories.length === 0) {
      return res.status(400).json({ error: "No question categories available" });
    }

    let selectedQuestions = [];
    const questionsPerCategory = Math.floor(count / categories.length);
    const remainingQuestions = count % categories.length;

    // First, try to get equal questions from each category
    for (const category of categories) {
      const questionsToGet = questionsPerCategory + (selectedQuestions.length < remainingQuestions ? 1 : 0);
      
      if (questionsToGet > 0) {
        const categoryQuestions = await Question.aggregate([
          { 
            $match: { 
              category: category, 
              isActive: true,
              _id: { $nin: excludeIds.map(id => require('mongoose').Types.ObjectId(id)) }
            } 
          },
          { $sample: { size: questionsToGet } }
        ]);
        
        selectedQuestions.push(...categoryQuestions);
      }
    }

    // If we don't have enough questions from balanced selection, fill the rest randomly
    if (selectedQuestions.length < count) {
      const usedIds = selectedQuestions.map(q => q._id);
      const additionalCount = count - selectedQuestions.length;
      
      const additionalQuestions = await Question.aggregate([
        { 
          $match: { 
            isActive: true,
            _id: { 
              $nin: [
                ...excludeIds.map(id => require('mongoose').Types.ObjectId(id)),
                ...usedIds
              ]
            }
          } 
        },
        { $sample: { size: additionalCount } }
      ]);
      
      selectedQuestions.push(...additionalQuestions);
    }

    // Final shuffle to randomize order
    for (let i = selectedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
    }

    // Format response
    const formattedQuestions = selectedQuestions.slice(0, count).map(q => ({
      _id: q._id,
      category: q.category,
      question: q.question,
      answers: q.answers,
      correct: q.correct,
      difficulty: q.difficulty
    }));

    res.json({ 
      questions: formattedQuestions,
      categoryDistribution: formattedQuestions.reduce((acc, q) => {
        acc[q.category] = (acc[q.category] || 0) + 1;
        return acc;
      }, {})
    });

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

// Debug: Count questions per category
router.get("/count-per-category", async (req, res) => {
  try {
    const result = await Question.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const totalQuestions = await Question.countDocuments();
    
    res.json({ 
      categoryBreakdown: result,
      totalQuestions,
      categoriesWithLowCount: result.filter(cat => cat.count < 10)
    });
  } catch (error) {
    console.error("Error counting questions per category:", error);
    res.status(500).json({ error: "Failed to count questions" });
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
