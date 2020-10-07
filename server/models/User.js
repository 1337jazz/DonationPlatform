const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 255,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  userSince: {
    type: Date,
    required: true,
    default: Date.now
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
