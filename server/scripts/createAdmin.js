import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../configs/db.js';
import 'dotenv/config';

const createAdminUser = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            email: process.env.ADMIN_EMAIL 
        });

        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(
            process.env.ADMIN_PASSWORD ,
            saltRounds
        );

        // Create admin user
        const adminUser = new User({
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL || 'admin@animationclub.edu',
            password: hashedPassword,
            phone: '+1234567890',
            studentId: 'ADMIN001',
            year: 'Graduate',
            department: 'Computer Science',
            institution: 'University',
            experience: 'Professional',
            role: 'admin',
            isActive: true,
            profile: {
                bio: 'System Administrator',
                interests: ['Animation', 'Web Development', 'Education']
            }
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully');
        console.log('Email:', adminUser.email);
        console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123');
        console.log('Role:', adminUser.role);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdminUser();
