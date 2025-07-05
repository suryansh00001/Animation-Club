import { v2 as cloudinary } from 'cloudinary';
import 'dotenv/config';

const connectCloudinary = async () => {
    try {
        // Configure Cloudinary with environment variables
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true, // Force HTTPS URLs
        });

        // Test the connection
        const result = await cloudinary.api.ping();
        
        if (result.status === 'ok') {
            console.log('✅ Cloudinary connected successfully');
            console.log(`🌤️ Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
        } else {
            throw new Error('Cloudinary ping failed');
        }

    } catch (error) {
        console.error('❌ Cloudinary connection failed:', error.message);
        console.error('🔍 Please check your Cloudinary credentials in .env file');
        
        // Don't exit process for Cloudinary failure, as it's not critical for basic server operation
        console.warn('⚠️ Server will continue without Cloudinary functionality');
    }
};

// Helper function to upload image to Cloudinary
export const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const defaultOptions = {
            resource_type: 'auto',
            folder: 'animation-club',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto:good' },
                { format: 'auto' }
            ]
        };

        const uploadOptions = { ...defaultOptions, ...options };
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);
        
        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            size: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Helper function to delete image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return {
            success: result.result === 'ok',
            result: result.result
        };
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Helper function to upload video to Cloudinary
export const uploadVideoToCloudinary = async (filePath, options = {}) => {
    try {
        const defaultOptions = {
            resource_type: 'video',
            folder: 'animation-club/videos',
            transformation: [
                { width: 1280, height: 720, crop: 'limit' },
                { quality: 'auto:good' }
            ]
        };

        const uploadOptions = { ...defaultOptions, ...options };
        const result = await cloudinary.uploader.upload(filePath, uploadOptions);
        
        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            duration: result.duration,
            size: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary video upload error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Helper function to generate optimized image URLs
export const getOptimizedImageUrl = (publicId, options = {}) => {
    try {
        const defaultOptions = {
            width: 400,
            height: 400,
            crop: 'fill',
            quality: 'auto:good',
            format: 'auto'
        };

        const transformOptions = { ...defaultOptions, ...options };
        return cloudinary.url(publicId, transformOptions);
    } catch (error) {
        console.error('Error generating optimized URL:', error);
        return null;
    }
};

// Helper function to get thumbnail for videos
export const getVideoThumbnail = (publicId, options = {}) => {
    try {
        const defaultOptions = {
            resource_type: 'video',
            width: 400,
            height: 300,
            crop: 'fill',
            quality: 'auto:good',
            format: 'jpg'
        };

        const transformOptions = { ...defaultOptions, ...options };
        return cloudinary.url(publicId, transformOptions);
    } catch (error) {
        console.error('Error generating video thumbnail:', error);
        return null;
    }
};

// Export the main connection function as default
export default connectCloudinary;
