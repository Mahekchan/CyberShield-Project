const express = require('express');
const router = express.Router();
const AnonymousReport = require('../models/AnonymousReport');
const Student = require('../models/Student');

// POST /api/reports/anonymous
router.post('/anonymous', async (req, res) => {
  try {
    const { reportText, contactOption, studentId } = req.body;
    if (!reportText || !contactOption) {
      return res.status(400).json({ message: 'reportText and contactOption are required.' });
    }
    let reportData = { reportText, contactOption };
    if (contactOption === 'contact') {
      if (!studentId) {
        return res.status(400).json({ message: 'studentId required for contact option.' });
      }
      reportData.studentId = studentId;
    }
    await AnonymousReport.create(reportData);
    res.status(201).json({ message: 'Report submitted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reports/anonymous
router.get('/anonymous', async (req, res) => {
  try {
        const reports = await AnonymousReport.find().sort({ createdAt: -1 }).populate({
      path: 'studentId',
      select: 'fullName studentClass'
    });

    // Format response as required
    const formatted = reports.map(r => {
      if (r.contactOption === 'contact' && r.studentId) {
        return {
          reportText: r.reportText,
          contactOption: r.contactOption,
          createdAt: r.createdAt,
          student: {
            _id: r.studentId._id,
            fullName: r.studentId.fullName,
            className: r.studentId.studentClass // <-- use studentClass, but name it className in response
          }
        };
      } else {
        return {
          reportText: r.reportText,
          contactOption: r.contactOption,
          createdAt: r.createdAt
        };
      }
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;