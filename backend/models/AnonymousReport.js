const mongoose = require('mongoose');

const AnonymousReportSchema = new mongoose.Schema({
  reportText: { type: String, required: true },
  contactOption: { type: String, enum: ['anonymous', 'contact'], default: 'anonymous' },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AnonymousReport', AnonymousReportSchema);