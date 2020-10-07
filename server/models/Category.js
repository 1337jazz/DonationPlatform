const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    maxlength: 255,
  },
  verifyFireLabels: {
    type: Boolean,
    required: true,
  }
});

module.exports = mongoose.model('Category', categorySchema);
