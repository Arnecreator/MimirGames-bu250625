module.exports = async function generateQuestions(category) {
  return Array.from({ length: 10 }, (_, i) => ({
    category,
    question: `Sample question ${i + 1} for ${category}`,
    answers: [
      `Correct answer ${i + 1}`,
      `Wrong answer A`,
      `Wrong answer B`,
      `Wrong answer C`,
    ],
    correct: 0,
    difficulty: ["easy", "medium", "hard"][i % 3],
    isActive: true,
  }));
};
