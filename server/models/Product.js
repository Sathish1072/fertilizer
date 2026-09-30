const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Nitrogen',
        'Phosphate',
        'Potassium',
        'Complex',
        'Organic',
        'Micronutrients',
        'Bio-Fertilizer',
      ],
      default: 'Organic',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    unit: {
      type: String,
      default: '50 kg',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    },
    stock: {
      type: Number,
      required: true,
      default: 20,
      min: [0, 'Stock cannot be negative'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    npk: {
      type: String,
      default: 'N/A',
    },
    composition: {
      type: String,
      default: '',
    },
    suitableCrops: {
      type: [String],
      default: ['Paddy', 'Wheat', 'Vegetables', 'Cotton', 'Sugarcane'],
    },
    manufacturer: {
      type: String,
      default: 'AgroGrow Industries Ltd.',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
