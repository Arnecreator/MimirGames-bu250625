
const express = require('express');
const router = express.Router();
const generateQuestions = require('../scripts/generateQuestions');
const Question = require('../models/Question');

// Generate questions endpoint
router.post('/generate-questions', async (req, res) => {
  try {
    const { category } = req.body;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    console.log(`🎯 Generating questions for category: ${category}`);
    
    // Generate questions using the existing script
    const questions = await generateQuestions(category);
    
    if (!questions || questions.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'No questions were generated'
      });
    }

    // Save questions to database
    const savedQuestions = await Question.insertMany(questions);
    
    console.log(`✅ Successfully generated and saved ${savedQuestions.length} questions for ${category}`);
    
    res.json({
      success: true,
      count: savedQuestions.length,
      message: `${savedQuestions.length} questions generated for ${category}`
    });

  } catch (error) {
    console.error('❌ Error generating questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate questions: ' + error.message
    });
  }
});

module.exports = router;
