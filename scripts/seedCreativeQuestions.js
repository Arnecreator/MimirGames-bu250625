
const mongoose = require("mongoose");
const Question = require("../models/Question");
require("dotenv").config();

const creativeQuestions = [
  // Weird Science
  {
    category: "Weird Science",
    question: "Which planet in our solar system smells like rotten eggs?",
    answers: ["Mars", "Venus", "Uranus", "Saturn"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Weird Science",
    question: "What color is a giraffe's tongue?",
    answers: ["Pink", "Red", "Blue-black", "Yellow"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Weird Science",
    question: "Can spiders fly?",
    answers: ["No, never", "Yes, some can balloon through the air", "Only baby spiders", "Only in space"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Weird Science",
    question: "What happens if you cry in space?",
    answers: ["Tears freeze instantly", "Tears stick to your face", "You can't cry in space", "Tears float away as bubbles"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Weird Science",
    question: "How many hearts does an octopus have?",
    answers: ["1", "2", "3", "4"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Weird Science",
    question: "Which animal can sleep for 3 years straight?",
    answers: ["Bear", "Snail", "Sloth", "Turtle"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Weird Science",
    question: "What's the only mammal capable of true flight?",
    answers: ["Flying squirrel", "Sugar glider", "Bat", "Flying lemur"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Weird Science",
    question: "How long is a day on Venus compared to its year?",
    answers: ["A day is shorter", "A day is longer", "They're the same", "It depends on the season"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Weird Science",
    question: "What do you call a group of flamingos?",
    answers: ["A flock", "A flamboyance", "A parade", "A party"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Weird Science",
    question: "Which body part continues to grow throughout your entire life?",
    answers: ["Hair", "Nose and ears", "Teeth", "Fingernails"],
    correct: 1,
    difficulty: "medium"
  },

  // Fun History
  {
    category: "Fun History",
    question: "Did Vikings actually wear horned helmets?",
    answers: ["Yes, always", "Only in battle", "No, that's a myth", "Only Viking leaders"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Fun History",
    question: "What was ketchup sold as in the 1830s?",
    answers: ["Cooking sauce", "Medicine", "Paint", "Glue"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Fun History",
    question: "Which came first: the lighter or the match?",
    answers: ["The match", "The lighter", "They were invented together", "Neither, fire came first"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Fun History",
    question: "What did Napoleon Bonaparte fear most?",
    answers: ["Heights", "Water", "Cats", "Spiders"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Fun History",
    question: "Which ancient civilization invented pizza?",
    answers: ["Romans", "Greeks", "Egyptians", "None - pizza is modern"],
    correct: 3,
    difficulty: "medium"
  },
  {
    category: "Fun History",
    question: "What color was the Statue of Liberty when it was first built?",
    answers: ["Green", "Brown", "Copper/orange", "Gray"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Fun History",
    question: "Which food was once considered poisonous by Europeans?",
    answers: ["Potatoes", "Tomatoes", "Corn", "All of the above"],
    correct: 3,
    difficulty: "medium"
  },
  {
    category: "Fun History",
    question: "How long did the shortest war in history last?",
    answers: ["38 minutes", "2 hours", "1 day", "1 week"],
    correct: 0,
    difficulty: "hard"
  },
  {
    category: "Fun History",
    question: "What did ancient Romans use as mouthwash?",
    answers: ["Wine", "Salt water", "Urine", "Vinegar"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Fun History",
    question: "Which US president got stuck in the White House bathtub?",
    answers: ["Theodore Roosevelt", "William Howard Taft", "Abraham Lincoln", "None - this is a myth"],
    correct: 3,
    difficulty: "medium"
  },

  // Cultural Oddities
  {
    category: "Cultural Oddities",
    question: "What is illegal to do in public toilets in Switzerland after 10 PM?",
    answers: ["Flush", "Use toilet paper", "Wash hands", "Talk on phone"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Cultural Oddities",
    question: "In Japan, what do you never do with your chopsticks?",
    answers: ["Point at people", "Stick them upright in rice", "Cross them", "All of the above"],
    correct: 3,
    difficulty: "medium"
  },
  {
    category: "Cultural Oddities",
    question: "Which country has more pyramids than Egypt?",
    answers: ["Mexico", "Sudan", "Peru", "China"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Cultural Oddities",
    question: "What do Finns do in traffic jams?",
    answers: ["Honk loudly", "Get out and dance", "Turn off engines and wait silently", "Listen to heavy metal"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Cultural Oddities",
    question: "In which country is it illegal to own just one guinea pig?",
    answers: ["Germany", "Switzerland", "Austria", "Netherlands"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Cultural Oddities",
    question: "What happens in Iceland when babies nap?",
    answers: ["They sleep indoors only", "They nap outside even in winter", "They sleep in heated rooms", "They don't nap much"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Cultural Oddities",
    question: "Which country celebrates Christmas in July?",
    answers: ["Russia", "Australia", "Brazil", "South Africa"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Cultural Oddities",
    question: "What do people in Denmark put on top of their flag when someone turns 30 and is unmarried?",
    answers: ["Flowers", "Cinnamon", "Salt", "Nothing special"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Cultural Oddities",
    question: "In which city is it illegal to die?",
    answers: ["Paris", "London", "Longyearbyen, Norway", "Tokyo"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Cultural Oddities",
    question: "What do Koreans never do on their birthday?",
    answers: ["Eat cake", "Blow out candles", "Age by one year", "Have seaweed soup"],
    correct: 2,
    difficulty: "medium"
  },

  // True or False
  {
    category: "True or False",
    question: "True or False: Bananas are berries, but strawberries aren't.",
    answers: ["True", "False", "Only wild bananas", "Only organic strawberries"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "True or False",
    question: "True or False: A group of unicorns is called a blessing.",
    answers: ["True", "False", "Only baby unicorns", "It's called a miracle"],
    correct: 0,
    difficulty: "easy"
  },
  {
    category: "True or False",
    question: "True or False: Honey never spoils.",
    answers: ["True", "False", "Only pure honey", "Only in dry climates"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "True or False",
    question: "True or False: Goldfish have a 3-second memory.",
    answers: ["True", "False", "Only old goldfish", "Only in small bowls"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "True or False",
    question: "True or False: Sharks are older than trees.",
    answers: ["True", "False", "Only some sharks", "Only certain trees"],
    correct: 0,
    difficulty: "hard"
  },
  {
    category: "True or False",
    question: "True or False: You eat about 8 spiders per year in your sleep.",
    answers: ["True", "False", "Only in certain climates", "Only if you snore"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "True or False",
    question: "True or False: Bubble wrap was originally invented as wallpaper.",
    answers: ["True", "False", "Only the first version", "It was for insulation"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "True or False",
    question: "True or False: Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.",
    answers: ["True", "False", "Only by a few years", "They were the same time"],
    correct: 0,
    difficulty: "hard"
  },
  {
    category: "True or False",
    question: "True or False: A cloud weighs about the same as 100 elephants.",
    answers: ["True", "False", "Only storm clouds", "Only small clouds"],
    correct: 0,
    difficulty: "hard"
  },
  {
    category: "True or False",
    question: "True or False: Wombat poop is cube-shaped.",
    answers: ["True", "False", "Only baby wombats", "Only when they're sick"],
    correct: 0,
    difficulty: "medium"
  },

  // Surprising Animals
  {
    category: "Surprising Animals",
    question: "Which animal has fingerprints almost identical to humans?",
    answers: ["Chimpanzees", "Koalas", "Gorillas", "Orangutans"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Surprising Animals",
    question: "What's the only mammal that can't jump?",
    answers: ["Elephant", "Hippo", "Whale", "Sloth"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Surprising Animals",
    question: "Which animal can live without its head for a week?",
    answers: ["Cockroach", "Chicken", "Snake", "Lizard"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Surprising Animals",
    question: "What animal has the highest blood pressure?",
    answers: ["Elephant", "Blue whale", "Giraffe", "Horse"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Surprising Animals",
    question: "Which animal's milk is pink?",
    answers: ["Flamingo", "Hippopotamus", "Pig", "Cow (in certain conditions)"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Surprising Animals",
    question: "What do you call a baby kangaroo?",
    answers: ["Cub", "Pup", "Joey", "Kit"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Surprising Animals",
    question: "Which animal can change its gender?",
    answers: ["Seahorse", "Clownfish", "Frog", "All of the above"],
    correct: 3,
    difficulty: "medium"
  },
  {
    category: "Surprising Animals",
    question: "What's the loudest animal on Earth?",
    answers: ["Blue whale", "Howler monkey", "Cicada", "Elephant"],
    correct: 0,
    difficulty: "medium"
  },
  {
    category: "Surprising Animals",
    question: "Which animal sleeps standing up?",
    answers: ["Cow", "Horse", "Elephant", "All of the above"],
    correct: 3,
    difficulty: "easy"
  },
  {
    category: "Surprising Animals",
    question: "What animal has no vocal cords but can still make noise?",
    answers: ["Fish", "Snake", "Giraffe", "Rabbit"],
    correct: 2,
    difficulty: "hard"
  },

  // Food Facts
  {
    category: "Food Facts",
    question: "What makes pop rocks candy pop in your mouth?",
    answers: ["Sugar crystals", "Carbonated gas", "Citric acid", "Food coloring"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food Facts",
    question: "Which spice was once worth more than gold?",
    answers: ["Cinnamon", "Black pepper", "Saffron", "Vanilla"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food Facts",
    question: "What vegetable is technically a fruit?",
    answers: ["Carrot", "Potato", "Rhubarb", "All vegetables are vegetables"],
    correct: 2,
    difficulty: "medium"
  },
  {
    category: "Food Facts",
    question: "Which fruit has its seeds on the outside?",
    answers: ["Apple", "Strawberry", "Orange", "Grape"],
    correct: 1,
    difficulty: "easy"
  },
  {
    category: "Food Facts",
    question: "What was the first vegetable grown in space?",
    answers: ["Carrot", "Potato", "Lettuce", "Tomato"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food Facts",
    question: "Which food never goes bad?",
    answers: ["Rice", "Honey", "Salt", "Both honey and salt"],
    correct: 3,
    difficulty: "medium"
  },
  {
    category: "Food Facts",
    question: "What makes onions make you cry?",
    answers: ["Strong smell", "Sulfur compounds", "Sharp pieces", "Emotional response"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food Facts",
    question: "Which came first: tea bags or loose tea?",
    answers: ["Tea bags", "Loose tea", "They were invented together", "Tea bags for convenience"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Food Facts",
    question: "What ingredient makes bread rise?",
    answers: ["Sugar", "Salt", "Yeast", "Flour"],
    correct: 2,
    difficulty: "easy"
  },
  {
    category: "Food Facts",
    question: "Which chocolate was invented first?",
    answers: ["Milk chocolate", "Dark chocolate", "White chocolate", "All at the same time"],
    correct: 1,
    difficulty: "medium"
  },

  // Mind-Blowing Facts
  {
    category: "Mind-Blowing Facts",
    question: "What weighs more: all the ants in the world or all the humans?",
    answers: ["Humans", "Ants", "They're about equal", "Impossible to measure"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "How many possible ways can you arrange a deck of cards?",
    answers: ["Millions", "Billions", "More than atoms on Earth", "Exactly 52 factorial"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "What percentage of your body is actually human cells?",
    answers: ["100%", "About 50%", "About 75%", "About 90%"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "How many times does your heart beat in a lifetime?",
    answers: ["1 million", "100 million", "2.5 billion", "10 billion"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "What travels faster: bad news or good news?",
    answers: ["Good news", "Bad news", "They're the same", "Depends on the method"],
    correct: 1,
    difficulty: "medium"
  },
  {
    category: "Mind-Blowing Facts",
    question: "How long would it take to walk to the moon?",
    answers: ["1 year", "9 years", "50 years", "Over 100 years"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "What has more possible games: chess or checkers?",
    answers: ["Chess", "Checkers", "They're about equal", "Both are infinite"],
    correct: 0,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "How many trees are there on Earth per person?",
    answers: ["Less than 1", "About 10", "About 400", "Over 1000"],
    correct: 2,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "What would happen if you folded a piece of paper 42 times?",
    answers: ["It would reach your ceiling", "It would reach the moon", "It would reach the sun", "It's impossible"],
    correct: 1,
    difficulty: "hard"
  },
  {
    category: "Mind-Blowing Facts",
    question: "How much of the ocean have humans explored?",
    answers: ["About 50%", "About 25%", "Less than 5%", "More than 75%"],
    correct: 2,
    difficulty: "medium"
  }
];

async function seedCreativeQuestions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing questions from creative categories
    const creativeCategories = [...new Set(creativeQuestions.map(q => q.category))];
    await Question.deleteMany({ category: { $in: creativeCategories } });
    console.log(`🧹 Cleared existing questions from creative categories: ${creativeCategories.join(', ')}`);

    // Insert new creative questions
    const questionsWithActiveFlag = creativeQuestions.map(q => ({ ...q, isActive: true }));
    await Question.insertMany(questionsWithActiveFlag);
    console.log(`✅ Inserted ${creativeQuestions.length} creative questions`);

    // Show stats
    const stats = await Question.aggregate([
      {
        $match: { category: { $in: creativeCategories } }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    console.log("\n📊 Creative Questions by category:");
    stats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} questions`);
    });

    console.log(`\n🎯 Total creative questions: ${creativeQuestions.length}`);
    console.log(`✨ Categories: ${creativeCategories.join(', ')}`);
    
    // Show total question count across all categories
    const totalCount = await Question.countDocuments({ isActive: true });
    console.log(`📚 Total questions in database: ${totalCount}`);

  } catch (error) {
    console.error("❌ Error seeding creative questions:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the seeding function
seedCreativeQuestions();
