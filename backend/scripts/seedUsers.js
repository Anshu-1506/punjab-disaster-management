import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing users
    console.log('🗑️ Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    // Create default users - USING CORRECT ROLES FROM User.js
    const users = [
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@gov.punjab.in',
        password: 'Punjab@2024',
        role: 'admin', // Changed to 'admin' (allowed values: 'user', 'admin', 'moderator')
        department: 'Punjab State Disaster Management Authority',
        phone: '+91-9876543210',
        isActive: true
      },
      {
        name: 'Ms. Priya Singh',
        email: 'priya.singh@edu.punjab.gov.in',
        password: 'Edu@Punjab2024',
        role: 'admin', // Changed to 'admin'
        department: 'Department of School Education',
        phone: '+91-9876543211',
        isActive: true
      },
      {
        name: 'Mr. Hardeep Singh',
        email: 'hardeep.singh@admin.punjab.gov.in',
        password: 'Admin@Punjab24',
        role: 'admin', // Changed to 'admin'
        department: 'IT Department',
        phone: '+91-9876543212',
        isActive: true
      }
    ];

    console.log('👥 Creating default users...');
    for (const userData of users) {
      await User.create(userData);
      console.log(`✅ Created user: ${userData.name} (Role: ${userData.role})`);
    }

    console.log('🎉 User seeding completed successfully!');
    console.log('You can now login with these credentials:');
    console.log('1. Email: rajesh.kumar@gov.punjab.in | Password: Punjab@2024 | Role: admin');
    console.log('2. Email: priya.singh@edu.punjab.gov.in | Password: Edu@Punjab2024 | Role: admin');
    console.log('3. Email: hardeep.singh@admin.punjab.gov.in | Password: Admin@Punjab24 | Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();