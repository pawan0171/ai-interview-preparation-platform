const Notification = require('../models/Notification');
const { sendRealtimeNotification } = require('./socket');

/**
 * Creates notification in DB and pushes it via WebSockets in real time
 */
const notifyUser = async ({ userId, title, message, type = 'achievement' }) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type
    });

    // Instant WebSocket push
    sendRealtimeNotification(userId.toString(), notification);

    return notification;
  } catch (error) {
    console.error(`[Notification Service Error] ${error.message}`);
    return null;
  }
};

module.exports = {
  notifyUser
};
