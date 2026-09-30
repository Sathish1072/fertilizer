const mongoose = require('mongoose');

let isConnected = false;
let dbType = 'none';

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️  MONGODB_URI is not set in environment variables.');
    console.warn('ℹ️  The backend will use an in-memory mock store until a MongoDB Atlas URI is configured.');
    dbType = 'memory-fallback';
    return { isConnected: false, type: 'memory-fallback' };
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 15000,
    });

    isConnected = true;
    dbType = 'mongodb-atlas';
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return { isConnected: true, host: conn.connection.host, type: 'mongodb-atlas' };
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Falling back to in-memory store so the application remains functional.');
    isConnected = false;
    dbType = 'memory-fallback';
    return { isConnected: false, error: error.message, type: 'memory-fallback' };
  }
};

const getDBStatus = () => ({
  isConnected,
  dbType,
  database: mongoose.connection?.name || 'fertilizer_shop',
  readyState: mongoose.connection?.readyState || 0,
});

module.exports = { connectDB, getDBStatus };
