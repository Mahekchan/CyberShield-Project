const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  // Optional: store the student's Firebase `userId` for easier client targeting
  studentUserId: { type: String },
  senderId: { type: String },
  senderName: { type: String },
  title: { type: String },
  text: { type: String },
  isWarning: { type: Boolean, default: true },
  warningType: { type: String },
  severity: { type: String },
  adminNotes: { type: String },
  escalationAction: { type: String },
  escalationDuration: { type: Number },
  caseStatus: { type: String, default: 'Open' },
  readByStudent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

const AdminAction = mongoose.model('AdminAction', adminActionSchema);
module.exports = AdminAction;
