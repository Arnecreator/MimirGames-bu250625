
const mongoose = require("mongoose");
const Question = require("../models/Question");
require("dotenv").config();

async function mergeAllQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Get current question statistics
    const totalQuestions = await Question.countDocuments({ isActive: true });
    
    const categoryStats = await Question.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log("\n📊 Current Question Database:");
    console.log(`Total Questions: ${totalQuestions}`);
    console.log(`Categories: ${categoryStats.length}`);
    
    console.log("\n📋 Questions by Category:");
    categoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} questions`);
    });

    // Calculate engagement ratio
    const creativeCategories = [
      "Weird Science", "Fun History", "Cultural Oddities", 
      "True or False", "Surprising Animals", "Food Facts", 
      "Mind-Blowing Facts"
    ];
    
    const creativeCount = await Question.countDocuments({ 
      category: { $in: creativeCategories }, 
      isActive: true 
    });
    
    const standardCount = totalQuestions - creativeCount;
    
    console.log("\n🎯 Question Mix Analysis:");
    console.log(`Creative/Engaging Questions: ${creativeCount}`);
    console.log(`Standard Trivia Questions: ${standardCount}`);
    console.log(`Engagement Ratio: ${Math.round((creativeCount / totalQuestions) * 100)}% creative`);

    if (creativeCount > 0) {
      console.log("\n✨ Your database now includes fun questions like:");
      console.log("- 'Which planet smells like rotten eggs?'");
      console.log("- 'Can spiders fly?'");
      console.log("- 'What color is a giraffe's tongue?'");
      console.log("- 'Did Vikings wear horned helmets?'");
      console.log("- 'True or False: Bananas are berries, but strawberries aren't.'");
    }

    console.log("\n🎮 Perfect for engaging quiz gameplay!");

  } catch (error) {
    console.error("❌ Error analyzing questions:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the analysis
mergeAllQuestions();
