module.exports = async function generateQuestions(category) {
  console.log(`Generating 10 questions for category: ${category}`);
  
  const questions = Array.from({ length: 10 }, (_, i) => ({
    category,
    question: `Sample question ${i + 1} for ${category}: What is a key concept in this field?`,
    answers: [
      `Correct answer for ${category} question ${i + 1}`,
      `Wrong answer A for ${category}`,
      `Wrong answer B for ${category}`,
      `Wrong answer C for ${category}`,
    ],
    correct: 0,
    difficulty: ["easy", "medium", "hard"][i % 3],
    isActive: true,
  }));

  console.log(`Generated ${questions.length} questions for ${category}`);
  return questions;
};
