// server.js - The main entry point of the backend application.
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const dashboardRoutes = require('./routes/dashboard');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Create the Express app
const app = express();
// Enable CORS for all origins (development)
app.use(cors());

// Connect to the MongoDB database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// API routes
app.use('/api/students', studentRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Anonymous report routes (student submit, admin fetch)
const anonymousReportRoutes = require('./routes/anonymousReportRoutes');
app.use('/api/reports', anonymousReportRoutes);

// ✅ New route for user management
const userManagementRoutes = require('./routes/users');
app.use('/api/users', userManagementRoutes);

// ✅ Chatbot routes
const chatbotRoutes = require('./routes/chatbotRoutes');
app.use('/api/chatbot', chatbotRoutes);

// ✅ Messages routes (for flagged messages)
const messagesRoutes = require('./routes/messages');
app.use('/api/messages', messagesRoutes);

// ✅ Alerts routes (for student dashboard alerts - filtered by receiverId)
const alertsRoutes = require('./routes/alertsRoutes');
app.use('/api/alerts', alertsRoutes);

// ✅ Analytics routes (for admin dashboard charts and insights)
const analyticsRoutes = require('./routes/analyticsRoutes');
app.use('/api/analytics', analyticsRoutes);

// ✅ Serve uploaded files as static files
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'backend/uploads')));

const Student = require('./models/Student');

// Socket.IO: emit active users count
async function emitActiveUsers(io) {
  try {
    const count = await Student.countDocuments({ isProfileComplete: true });
    io.emit('activeUsersUpdate', { activeUsers: count });
  } catch (err) {
    // Optionally log error
  }
}

// ✅ New: emit full user list
async function emitUsers(io) {
  try {
    const students = await Student.find({ isProfileComplete: true }).select(
      'fullName emailAddress mobileNumber studentClass dateOfBirth gender parentName parentEmail parentPhone'
    );
    io.emit('usersUpdate', students);
  } catch (err) {
    // Optionally log error
  }
}

// Create HTTP server and initialize Socket.io with CORS
const http = require('http');
const initSocket = require('./config/socket');
const server = http.createServer(app);
const io = initSocket(server); // <-- get io instance here

// Store io instance for use in controllers
global.io = io;

// Socket.IO connection handler for real-time features
io.on('connection', (socket) => {
  console.log('User connected via Socket.IO:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Patch studentController to emit on profile changes
const studentController = require('./controllers/studentController');
const origCreateOrUpdate = studentController.createOrUpdateStudentProfile;
studentController.createOrUpdateStudentProfile = async function (req, res) {
  await origCreateOrUpdate.apply(this, arguments);
  emitActiveUsers(io);
  emitUsers(io); // ✅ also emit user list
};
const origDelete = studentController.deleteStudentAccount;
studentController.deleteStudentAccount = async function (req, res) {
  await origDelete.apply(this, arguments);
  emitActiveUsers(io);
  emitUsers(io); // ✅ also emit user list
};

// Simple route for the home page
app.get('/', (req, res) => {
  res.send('Welcome to the backend API!');
});

// Define the port for the server to listen on
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  // Emit on server start
  emitActiveUsers(io);
  emitUsers(io); // ✅ send initial list
});
