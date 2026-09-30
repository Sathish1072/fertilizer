const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const initialProducts = require('./productsData');

const seedDatabase = async () => {
  try {
    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('🌱 Seeding initial fertilizer products catalog...');
      await Product.insertMany(initialProducts);
      console.log(`✅ Seeded ${initialProducts.length} fertilizer products.`);
    } else {
      console.log(`ℹ️  Database already contains ${productCount} products.`);
    }

    // 2. Seed Default Admin User
    const adminEmail = 'admin@fertilizershop.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      console.log('👤 Creating default Admin user...');
      admin = await User.create({
        name: 'Agro Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        phone: '9876543210',
        address: {
          street: '12 Kissan Bhavan',
          city: 'Nagpur',
          state: 'Maharashtra',
          pincode: '440001',
        },
      });
      console.log('✅ Default Admin created: admin@fertilizershop.com / Admin@123');
    }

    // 3. Seed Demo Customer User
    const customerEmail = 'farmer@demo.com';
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
      console.log('🌾 Creating demo Farmer customer user...');
      customer = await User.create({
        name: 'Ramesh Patel',
        email: customerEmail,
        password: 'Farmer@123',
        role: 'customer',
        phone: '9845098450',
        address: {
          street: 'Plot 45, Green Valley Farm Road',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001',
        },
      });
      console.log('✅ Demo Customer created: farmer@demo.com / Farmer@123');
    }

    // 4. Seed Initial Orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log('📦 Seeding sample orders for demonstration...');
      const products = await Product.find().limit(3);
      if (products.length > 0) {
        await Order.create([
          {
            orderId: 'ORD1704891234567',
            user: customer._id,
            customerEmail: customer.email,
            customerName: customer.name,
            items: [
              {
                product: products[0]._id,
                name: products[0].name,
                price: products[0].price,
                quantity: 2,
                unit: products[0].unit,
                image: products[0].image,
              },
              {
                product: products[1]._id,
                name: products[1].name,
                price: products[1].price,
                quantity: 1,
                unit: products[1].unit,
                image: products[1].image,
              },
            ],
            shippingAddress: {
              fullName: customer.name,
              phone: customer.phone,
              address: customer.address.street,
              city: customer.address.city,
              state: customer.address.state,
              pincode: customer.address.pincode,
              notes: 'Deliver to Farm Gate #2',
            },
            paymentMethod: 'upi',
            paymentStatus: 'Completed',
            orderStatus: 'Delivered',
            subtotal: products[0].price * 2 + products[1].price,
            tax: 95,
            shippingFee: 0,
            discount: 100,
            totalAmount: products[0].price * 2 + products[1].price + 95 - 100,
            statusTimeline: [
              { status: 'Placed', timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000), note: 'Order placed via UPI' },
              { status: 'Confirmed', timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000), note: 'Payment verified and inventory reserved' },
              { status: 'Shipped', timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000), note: 'Dispatched via AgriExpress Logistics' },
              { status: 'Out for Delivery', timestamp: new Date(Date.now() - 1 * 24 * 3600 * 1000), note: 'Driver on route' },
              { status: 'Delivered', timestamp: new Date(Date.now() - 12 * 3600 * 1000), note: 'Handed over to customer' },
            ],
          },
          {
            orderId: 'ORD1704977634567',
            user: customer._id,
            customerEmail: customer.email,
            customerName: customer.name,
            items: [
              {
                product: products[2] ? products[2]._id : products[0]._id,
                name: products[2] ? products[2].name : products[0].name,
                price: products[2] ? products[2].price : products[0].price,
                quantity: 1,
                unit: products[2] ? products[2].unit : products[0].unit,
                image: products[2] ? products[2].image : products[0].image,
              },
            ],
            shippingAddress: {
              fullName: customer.name,
              phone: customer.phone,
              address: customer.address.street,
              city: customer.address.city,
              state: customer.address.state,
              pincode: customer.address.pincode,
              notes: 'Urgent delivery for upcoming sowing season',
            },
            paymentMethod: 'cod',
            paymentStatus: 'Cash On Delivery',
            orderStatus: 'Shipped',
            subtotal: products[2] ? products[2].price : products[0].price,
            tax: 50,
            shippingFee: 0,
            discount: 0,
            totalAmount: (products[2] ? products[2].price : products[0].price) + 50,
            statusTimeline: [
              { status: 'Placed', timestamp: new Date(Date.now() - 24 * 3600 * 1000), note: 'Order placed with Cash on Delivery' },
              { status: 'Confirmed', timestamp: new Date(Date.now() - 18 * 3600 * 1000), note: 'Confirmed with warehouse' },
              { status: 'Shipped', timestamp: new Date(Date.now() - 6 * 3600 * 1000), note: 'In transit to local hub' },
            ],
          },
        ]);
        console.log('✅ Sample orders seeded.');
      }
    }
  } catch (error) {
    console.error('Error during database seeding:', error.message);
  }
};

module.exports = seedDatabase;
