const mongoose = require('mongoose');

const chatbotFeedbackSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ['student', 'admin'],
    required: true,
  },
  feedback: {
    type: String,
    enum: ['helpful', 'not-helpful'],
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatbotFeedback', chatbotFeedbackSchema);
