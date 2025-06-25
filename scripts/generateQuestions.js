const fetch = require("node-fetch");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const systemPrompt = `
You are an expert trivia creator working for a fun, high-quality quiz game.
Your mission is to generate 10 trivia questions in a given category.
The result must be useful in an actual game and feel clever, surprising, or funny.

CONTENT RULES
1. All questions must be based on real, verifiable facts – no fake info or opinion-based stuff.
2. The tone should be curious, playful, and clever – not dry or robotic.
3. In each batch of 10 questions:
   - 7–8 should be classic trivia (clear, fact-based, useful knowledge).
   - 2–3 should be “special”:
     • Surprising (wow-fact)
     • Funny (playful wording or twist)
     • Clever (riddle-like or ironic)
     • Lightly weird (but true)

Avoid:
- Repetition or template-style questions.
- Anything about politics, religion, or offensive topics.
- No long intros or explanations – just the questions.

FORMAT (JSON array of 10 objects):
[
  {
    "question": "What color is an airplane’s black box?",
    "answer": "Orange",
    "category": "Technology"
  },
  ...
]

Output only the JSON array. No explanations.
`;

async function generateQuestions(category) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      temperature: 0.9,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Write 10 trivia questions in the category: ${category}`,
        },
      ],
    }),
  });

  const data = await response.json();

  try {
    const jsonStart = data.choices[0].message.content.indexOf("[");
    const jsonEnd = data.choices[0].message.content.lastIndexOf("]");
    const rawJson = data.choices[0].message.content.slice(
      jsonStart,
      jsonEnd + 1,
    );
    return JSON.parse(rawJson);
  } catch (err) {
    console.error("❌ Error parsing AI output:", err);
    console.log("Raw output:", data.choices[0].message.content);
    return [];
  }
}

module.exports = generateQuestions;
