
const express = require("express");
const Question = require("../models/Question");
const router = express.Router();

// Get random questions for quiz with balanced category distribution and session deduplication
router.get("/random/:count?", async (req, res) => {
  try {
    const count = parseInt(req.params.count) || 8;
    const excludeIds = req.query.exclude ? req.query.exclude.split(',') : [];
    const sessionId = req.query.sessionId || 'default';
    
    // Convert string IDs to ObjectIds for MongoDB queries
    const mongoose = require('mongoose');
    const excludeObjectIds = excludeIds.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (e) {
        return null;
      }
    }).filter(id => id !== null);

    // Get all available categories
    const categories = await Question.distinct("category", { isActive: true });
    
    if (categories.length === 0) {
      return res.status(400).json({ error: "No question categories available" });
    }

    let selectedQuestions = [];
    const questionsPerCategory = Math.floor(count / categories.length);
    const remainingQuestions = count % categories.length;

    // Strategy: Try to get questions from each category for balanced distribution
    for (let i = 0; i < categories.length && selectedQuestions.length < count; i++) {
      const category = categories[i];
      const questionsToGet = questionsPerCategory + (i < remainingQuestions ? 1 : 0);
      
      if (questionsToGet > 0) {
        const categoryQuestions = await Question.aggregate([
          { 
            $match: { 
              category: category, 
              isActive: true,
              _id: { $nin: excludeObjectIds }
            } 
          },
          { $sample: { size: Math.min(questionsToGet, 10) } }
        ]);
        
        selectedQuestions.push(...categoryQuestions.slice(0, questionsToGet));
      }
    }

    // If we still need more questions, fill randomly from any category
    if (selectedQuestions.length < count) {
      const usedIds = selectedQuestions.map(q => q._id);
      const additionalCount = count - selectedQuestions.length;
      
      const additionalQuestions = await Question.aggregate([
        { 
          $match: { 
            isActive: true,
            _id: { 
              $nin: [...excludeObjectIds, ...usedIds]
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

    // Calculate category distribution for debugging
    const categoryDistribution = formattedQuestions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {});

    res.json({ 
      questions: formattedQuestions,
      categoryDistribution,
      sessionId,
      excludedCount: excludeIds.length,
      totalAvailable: await Question.countDocuments({ isActive: true })
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

// Admin: Bulk import questions for future expansion
router.post("/import", async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: "Questions must be an array" });
    }

    // Validate each question
    const validatedQuestions = [];
    const errors = [];

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.category || !q.question || !Array.isArray(q.answers) || typeof q.correct !== 'number') {
        errors.push(`Question ${i + 1}: Missing required fields (category, question, answers, correct)`);
        continue;
      }

      if (q.answers.length !== 4) {
        errors.push(`Question ${i + 1}: Must have exactly 4 answers`);
        continue;
      }

      if (q.correct < 0 || q.correct > 3) {
        errors.push(`Question ${i + 1}: Correct answer index must be 0-3`);
        continue;
      }

      validatedQuestions.push({
        category: q.category.trim(),
        question: q.question.trim(),
        answers: q.answers.map(a => a.trim()),
        correct: q.correct,
        difficulty: q.difficulty || 'medium',
        isActive: q.isActive !== false
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation errors", details: errors });
    }

    // Insert questions
    const insertedQuestions = await Question.insertMany(validatedQuestions);
    
    // Return updated stats
    const newStats = await Question.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(201).json({ 
      message: `Successfully imported ${insertedQuestions.length} questions`,
      imported: insertedQuestions.length,
      categoryStats: newStats,
      totalQuestions: await Question.countDocuments()
    });

  } catch (error) {
    console.error("Error importing questions:", error);
    res.status(500).json({ error: "Failed to import questions" });
  }
});

// Debug: Verify question distribution
router.get("/distribution", async (req, res) => {
  try {
    const pipeline = [
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: "$category", 
          count: { $sum: 1 },
          difficulties: { $push: "$difficulty" }
        } 
      },
      { $sort: { _id: 1 } }
    ];
    
    const distribution = await Question.aggregate(pipeline);
    const totalQuestions = await Question.countDocuments({ isActive: true });
    
    // Check for categories with less than 10 questions
    const underPopulated = distribution.filter(cat => cat.count < 10);
    const balanced = distribution.every(cat => cat.count >= 10);

    res.json({
      totalQuestions,
      categoriesCount: distribution.length,
      distribution,
      isBalanced: balanced,
      targetTotal: distribution.length * 10,
      underPopulatedCategories: underPopulated,
      recommendations: balanced ? 
        "✅ All categories have 10+ questions" : 
        `⚠️ ${underPopulated.length} categories need more questions`
    });

  } catch (error) {
    console.error("Error checking distribution:", error);
    res.status(500).json({ error: "Failed to check distribution" });
  }
});

// Simple verification endpoint for production readiness
router.get("/verify", async (req, res) => {
  try {
    const stats = await Question.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    const totalQuestions = await Question.countDocuments({ isActive: true });
    const expectedTotal = 120; // 12 categories × 10 questions
    const perfectBalance = stats.every(cat => cat.count === 10);
    
    const status = {
      ready: totalQuestions === expectedTotal && perfectBalance,
      totalQuestions,
      expectedTotal,
      categoriesCount: stats.length,
      perfectBalance,
      stats, // Include detailed stats for frontend
      issues: []
    };
    
    if (totalQuestions !== expectedTotal) {
      status.issues.push(`Total questions: ${totalQuestions}, expected: ${expectedTotal}`);
    }
    
    if (!perfectBalance) {
      const unbalanced = stats.filter(cat => cat.count !== 10);
      status.issues.push(`Unbalanced categories: ${unbalanced.map(c => `${c._id}(${c.count})`).join(', ')}`);
    }
    
    res.json(status);
    
  } catch (error) {
    console.error("Error verifying system:", error);
    res.status(500).json({ error: "Failed to verify system" });
  }
});

// Admin: Bulk delete questions by IDs (for duplicate removal)
router.post("/admin/bulk-delete", async (req, res) => {
  try {
    const { questionIds } = req.body;
    
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
      return res.status(400).json({ error: "questionIds must be a non-empty array" });
    }

    // Convert string IDs to ObjectIds
    const mongoose = require('mongoose');
    const objectIds = questionIds.map(id => {
      try {
        return new mongoose.Types.ObjectId(id);
      } catch (e) {
        throw new Error(`Invalid question ID: ${id}`);
      }
    });

    console.log(`🗑️ Bulk deleting ${objectIds.length} questions:`, questionIds);

    // Delete the questions
    const deleteResult = await Question.deleteMany({ _id: { $in: objectIds } });
    
    console.log(`✅ Successfully deleted ${deleteResult.deletedCount} questions`);
    
    // Get updated stats
    const updatedStats = await Question.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({ 
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} questions`,
      deletedCount: deleteResult.deletedCount,
      requestedCount: questionIds.length,
      updatedStats,
      totalQuestions: await Question.countDocuments()
    });

  } catch (error) {
    console.error("Error bulk deleting questions:", error);
    res.status(500).json({ 
      error: "Failed to delete questions",
      details: error.message 
    });
  }
});

module.exports = router;
