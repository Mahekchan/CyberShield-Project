const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET /api/dashboard/active-users
router.get('/active-users', async (req, res) => {
  try {
    const count = await Student.countDocuments({ isProfileComplete: true });
    res.json({ activeUsers: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;