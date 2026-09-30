const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fertilizer_shop_super_secure_jwt_token_key_2026');

      let user = null;
      const dbStatus = getDBStatus();
      if (dbStatus.isConnected && mongoose.isValidObjectId(decoded.id)) {
        user = await User.findById(decoded.id).select('-password');
      }

      if (user) {
        req.user = user;
      } else {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          email: decoded.email,
          name: decoded.name || 'User',
          role: decoded.role || 'customer',
        };
      }
      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
};

module.exports = { protect, adminOnly };
