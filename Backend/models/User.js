const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  name: { type: String, required: true },
  phone: { type: String, default: null },
  picture: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
