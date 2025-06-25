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

module.exports = router;
