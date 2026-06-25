const ChatbotConversation = require('../models/ChatbotConversation');
const ChatbotFeedback = require('../models/ChatbotFeedback');
const { createImage, createLink, createTable, MEDIA_RESPONSES } = require('../utils/mediaUtils');
const { generateAIResponse, isOpenAIConfigured } = require('../utils/openaiUtils');

// Send chat message
exports.sendMessage = async (req, res) => {
  try {
    const { message, userType, userId, conversationHistory } = req.body;

    if (!message || !userType || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: message, userType, userId',
      });
    }

    // Generate AI response using OpenAI
    const aiResponse = await generateAIResponse(message, userType, conversationHistory);

    // Save conversation to database
    let conversation = await ChatbotConversation.findOne({
      userId,
      userType,
    });

    if (!conversation) {
      conversation = new ChatbotConversation({
        userId,
        userType,
        messages: [],
      });
    }

    // Build user message object with optional image
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date(),
    };

    // Add image URL if file was uploaded
    if (req.file) {
      userMessage.image = `/uploads/${req.file.filename}`;
    }

    conversation.messages.push(userMessage);

    conversation.messages.push({
      type: 'bot',
      content: aiResponse.reply,
      timestamp: new Date(),
      media: aiResponse.media,
    });

    conversation.updatedAt = new Date();
    await conversation.save();

    return res.status(200).json({
      success: true,
      reply: aiResponse.reply,
      suggestedActions: aiResponse.suggestedActions,
      media: aiResponse.media,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Get conversation history
exports.getConversationHistory = async (req, res) => {
  try {
    const { userId, userType } = req.query;

    if (!userId || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters: userId, userType',
      });
    }

    const conversation = await ChatbotConversation.findOne({
      userId,
      userType,
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }

    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (error) {
    console.error('Error in getConversationHistory:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Clear conversation
exports.clearConversation = async (req, res) => {
  try {
    const { userId, userType } = req.body;

    if (!userId || !userType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, userType',
      });
    }

    await ChatbotConversation.deleteOne({
      userId,
      userType,
    });

    return res.status(200).json({
      success: true,
      message: 'Conversation cleared successfully',
    });
  } catch (error) {
    console.error('Error in clearConversation:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Get all conversations (admin only)
exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await ChatbotConversation.find({}).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      conversations,
      total: conversations.length,
    });
  } catch (error) {
    console.error('Error in getAllConversations:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Submit feedback for a message
exports.submitFeedback = async (req, res) => {
  try {
    const { messageId, userType, userId, feedback } = req.body;

    if (!messageId || !userType || !userId || !feedback) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Save feedback to database
    const feedbackRecord = new ChatbotFeedback({
      messageId,
      userId,
      userType,
      feedback,
    });

    await feedbackRecord.save();

    return res.status(200).json({
      success: true,
      message: 'Feedback submitted successfully',
    });
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Get analytics for all users (admin only)
exports.getAllAnalytics = async (req, res) => {
  try {
    // Get all conversations
    const conversations = await ChatbotConversation.find({});
    
    // Get all feedback
    const feedbacks = await ChatbotFeedback.find({});

    // Calculate metrics
    let totalMessages = 0;
    let totalQuestions = 0;
    const questionCounts = {};

    conversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        totalMessages++;
        if (msg.type === 'user') {
          totalQuestions++;
          // Count question frequency
          const question = msg.content.substring(0, 50); // First 50 chars as key
          questionCounts[question] = (questionCounts[question] || 0) + 1;
        }
      });
    });

    // Calculate feedback statistics
    const helpfulFeedback = feedbacks.filter((f) => f.feedback === 'helpful').length;
    const notHelpfulFeedback = feedbacks.filter((f) => f.feedback === 'not-helpful').length;
    const feedbackRatio = helpfulFeedback + notHelpfulFeedback > 0 
      ? (helpfulFeedback / (helpfulFeedback + notHelpfulFeedback)) * 100 
      : 0;

    // Get top questions
    const topQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      totalMessages,
      totalQuestions,
      helpfulFeedback,
      notHelpfulFeedback,
      feedbackRatio: Math.round(feedbackRatio),
      topQuestions,
      averageResponseTime: 85, // Placeholder - can be enhanced with actual timing
    });
  } catch (error) {
    console.error('Error in getAllAnalytics:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

// Get analytics for a specific user
exports.getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's conversations
    const conversations = await ChatbotConversation.find({ userId });
    
    // Get user's feedback
    const feedbacks = await ChatbotFeedback.find({ userId });

    // Calculate metrics
    let totalMessages = 0;
    let totalQuestions = 0;
    const questionCounts = {};

    conversations.forEach((conv) => {
      conv.messages.forEach((msg) => {
        totalMessages++;
        if (msg.type === 'user') {
          totalQuestions++;
          // Count question frequency
          const question = msg.content.substring(0, 50);
          questionCounts[question] = (questionCounts[question] || 0) + 1;
        }
      });
    });

    // Calculate feedback statistics
    const helpfulFeedback = feedbacks.filter((f) => f.feedback === 'helpful').length;
    const notHelpfulFeedback = feedbacks.filter((f) => f.feedback === 'not-helpful').length;
    const feedbackRatio = helpfulFeedback + notHelpfulFeedback > 0
      ? (helpfulFeedback / (helpfulFeedback + notHelpfulFeedback)) * 100
      : 0;

    // Get top questions
    const topQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({ question, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return res.status(200).json({
      success: true,
      totalMessages,
      totalQuestions,
      helpfulFeedback,
      notHelpfulFeedback,
      feedbackRatio: Math.round(feedbackRatio),
      topQuestions,
      averageResponseTime: 85,
    });
  } catch (error) {
    console.error('Error in getUserAnalytics:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};
