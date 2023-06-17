const mongoose = require('mongoose');

// Define the schema for the email subscription
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Email model
const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
