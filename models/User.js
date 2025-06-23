const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, length: 7 },
    password: { type: String, required: true },
    email: { type: String },
    friends: [String]
});

module.exports = mongoose.model('User', UserSchema);
