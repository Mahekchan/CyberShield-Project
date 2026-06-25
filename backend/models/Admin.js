// backend/models/Admin.js - Defines the Mongoose schema for admin users.
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  emergencyContact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  profileImage: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
