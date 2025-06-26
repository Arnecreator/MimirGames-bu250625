const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// ✅ GENERATE 10 QUESTIONS VIA GPT
router.post("/generate-questions", async (req, res) => {
  const { category } = req.body;

  if (!category) return res.status(400).json({ error: "Missing category" });

  const prompt = `Generate 10 trivia quiz questions in the category "${category}". Format each exactly like this:
Question: ...
Answer: ...
Make them clear and suitable for all ages.`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.data.choices[0].message.content;

    const lines = raw.split("\n").filter((line) => line.trim() !== "");
    const parsed = [];

    let current = {};
    for (let line of lines) {
      if (line.startsWith("Question:")) {
        current.question = line.replace("Question:", "").trim();
      } else if (line.startsWith("Answer:")) {
        current.answer = line.replace("Answer:", "").trim();
        current.category = category;
        parsed.push(current);
        current = {};
      }
    }

    await Question.insertMany(parsed);
    res.json({ success: true, count: parsed.length });
  } catch (err) {
    console.error("GPT error:", err.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

module.exports = router;
