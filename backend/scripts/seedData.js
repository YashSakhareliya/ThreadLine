import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Fabric from '../models/Fabric.js';
import Tailor from '../models/Tailor.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Fabric.deleteMany({});
    await Tailor.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'John Customer',
        email: 'customer@threadline.com',
        password: 'password123',
        role: 'customer',
        phone: '919876543210',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001'
        }
      },
      {
        name: 'Royal Fabrics Owner',
        email: 'shop@threadline.com',
        password: 'password123',
        role: 'shop',
        phone: '919876543211',
        address: {
          street: '456 Business District',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400002'
        }
      },
      {
        name: 'Silk Paradise Owner',
        email: 'silk@threadline.com',
        password: 'password123',
        role: 'shop',
        phone: '919876543212',
        address: {
          street: '789 Trade Center',
          city: 'Delhi',
          state: 'Delhi',
          zipCode: '110001'
        }
      },
      {
        name: 'Master Tailor Rajesh',
        email: 'tailor@threadline.com',
        password: 'password123',
        role: 'tailor',
        phone: '919876543213',
        address: {
          street: '321 Craft Lane',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400003'
        }
      }
    ]);
    console.log('✅ Created users');

    // Create shops
    const shops = await Shop.create([
      {
        owner: users[1]._id,
        name: 'Royal Fabrics',
        description: 'Premium fabrics for all occasions with over 15 years of experience in the textile industry',
        email: 'contact@royalfabrics.com',
        phone: '919876543210',
        address: '123 Fashion Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        image: 'https://images.pexels.com/photos/6069112/pexels-photo-6069112.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.8,
        totalReviews: 156,
        established: new Date('2010-01-01')
      },
      {
        owner: users[2]._id,
        name: 'Silk Paradise',
        description: 'Authentic silk fabrics from across India, specializing in traditional and contemporary designs',
        email: 'info@silkparadise.com',
        phone: '919876543211',
        address: '456 Chandni Chowk',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        image: 'https://images.pexels.com/photos/6069113/pexels-photo-6069113.jpeg?auto=compress&cs=tinysrgb&w=800',
        rating: 4.6,
        totalReviews: 89,
        established: new Date('2008-01-01')
      }
    ]);
    console.log('✅ Created shops');

    // Create fabrics
    const fabrics = await Fabric.create([
      {
        shop: shops[0]._id,
        name: 'Premium Silk Saree Fabric',
        description: 'Luxurious silk fabric perfect for sarees with intricate golden patterns and smooth texture',
        price: 2500,
        stock: 15,
        category: 'Silk',
        color: 'Royal Blue',
        material: 'Pure Silk',
        width: '44 inches',
        image: 'https://images.pexels.com/photos/6069115/pexels-photo-6069115.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/6069115/pexels-photo-6069115.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/6069131/pexels-photo-6069131.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: {
          weight: '120 GSM',
          weave: 'Plain Weave',
          care: 'Dry Clean Only',
          origin: 'Varanasi, India',
          thread_count: '200 TC'
        },
        ratings: 4.7,
        totalPurchases: 156,
        likes: 89,
        reviews: [
          {
            user: users[0]._id,
            customerName: 'John Customer',
            rating: 5,
            comment: 'Beautiful silk quality! The color is vibrant and the texture is smooth. Perfect for my saree.',
            date: new Date('2024-01-18')
          }
        ]
      },
      {
        shop: shops[0]._id,
        name: 'Cotton Kurta Fabric',
        description: 'Soft cotton fabric ideal for kurtas and casual wear with excellent breathability',
        price: 800,
        stock: 25,
        category: 'Cotton',
        color: 'White',
        material: '100% Cotton',
        width: '42 inches',
        image: 'https://images.pexels.com/photos/6069116/pexels-photo-6069116.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/6069116/pexels-photo-6069116.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: {
          weight: '140 GSM',
          weave: 'Twill Weave',
          care: 'Machine Wash',
          origin: 'Gujarat, India',
          thread_count: '180 TC'
        },
        ratings: 4.5,
        totalPurchases: 203,
        likes: 67
      },
      {
        shop: shops[1]._id,
        name: 'Banarasi Silk',
        description: 'Traditional Banarasi silk with intricate patterns and golden work, perfect for special occasions',
        price: 3500,
        stock: 8,
        category: 'Silk',
        color: 'Golden',
        material: 'Banarasi Silk',
        width: '44 inches',
        image: 'https://images.pexels.com/photos/6069117/pexels-photo-6069117.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/6069117/pexels-photo-6069117.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/6069135/pexels-photo-6069135.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: {
          weight: '200 GSM',
          weave: 'Jacquard Weave',
          care: 'Dry Clean Only',
          origin: 'Varanasi, India',
          thread_count: '300 TC'
        },
        ratings: 4.9,
        totalPurchases: 89,
        likes: 134
      },
      {
        shop: shops[1]._id,
        name: 'Organic Cotton',
        description: 'Eco-friendly organic cotton fabric perfect for sustainable fashion and comfortable wear',
        price: 600,
        stock: 30,
        category: 'Cotton',
        color: 'Natural',
        material: 'Organic Cotton',
        width: '40 inches',
        image: 'https://images.pexels.com/photos/6069118/pexels-photo-6069118.jpeg?auto=compress&cs=tinysrgb&w=800',
        images: [
          'https://images.pexels.com/photos/6069118/pexels-photo-6069118.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        specifications: {
          weight: '160 GSM',
          weave: 'Plain Weave',
          care: 'Machine Wash',
          origin: 'Madhya Pradesh, India',
          thread_count: '150 TC'
        },
        ratings: 4.3,
        totalPurchases: 178,
        likes: 45
      }
    ]);
    console.log('✅ Created fabrics');

    // Create tailors
    const tailors = await Tailor.create([
      {
        owner: users[3]._id,
        name: 'Master Tailor Rajesh',
        bio: 'Master tailor with 15 years of experience in premium stitching and traditional Indian wear',
        email: 'rajesh@tailoring.com',
        phone: '919876543220',
        city: 'Mumbai',
        specialization: ['Suits', 'Shirts', 'Traditional Wear'],
        experience: 15,
        priceRange: '₹500 - ₹2000',
        image: 'https://images.pexels.com/photos/6069119/pexels-photo-6069119.jpeg?auto=compress&cs=tinysrgb&w=800',
        portfolio: [
          'https://images.pexels.com/photos/6069120/pexels-photo-6069120.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/6069121/pexels-photo-6069121.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/6069122/pexels-photo-6069122.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        rating: 4.9,
        totalReviews: 89,
        completedProjects: 89,
        responseTime: '2 hours',
        reviews: [
          {
            user: users[0]._id,
            customerName: 'John Customer',
            rating: 5,
            comment: 'Excellent work on my wedding suit. The stitching quality is outstanding and the fit is perfect. Highly recommended!',
            date: new Date('2024-01-15')
          }
        ]
      }
    ]);
    console.log('✅ Created tailors');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Seeded Data Summary:
👥 Users: ${users.length}
🏪 Shops: ${shops.length}
🧵 Fabrics: ${fabrics.length}
✂️ Tailors: ${tailors.length}

🔐 Test Credentials:
Customer: customer@threadline.com / password123
Shop Owner: shop@threadline.com / password123
Tailor: tailor@threadline.com / password123
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
