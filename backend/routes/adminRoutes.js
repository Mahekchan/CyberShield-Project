// backend/routes/adminRoutes.js - Defines the API endpoints for admin actions.
const express = require('express');
const router = express.Router();
const {
	getAdminProfile,
	createOrUpdateAdminProfile,
	deleteAdminAccount,
	createAdminAction,
	getStudentAdminActions,
	getAllAdminActions,
} = require('../controllers/adminController');


// Route to get admin profile by userId
router.get('/profile/:userId', getAdminProfile);

// Route to create or update admin profile
router.post('/profile', createOrUpdateAdminProfile);

// Route to delete a admin account
router.delete('/:userId', deleteAdminAccount);

// Admin Actions routes
router.post('/actions', createAdminAction);
router.get('/actions', getAllAdminActions);
router.get('/actions/student/:studentId', getStudentAdminActions);

module.exports = router;
