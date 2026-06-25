const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all active student profiles (isProfileComplete = true)
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({ isProfileComplete: true }).select(
      'fullName emailAddress mobileNumber studentClass dateOfBirth gender parentName parentEmail parentPhone'
    );
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
});

module.exports = router;
