
// add-dummy-users.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const dummyUsers = [
  {
    username: 'admin123',
    password: 'password123',
    plainPassword: 'password123',
    email: 'admin@mimirgames.com',
    friends: ['alice7', 'bob456'],
    gamesPlayed: 47,
    correctAnswers: 234,
    fullScores: 12,
    fullScorePercentage: '26%',
    bestStreak: 5,
    createdAt: new Date('2024-01-15')
  },
  {
    username: 'alice7',
    password: 'alice2024',
    plainPassword: 'alice2024',
    email: 'alice@example.com',
    friends: ['admin123', 'charlie'],
    gamesPlayed: 23,
    correctAnswers: 156,
    fullScores: 8,
    fullScorePercentage: '35%',
    bestStreak: 3,
    createdAt: new Date('2024-02-03')
  },
  {
    username: 'bob456',
    password: 'bobsecret',
    plainPassword: 'bobsecret',
    email: 'bob.smith@gmail.com',
    friends: ['admin123'],
    gamesPlayed: 31,
    correctAnswers: 189,
    fullScores: 15,
    fullScorePercentage: '48%',
    bestStreak: 7,
    createdAt: new Date('2024-01-28')
  },
  {
    username: 'charlie',
    password: 'charlie99',
    plainPassword: 'charlie99',
    email: 'charlie.dev@hotmail.com',
    friends: ['alice7', 'diana88'],
    gamesPlayed: 67,
    correctAnswers: 445,
    fullScores: 22,
    fullScorePercentage: '33%',
    bestStreak: 9,
    createdAt: new Date('2024-01-10')
  },
  {
    username: 'diana88',
    password: 'dianaPW',
    plainPassword: 'dianaPW',
    email: 'diana@company.org',
    friends: ['charlie'],
    gamesPlayed: 89,
    correctAnswers: 623,
    fullScores: 31,
    fullScorePercentage: '35%',
    bestStreak: 12,
    createdAt: new Date('2024-02-14')
  }
];

async function addDummyUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional)
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Hash passwords and add users
    for (const userData of dummyUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`✅ Added user: ${userData.username}`);
    }

    console.log('🎉 All dummy users added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding dummy users:', error);
    process.exit(1);
  }
}

addDummyUsers();
