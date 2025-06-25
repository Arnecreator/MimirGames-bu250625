const express = require("express");
const router = express.Router();
const generateQuestions = require("../scripts/generateQuestions");
const Question = require("../models/Question");

router.post("/generate-questions", async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    const questions = await generateQuestions(category);

    if (!questions || questions.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "No questions were generated" });
    }

    const saved = await Question.insertMany(questions);

    res.json({ success: true, count: saved.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add questions to a specific category (GET route for compatibility)
router.get("/addQuestions", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    console.log(`Adding 10 questions to category: ${category}`);

    const questions = await generateQuestions(category);

    if (!questions || questions.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "No questions were generated" });
    }

    const saved = await Question.insertMany(questions);

    res.json({ 
      success: true, 
      message: `Successfully added ${saved.length} questions to ${category}`,
      count: saved.length 
    });
  } catch (error) {
    console.error("Error adding questions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add questions to a specific category (POST route)
router.post("/addQuestions", async (req, res) => {
  try {
    const { category } = req.body;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    console.log(`Adding 10 questions to category: ${category}`);

    const questions = await generateQuestions(category);

    if (!questions || questions.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "No questions were generated" });
    }

    const saved = await Question.insertMany(questions);

    res.json({ 
      success: true, 
      message: `Successfully added ${saved.length} questions to ${category}`,
      count: saved.length 
    });
  } catch (error) {
    console.error("Error adding questions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete questions from a specific category
router.get("/deleteCategory", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Category is required" });
    }

    console.log(`Deleting questions from category: ${category}`);

    const deleteResult = await Question.deleteMany({ category: category });

    res.json({ 
      success: true, 
      message: `Successfully deleted ${deleteResult.deletedCount} questions from ${category}`,
      deletedCount: deleteResult.deletedCount 
    });
  } catch (error) {
    console.error("Error deleting questions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete all questions from all categories
router.get("/deleteAllCategories", async (req, res) => {
  try {
    console.log("Deleting all questions from all categories");

    const deleteResult = await Question.deleteMany({});

    res.json({ 
      success: true, 
      message: `Successfully deleted ${deleteResult.deletedCount} questions from all categories`,
      deletedCount: deleteResult.deletedCount 
    });
  } catch (error) {
    console.error("Error deleting all questions:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
