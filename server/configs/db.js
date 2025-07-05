import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
    try {
        // Set mongoose options for better connection handling
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            maxPoolSize: 10, // Maintain up to 10 socket connections
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4 // Use IPv4, skip trying IPv6
        };

        // Connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('✅ Database connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Database connection error:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Database disconnected');
        });

        // Connect to MongoDB
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/animationclub`, options);
        
        console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
        console.log(`📊 Database Name: ${conn.connection.name}`);
        
    } catch (error) {
        console.error("💥 Database connection failed:", error.message);
        console.error("🔍 Please check your MONGODB_URI in .env file");
        process.exit(1);
    }
};

export default connectDB;
