const mongoose = require('mongoose');

// Validators
const yesnoValidator = (val) => val.toLowerCase() === 'yes' || val.toLowerCase() === 'no';

// Schemas
const itemSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  fireLabels: {
    type: String,
    required: true,
    lowercase: true,
    validate: {
      validator: yesnoValidator,
      message: 'Invalid value for fireLabels'
    }
  },
  collect: { type: Boolean, default: false },
  pictureUrls: []
});

const donationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator(val) {
        // Not perfect
        if (val === '[REDACTED]') return true;
        return val.includes('@') && val.includes('.');
      },
      message: 'Invalid email'
    }
  },
  smokeFree: {
    type: String,
    required: true,
    validate: {
      validator: yesnoValidator,
      message: 'Invalid value for smokeFree'
    }
  },
  petFree: {
    type: String,
    required: true,
    validate: {
      validator: yesnoValidator,
      message: 'Invalid value for petFree'
    }
  },
  mailingList: {type: Boolean, default: false},
  items: {
    type: [itemSchema],
    required: true
  },
  status: { type: String, default: null },
  submissionDate: { type: Date, default: Date.now() },
  collectionDate: { type: Date },
  userComments: { type: String },
  adminComments: { type: String }
});

module.exports = mongoose.model('Donation', donationSchema);
