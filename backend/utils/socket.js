const { Server } = require('socket.io');

let io = null;

/**
 * Initialize Socket.io with HTTP server
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room designated for a specific user ID
    socket.on('join_user', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket] Client ${socket.id} joined room user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => io;

/**
 * Send real-time notification to a specific user
 */
const sendRealtimeNotification = (userId, notification) => {
  if (io && userId) {
    io.to(`user_${userId}`).emit('new_notification', notification);
    console.log(`[Socket] Real-time notification emitted to user_${userId}`);
  }
};

/**
 * Broadcast event to all connected clients
 */
const broadcastEvent = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendRealtimeNotification,
  broadcastEvent
};
