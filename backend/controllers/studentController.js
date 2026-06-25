// backend/controllers/studentController.js - Contains the logic for student-related actions.
const Student = require('../models/Student');

// @desc    Get student profile
// @route   GET /api/students/profile/:userId
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.params.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update student profile
// @route   POST /api/students/profile
const createOrUpdateStudentProfile = async (req, res) => {
  try {
    const { userId, parentPhone, ...profileData } = req.body;

    // Find the profile by userId
    let student = await Student.findOne({ userId });

    // Use parentPhone directly from frontend
    const saveData = { ...profileData, parentPhone };

    if (student) {
      // If profile exists, update it
      student = await Student.findOneAndUpdate({ userId }, saveData, { new: true, runValidators: true });
      return res.status(200).json(student);
    } else {
      // If profile does not exist, create a new one
      student = new Student({ userId, ...saveData });
      await student.save();
      return res.status(201).json(student);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student account
// @route   DELETE /api/students/:userId
const deleteStudentAccount = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ userId: req.params.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student account not found' });
    }
    res.status(200).json({ message: 'Student account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudentProfile,
  createOrUpdateStudentProfile,
  deleteStudentAccount,
};
