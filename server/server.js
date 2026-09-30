const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const { connectDB, getDBStatus } = require('./config/db');
const seedDatabase = require('./seed/seeder');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to Database and Seed if connected
connectDB()
  .then((res) => {
    if (res.isConnected) {
      seedDatabase();
    }
  })
  .catch((err) => {
    console.error('Database initialization warning:', err.message);
  });

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'FertilizerShop API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
  });
});

// Serve frontend build in production or when build/index.html exists
const buildPath = path.join(__dirname, '../build');
const indexPath = path.join(buildPath, 'index.html');
if (fs.existsSync(indexPath)) {
  console.log(`📦 Serving production build from: ${buildPath}`);
  app.use(express.static(buildPath));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(indexPath);
  });
} else {
  app.get('/', (req, res) => {
    res.send({
      message: '🌱 FertilizerShop Backend API is running.',
      docs: {
        health: '/api/health',
        products: '/api/products',
        auth: '/api/auth/login',
      },
      clientNotice: 'Run "npm run build" to build and serve the React production bundle.',
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.NODE_ENV === 'production'
  ? (process.env.PORT || 5000)
  : (process.env.SERVER_PORT || 5000);

const server = http.createServer({ maxHeaderSize: 65536 }, app);
server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 FertilizerShop Fullstack Server Started`);
  console.log(`🌐 API Server URL: http://localhost:${PORT}`);
  console.log(`🩺 Health Check:   http://localhost:${PORT}/api/health`);
  console.log(`==================================================\n`);
});

module.exports = app;
