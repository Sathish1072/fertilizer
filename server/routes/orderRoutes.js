const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { getDBStatus } = require('../config/db');

// In-memory fallback orders
let memoryOrders = [
  {
    orderId: 'ORD1704891234567',
    customerName: 'Ramesh Patel',
    customerEmail: 'farmer@demo.com',
    items: [
      { name: 'Neem Coated Urea (46% N)', price: 899, quantity: 2, unit: '50 kg Bag' },
      { name: 'DAP - Diammonium Phosphate', price: 1350, quantity: 1, unit: '50 kg Bag' },
    ],
    shippingAddress: {
      fullName: 'Ramesh Patel',
      phone: '9845098450',
      address: 'Plot 45, Green Valley Farm Road',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641001',
    },
    paymentMethod: 'upi',
    paymentStatus: 'Completed',
    orderStatus: 'Delivered',
    subtotal: 3148,
    tax: 95,
    shippingFee: 0,
    discount: 100,
    totalAmount: 3143,
    statusTimeline: [
      { status: 'Placed', timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000), note: 'Order placed via UPI' },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000), note: 'Payment verified and inventory allocated' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000), note: 'Dispatched via AgriExpress' },
      { status: 'Out for Delivery', timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000), note: 'Delivery agent on way' },
      { status: 'Delivered', timestamp: new Date(Date.now() - 12 * 3600 * 1000), note: 'Successfully delivered to farm' },
    ],
    createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
    estimatedDelivery: new Date(Date.now() - 12 * 3600 * 1000),
  },
  {
    orderId: 'ORD1704977634567',
    customerName: 'Ramesh Patel',
    customerEmail: 'farmer@demo.com',
    items: [
      { name: 'Balanced NPK 19-19-19 Foliar Special', price: 1150, quantity: 1, unit: '25 kg Bag' },
    ],
    shippingAddress: {
      fullName: 'Ramesh Patel',
      phone: '9845098450',
      address: 'Plot 45, Green Valley Farm Road',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641001',
    },
    paymentMethod: 'cod',
    paymentStatus: 'Cash On Delivery',
    orderStatus: 'Shipped',
    subtotal: 1150,
    tax: 50,
    shippingFee: 0,
    discount: 0,
    totalAmount: 1200,
    statusTimeline: [
      { status: 'Placed', timestamp: new Date(Date.now() - 24 * 3600 * 1000), note: 'Order placed with Cash on Delivery' },
      { status: 'Confirmed', timestamp: new Date(Date.now() - 18 * 3600 * 1000), note: 'Confirmed with warehouse' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 6 * 3600 * 1000), note: 'In transit to local hub' },
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 3600 * 1000),
  },
];

// @route   POST /api/orders
// @desc    Create new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, discount = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    const subtotal = items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);
    const tax = Math.round(subtotal * 0.05); // 5% GST for agri fertilizers
    const shippingFee = subtotal > 1500 ? 0 : 99; // Free shipping over ₹1500
    const totalAmount = Math.max(0, subtotal + tax + shippingFee - Number(discount));

    const orderId = `ORD${Date.now()}`;
    const initialTimeline = [
      {
        status: 'Placed',
        timestamp: new Date(),
        note: `Order placed successfully via ${paymentMethod ? paymentMethod.toUpperCase() : 'UPI'}`,
      },
    ];

    const dbStatus = getDBStatus();

    if (dbStatus.isConnected) {
      const order = await Order.create({
        orderId,
        user: req.user._id || req.user.id,
        customerEmail: req.user.email,
        customerName: shippingAddress.fullName || req.user.name,
        items,
        shippingAddress,
        paymentMethod: paymentMethod || 'upi',
        paymentStatus: paymentMethod === 'cod' ? 'Cash On Delivery' : 'Completed',
        orderStatus: 'Placed',
        subtotal,
        tax,
        shippingFee,
        discount: Number(discount),
        totalAmount,
        statusTimeline: initialTimeline,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      });

      // Update product stocks
      for (const item of items) {
        if (item._id || item.product) {
          const prodId = item._id || item.product;
          await Product.findByIdAndUpdate(prodId, {
            $inc: { stock: -Number(item.quantity) },
          }).catch(() => null);
        }
      }

      return res.status(201).json({ success: true, order });
    } else {
      // In-memory fallback
      const order = {
        orderId,
        user: req.user.id,
        customerEmail: req.user.email,
        customerName: shippingAddress.fullName || req.user.name,
        items,
        shippingAddress,
        paymentMethod: paymentMethod || 'upi',
        paymentStatus: paymentMethod === 'cod' ? 'Cash On Delivery' : 'Completed',
        orderStatus: 'Placed',
        subtotal,
        tax,
        shippingFee,
        discount: Number(discount),
        totalAmount,
        statusTimeline: initialTimeline,
        createdAt: new Date(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      };
      memoryOrders.unshift(order);
      return res.status(201).json({ success: true, order });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get logged in user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      const orders = await Order.find({
        $or: [
          { user: req.user._id || req.user.id },
          { customerEmail: req.user.email },
        ],
      }).sort({ createdAt: -1 });

      return res.json({ success: true, count: orders.length, orders });
    } else {
      const userOrders = memoryOrders.filter(
        (o) => o.customerEmail?.toLowerCase() === req.user.email?.toLowerCase()
      );
      return res.json({ success: true, count: userOrders.length, orders: userOrders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/admin/all
// @desc    Get all orders (Admin only)
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: orders.length, orders });
    } else {
      return res.json({ success: true, count: memoryOrders.length, orders: memoryOrders });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get single order details & tracking status
router.get('/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.isConnected) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Allow owner or admin
      if (req.user.role !== 'admin' && order.customerEmail !== req.user.email) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }

      return res.json({ success: true, order });
    } else {
      const order = memoryOrders.find((o) => o.orderId === orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      return res.json({ success: true, order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/orders/:orderId/status
// @desc    Update order status & add timeline entry (Admin only)
router.put('/:orderId/status', protect, adminOnly, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const validStatuses = ['Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const timelineEntry = {
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status} by Administrator`,
    };

    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      const order = await Order.findOne({ orderId });
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      order.orderStatus = status;
      order.statusTimeline.push(timelineEntry);
      await order.save();

      return res.json({ success: true, order });
    } else {
      const order = memoryOrders.find((o) => o.orderId === orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      order.orderStatus = status;
      if (!order.statusTimeline) order.statusTimeline = [];
      order.statusTimeline.push(timelineEntry);
      return res.json({ success: true, order });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
