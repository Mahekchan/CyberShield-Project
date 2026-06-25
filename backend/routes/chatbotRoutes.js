const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const chatbotController = require('../controllers/chatbotController');

// Send a message to chatbot (with optional image upload)
router.post('/chat', upload.single('image'), chatbotController.sendMessage);

// Get conversation history
router.get('/history', chatbotController.getConversationHistory);

// Clear conversation
router.post('/clear', chatbotController.clearConversation);

// Get all conversations (admin only)
router.get('/admin/conversations', chatbotController.getAllConversations);

// Submit feedback on a message
router.post('/feedback', chatbotController.submitFeedback);

// Get analytics for all users (admin only)
router.get('/analytics/all', chatbotController.getAllAnalytics);

// Get analytics for a specific user
router.get('/analytics/user/:userId', chatbotController.getUserAnalytics);

module.exports = router;
