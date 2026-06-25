const AnonymousReport = require('../models/AnonymousReport');
const Student = require('../models/Student');

// @desc    Submit anonymous report
// @route   POST /api/reports/anonymous
exports.submitAnonymousReport = async (req, res) => {
  try {
    const { text, contactOption, studentId } = req.body;
    if (!text || !contactOption) {
      return res.status(400).json({ message: 'Report text and contact option are required.' });
    }
    let reportData = { text, contactOption };
    if (contactOption === 'contact' && studentId) {
      // Try to find by MongoDB ObjectId first
      let student = null;
      if (/^[0-9a-fA-F]{24}$/.test(studentId)) {
        student = await Student.findById(studentId).select('fullName studentClass');
      }
      // If not found, try by Firebase UID
      if (!student) {
        student = await Student.findOne({ userId: studentId }).select('fullName studentClass');
      }
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      reportData.studentId = student._id;
      reportData.senderName = student.fullName;
      reportData.senderClass = student.studentClass;
    }
    // For anonymous, do NOT save studentId or sender info
    await AnonymousReport.create(reportData);
    res.status(201).json({ message: 'Report submitted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all anonymous reports (admin)
// @route   GET /api/reports/anonymous
exports.getAnonymousReports = async (req, res) => {
  try {
    const reports = await AnonymousReport.find().populate('studentId', 'fullName studentClass');
    // Format response: if contact, include name/class; if anonymous, do not
    const formatted = reports.map(r => {
      if (r.contactOption === 'contact' && r.studentId) {
        return {
          _id: r._id,
          text: r.text,
          contactOption: r.contactOption,
          createdAt: r.createdAt,
          student: {
            name: r.studentId.fullName,
            class: r.studentId.studentClass
          }
        };
      } else {
        return {
          _id: r._id,
          text: r.text,
          contactOption: 'anonymous',
          createdAt: r.createdAt
        };
      }
    });
    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
