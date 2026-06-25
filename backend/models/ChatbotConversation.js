const mongoose = require('mongoose');

const chatbotConversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  userType: {
    type: String,
    enum: ['student', 'admin'],
    required: true,
  },
  messages: [
    {
      type: {
        type: String,
        enum: ['user', 'bot'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatbotConversation = mongoose.model(
  'ChatbotConversation',
  chatbotConversationSchema
);

module.exports = ChatbotConversation;
