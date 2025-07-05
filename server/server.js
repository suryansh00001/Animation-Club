import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './configs/db.js';
import connectCloudinary from './configs/cloudinary.js';
import 'dotenv/config';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import adminEventRoutes from './routes/adminEventRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import artworkRoutes from './routes/artworkRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

// Import middlewares
import { apiRateLimit } from './middlewares/rateLimitMiddleware.js';
import { sanitizeInput } from './middlewares/validationMiddleware.js';

const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary before starting server
await connectDB();
await connectCloudinary();

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173'];

// Security and utility middleware
app.use(apiRateLimit);
app.use(sanitizeInput);

// Middleware configuration 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get('/', (req, res) => res.send("API is working"));

// API v1 routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/admin/events', adminEventRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/achievements', achievementRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/artworks', artworkRoutes);
app.use('/api/v1/settings', settingsRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`🚀 API v1 available at http://localhost:${port}/api/v1`);
});