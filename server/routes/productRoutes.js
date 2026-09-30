const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const initialProducts = require('../seed/productsData');
const { getDBStatus } = require('../config/db');

// In-memory fallback products copy
let memoryProducts = initialProducts.map((p, idx) => ({
  ...p,
  _id: 'prod_' + (idx + 1),
  createdAt: new Date(),
}));

// @route   GET /api/products
// @desc    Get all products with filtering, search, and sorting
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.isConnected) {
      let query = {};

      if (category && category !== 'all') {
        query.category = category;
      }

      if (search && search.trim()) {
        query.$or = [
          { name: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
          { npk: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'price_asc') sortOptions = { price: 1 };
      else if (sort === 'price_desc') sortOptions = { price: -1 };
      else if (sort === 'rating') sortOptions = { rating: -1 };
      else if (sort === 'name') sortOptions = { name: 1 };

      const products = await Product.find(query).sort(sortOptions);
      return res.json({ success: true, count: products.length, products });
    } else {
      // In-memory fallback
      let list = [...memoryProducts];

      if (category && category !== 'all') {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            (p.npk && p.npk.toLowerCase().includes(s))
        );
      }

      if (minPrice) list = list.filter((p) => p.price >= Number(minPrice));
      if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));

      if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

      return res.json({ success: true, count: list.length, products: list });
    }
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, product });
    } else {
      const product = memoryProducts.find((p) => String(p._id) === String(req.params.id));
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, product });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create new fertilizer product (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, price, unit, description, image, stock, npk, composition, manufacturer } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'Name, category, and price are required' });
    }

    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      const product = await Product.create({
        name,
        category,
        price: Number(price),
        unit: unit || '50 kg',
        description: description || 'High-yield agricultural fertilizer',
        image: image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        stock: Number(stock) || 25,
        rating: 4.8,
        npk: npk || 'N/A',
        composition: composition || '',
        manufacturer: manufacturer || 'AgroGrow Industries Ltd.',
      });
      return res.status(201).json({ success: true, product });
    } else {
      const newProd = {
        _id: 'prod_' + Date.now(),
        name,
        category,
        price: Number(price),
        unit: unit || '50 kg',
        description: description || 'High-yield agricultural fertilizer',
        image: image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
        stock: Number(stock) || 25,
        rating: 4.8,
        npk: npk || 'N/A',
        composition: composition || '',
        manufacturer: manufacturer || 'AgroGrow Industries Ltd.',
        createdAt: new Date(),
      };
      memoryProducts.unshift(newProd);
      return res.status(201).json({ success: true, product: newProd });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update fertilizer product (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, product });
    } else {
      const idx = memoryProducts.findIndex((p) => String(p._id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      memoryProducts[idx] = { ...memoryProducts[idx], ...req.body };
      return res.json({ success: true, product: memoryProducts[idx] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete fertilizer product (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      const idx = memoryProducts.findIndex((p) => String(p._id) === String(req.params.id));
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      memoryProducts.splice(idx, 1);
      return res.json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products/reset-seed
// @desc    Reset and re-seed catalog
router.post('/reset-seed', protect, adminOnly, async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.isConnected) {
      await Product.deleteMany({});
      await Product.insertMany(initialProducts);
      const count = await Product.countDocuments();
      return res.json({ success: true, message: `Successfully re-seeded ${count} products` });
    } else {
      memoryProducts = initialProducts.map((p, idx) => ({
        ...p,
        _id: 'prod_' + (idx + 1),
        createdAt: new Date(),
      }));
      return res.json({ success: true, message: `Re-seeded ${memoryProducts.length} products in memory` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
