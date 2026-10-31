const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // In production, replace with specific frontend URL
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

const http = require('http');
const path = require('path');
const { initSocket } = require('./utils/socket');

// Create HTTP server & wrap with Socket.io
const server = http.createServer(app);
initSocket(server);

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/interviews', require('./routes/interviewRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/challenges', require('./routes/challengeRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root path handler
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the AI Interview Preparation Platform API' });
});

// Fallback Route (404)
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running with WebSockets in development mode on port ${PORT}`);
});
