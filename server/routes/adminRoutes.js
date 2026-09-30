const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { getDBStatus } = require('../config/db');

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics, revenue, order statistics
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.isConnected) {
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalUsers = await User.countDocuments();

      // Aggregate revenue
      const revenueAgg = await Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
      ]);
      const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

      // Status breakdown
      const statusCounts = await Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
      ]);

      const lowStockProducts = await Product.find({ stock: { $lte: 20 } }).select('name stock category price');
      const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

      return res.json({
        success: true,
        stats: {
          totalRevenue,
          totalOrders,
          totalProducts,
          totalUsers,
          statusCounts,
          lowStockCount: lowStockProducts.length,
          lowStockProducts,
          recentOrders,
          dbStatus,
        },
      });
    } else {
      // Memory fallback metrics
      return res.json({
        success: true,
        stats: {
          totalRevenue: 4343,
          totalOrders: 2,
          totalProducts: 10,
          totalUsers: 2,
          statusCounts: [
            { _id: 'Delivered', count: 1 },
            { _id: 'Shipped', count: 1 },
          ],
          lowStockCount: 0,
          lowStockProducts: [],
          recentOrders: [],
          dbStatus,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
