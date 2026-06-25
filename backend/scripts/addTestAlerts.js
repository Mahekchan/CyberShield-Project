// backend/scripts/addTestAlerts.js
// This script adds test flagged messages (alerts) to MongoDB for demonstration
// Run with: node backend/scripts/addTestAlerts.js (from project root)

require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('../models/Student');
const connectDB = require('../config/db');

async function addTestAlerts() {
  try {
    if (!process.env.MONGO_URI) {
      console.error('Please set MONGO_URI in your environment (.env) before running this script.');
      process.exit(1);
    }

    await connectDB();

    // Get the first student from the database
    const student = await Student.findOne();
    if (!student) {
      console.log('❌ No students found in database. Please run seedStudents.js first.');
      process.exit(1);
    }

    console.log(`✅ Found student: ${student.fullName} (ID: ${student._id})`);

    // Get or create the Message model
    const messageSchema = new mongoose.Schema({
      senderId: String,
      receiverId: String,
      senderName: { type: String, default: "" },
      receiverName: { type: String, default: "" },
      text: String,
      language: { type: String, default: "English" },
      englishMeaning: { type: String, default: "" },
      isFlagged: Boolean,
      isWarning: { type: Boolean, default: false },
      warningType: { type: String, default: null },
      templateUsed: { type: String, default: null },
      severity: String,
      caseStatus: { type: String, default: "Flagged", enum: ["Flagged", "Pending Review", "Low Priority"] },
      adminNotes: { type: String, default: "" },
      escalationAction: { type: String, default: null, enum: [null, "restrict", "suspend", "ban"] },
      escalationDuration: { type: Number, default: null },
      resolvedAt: { type: Date, default: null },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

    // Test alert data
    const testAlerts = [
      {
        senderId: new mongoose.Types.ObjectId(),
        receiverId: student._id,
        senderName: "Alex Kumar",
        receiverName: student.fullName,
        text: "That's so stupid, you should just stop trying",
        englishMeaning: "That's so stupid, you should just stop trying",
        isFlagged: true,
        severity: "High",
        caseStatus: "Flagged",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        senderId: new mongoose.Types.ObjectId(),
        receiverId: student._id,
        senderName: "Jordan Smith",
        receiverName: student.fullName,
        text: "You're nothing but a waste of space",
        englishMeaning: "You're nothing but a waste of space",
        isFlagged: true,
        severity: "High",
        caseStatus: "Pending Review",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        senderId: new mongoose.Types.ObjectId(),
        receiverId: student._id,
        senderName: "Casey Johnson",
        receiverName: student.fullName,
        text: "Nobody likes you anyway",
        englishMeaning: "Nobody likes you anyway",
        isFlagged: true,
        severity: "Medium",
        caseStatus: "Flagged",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        senderId: new mongoose.Types.ObjectId(),
        receiverId: student._id,
        senderName: "Morgan Lee",
        receiverName: student.fullName,
        text: "You're so annoying, just leave",
        englishMeaning: "You're so annoying, just leave",
        isFlagged: true,
        severity: "Medium",
        caseStatus: "Low Priority",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        senderId: new mongoose.Types.ObjectId(),
        receiverId: student._id,
        senderName: "Riley Davis",
        receiverName: student.fullName,
        text: "You're not good enough for this group",
        englishMeaning: "You're not good enough for this group",
        isFlagged: true,
        severity: "Medium",
        caseStatus: "Flagged",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    ];

    // Delete existing test alerts for this student to avoid duplicates
    await Message.deleteMany({
      receiverId: student._id,
      senderName: { $in: testAlerts.map(a => a.senderName) }
    });

    // Insert test alerts
    const insertedAlerts = await Message.insertMany(testAlerts);

    console.log(`\n✅ Successfully added ${insertedAlerts.length} test alerts for ${student.fullName}`);
    console.log(`📧 Student MongoDB ID: ${student._id}`);
    console.log(`📧 Student Email: ${student.emailAddress}`);
    console.log('\n📋 Test Alerts Details:');
    insertedAlerts.forEach((alert, idx) => {
      console.log(`  ${idx + 1}. ${alert.senderName}: "${alert.text.substring(0, 40)}..." [${alert.severity}]`);
    });

    console.log('\n✨ You can now log in with the student email and see these alerts in the dashboard!');

    await mongoose.disconnect();
    console.log('\n✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Error adding test alerts:', error.message);
    process.exit(1);
  }
}

addTestAlerts();
