// backend/controllers/adminController.js - Contains the logic for admin-related actions.
const Admin = require('../models/Admin');
const AdminAction = require('../models/AdminAction');


// @desc    Get admin profile
// @route   GET /api/admins/profile/:userId
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ userId: req.params.userId });
    if (!admin) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create or update admin profile
// @route   POST /api/admins/profile
const createOrUpdateAdminProfile = async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;
    let admin = await Admin.findOne({ userId });
    if (admin) {
      // If profile exists, update it
      admin = await Admin.findOneAndUpdate({ userId }, profileData, { new: true, runValidators: true });
      return res.status(200).json(admin);
    } else {
      // If profile does not exist, create a new one
      admin = new Admin({ userId, ...profileData });
      await admin.save();
      return res.status(201).json(admin);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete admin account
// @route   DELETE /api/admins/:userId
const deleteAdminAccount = async (req, res) => {
  try {
    const admin = await Admin.findOneAndDelete({ userId: req.params.userId });
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found' });
    }
    res.status(200).json({ message: 'Admin account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Admin Actions --------------------

// @desc    Create an admin action/warning targeted to a student
// @route   POST /api/admins/actions
const createAdminAction = async (req, res) => {
  try {
    const payload = req.body;
    // Allow admins to pass either a MongoDB `studentId` (ObjectId) or a
    // Firebase `studentUserId` (student.userId). Resolve whichever is provided
    let targetStudentId = payload.studentId;
    let targetStudentUserId = payload.studentUserId;

    // If only studentUserId (firebase uid) provided, try to resolve to ObjectId
    if (!targetStudentId && targetStudentUserId) {
      try {
        const Student = require('../models/Student');
        const student = await Student.findOne({ userId: targetStudentUserId });
        if (student) {
          targetStudentId = student._id;
        }
      } catch (e) {
        // ignore resolution error
      }
    }

    // If only studentId provided, try to populate studentUserId for easier client targeting
    if (targetStudentId && !targetStudentUserId) {
      try {
        const Student = require('../models/Student');
        const student = await Student.findById(targetStudentId);
        if (student) {
          targetStudentUserId = student.userId;
        }
      } catch (e) {
        // ignore
      }
    }

    if (!targetStudentId) {
      return res.status(400).json({ message: 'studentId (MongoDB) or studentUserId (Firebase) is required' });
    }

    const action = new AdminAction({
      studentId: targetStudentId,
      studentUserId: targetStudentUserId,
      senderId: payload.senderId,
      senderName: payload.senderName,
      title: payload.title,
      text: payload.text,
      isWarning: payload.isWarning !== undefined ? payload.isWarning : true,
      warningType: payload.warningType,
      severity: payload.severity,
      adminNotes: payload.adminNotes,
      escalationAction: payload.escalationAction,
      escalationDuration: payload.escalationDuration,
      caseStatus: payload.caseStatus || 'Open',
      expiresAt: payload.expiresAt,
    });

    const saved = await action.save();

    // Emit targeted socket event (include receiver id so clients can filter)
    try {
      if (global && global.io) {
        // Emit both student Mongo id and student firebase uid (if available)
        global.io.emit('admin_action', {
          action: saved,
          receiverId: String(saved.studentId),
          receiverUserId: saved.studentUserId,
        });
      }
    } catch (e) {
      // non-fatal
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin actions for a specific student (by student MongoDB id or firebase uid)
// @route   GET /api/admins/actions/student/:studentId
const getStudentAdminActions = async (req, res) => {
  try {
    const studentIdOrUserId = req.params.studentId;
    let studentObjectId = studentIdOrUserId;

    // If the param looks like a firebase uid (not a 24 hex char ObjectId), try to resolve
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(studentIdOrUserId)) {
      // treat as firebase userId
      const Student = require('../models/Student');
      const student = await Student.findOne({ userId: studentIdOrUserId });
      if (!student) {
        return res.status(200).json([]);
      }
      studentObjectId = student._id;
    }

    const actions = await AdminAction.find({ studentId: studentObjectId }).sort({ createdAt: -1 });
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all admin actions (for admin dashboard)
// @route   GET /api/admins/actions
const getAllAdminActions = async (req, res) => {
  try {
    const actions = await AdminAction.find().sort({ createdAt: -1 });
    res.status(200).json(actions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminProfile,
  createOrUpdateAdminProfile,
  deleteAdminAccount,
  createAdminAction,
  getStudentAdminActions,
  getAllAdminActions,
};
