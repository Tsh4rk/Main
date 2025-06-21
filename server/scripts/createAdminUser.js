const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersec_portfolio',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.username);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@cybersec-portfolio.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin'
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@cybersec-portfolio.com');
    console.log('👤 Username: admin');
    console.log('🔐 Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the default password after first login!');
    console.log('🌐 Login at: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser();
