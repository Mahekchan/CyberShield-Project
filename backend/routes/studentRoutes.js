// backend/routes/studentRoutes.js - Defines the API endpoints for student profiles.
const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  createOrUpdateStudentProfile,
  deleteStudentAccount,
} = require('../controllers/studentController');

// Route to get a specific student profile by ID
router.get('/profile/:userId', getStudentProfile);

// Route to create or update a student profile
router.post('/profile', createOrUpdateStudentProfile);

// Route to delete a student account
router.delete('/:userId', deleteStudentAccount);

module.exports = router;
