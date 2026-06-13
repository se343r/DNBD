const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');

// Import các route
const fieldsRoutes = require('./routes/fields');
const periodsRoutes = require('./routes/periods');
const celebritiesRoutes = require('./routes/celebrities');
const storiesRoutes = require('./routes/stories');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Middleware to ensure DB connection is active before any routes (essential for serverless environment)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

// ===== API ROUTES =====

// Kiểm tra trạng thái server
app.get('/api/status', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend server đang chạy và đã kết nối SQL Server!',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount các route theo từng bảng
app.use('/api/fields', fieldsRoutes);
app.use('/api/periods', periodsRoutes);
app.use('/api/celebrities', celebritiesRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/users', usersRoutes);

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error('❌ Lỗi server:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Đã xảy ra lỗi hệ thống từ phía Server!'
  });
});

// ===== KHỞI ĐỘNG SERVER =====
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🚀 Server đang chạy tại Port: ${PORT}`);
      console.log(`---------------------------------------------`);
      console.log(`📌 API Status:      http://localhost:${PORT}/api/status`);
      console.log(`📌 API Fields:      http://localhost:${PORT}/api/fields`);
      console.log(`📌 API Periods:     http://localhost:${PORT}/api/periods`);
      console.log(`📌 API Celebrities: http://localhost:${PORT}/api/celebrities`);
      console.log(`📌 API Stories:     http://localhost:${PORT}/api/stories`);
      console.log(`📌 API Users:       http://localhost:${PORT}/api/users`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
