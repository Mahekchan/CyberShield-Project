// backend/models/Student.js - Defines the Mongoose schema and model for student profiles.
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, 
  },
  fullName: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
  },
  studentClass: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  parentName: {
    type: String,
  },
  parentEmail: {
    type: String,
  },
  parentPhone: {
    type: String,
  },
  profileImageUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isProfileComplete: { 
    type: Boolean, 
    default: false },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
