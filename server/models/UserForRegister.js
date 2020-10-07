const mongoose = require('mongoose');

const userForRegisterSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  adminkey: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  }
});

module.exports = mongoose.model('UserForRegister', userForRegisterSchema);
