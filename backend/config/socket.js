// backend/config/socket.js - Initializes Socket.io with CORS enabled
const { Server } = require('socket.io');

function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: '*', // Allow all origins for development; restrict in production
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Add your socket event handlers here
  });

  return io;
}

module.exports = initSocket;
