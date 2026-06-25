const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Message schema for analytics
const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  senderName: { type: String, default: '' },
  receiverName: { type: String, default: '' },
  text: String,
  language: { type: String, default: 'English' },
  englishMeaning: { type: String, default: '' },
  isFlagged: Boolean,
  isWarning: { type: Boolean, default: false },
  warningType: { type: String, default: null },
  templateUsed: { type: String, default: null },
  severity: String, // High, Medium, Low
  caseStatus: { type: String, default: 'Flagged', enum: ['Flagged', 'Pending Review', 'Low Priority'] },
  adminNotes: { type: String, default: '' },
  escalationAction: { type: String, default: null, enum: [null, 'restrict', 'suspend', 'ban'] },
  escalationDuration: { type: Number, default: null },
  resolvedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);

// GET weekly flagged messages analytics
router.get('/weekly-flagged-messages', async (req, res) => {
  try {
    // Get the current date and calculate date 7 days ago
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Query all flagged messages from the last 7 days
    const flaggedMessages = await Message.find({
      isFlagged: true,
      createdAt: { $gte: sevenDaysAgo, $lte: now },
    });

    // Process data by day of week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayAbbreviation = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = {};

    // Initialize week data
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = dayAbbreviation[date.getDay()];
      weeklyData[dayName] = { day: dayName, count: 0, date: date.toISOString().split('T')[0] };
    }

    // Count messages by day
    flaggedMessages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const dayName = dayAbbreviation[messageDate.getDay()];
      if (weeklyData[dayName]) {
        weeklyData[dayName].count += 1;
      }
    });

    // Convert to array and sort by day
    const chartData = Object.values(weeklyData);

    // Calculate severity breakdown
    const severityMap = { High: 0, Medium: 0, Low: 0 };
    flaggedMessages.forEach((message) => {
      const severity = message.severity || 'Low';
      if (severityMap.hasOwnProperty(severity)) {
        severityMap[severity] += 1;
      }
    });

    const severityBreakdown = [
      { severity: 'High', count: severityMap.High, fill: '#d32f2f' },
      { severity: 'Medium', count: severityMap.Medium, fill: '#fbc02d' },
      { severity: 'Low', count: severityMap.Low, fill: '#1976d2' },
    ];

    res.status(200).json({
      weeklyData: chartData,
      severityBreakdown: severityBreakdown,
      totalFlaggedMessages: flaggedMessages.length,
      dateRange: {
        from: sevenDaysAgo.toISOString().split('T')[0],
        to: now.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Error fetching weekly flagged messages analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
