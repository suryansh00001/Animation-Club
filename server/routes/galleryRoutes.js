import express from 'express';
import { authenticateToken, requireUser } from '../middlewares/authMiddleware.js';
import { apiRateLimit } from '../middlewares/rateLimitMiddleware.js';

// Import gallery controllers
import {
    getGalleryImages,
    getGalleryImage
} from '../controllers/galleryController.js';

const router = express.Router();

// ============================================================================
// PUBLIC GALLERY ROUTES (No Authentication Required)
// ============================================================================

// Get all gallery images with filters
router.get('/', apiRateLimit, getGalleryImages);

// Get single gallery image
router.get('/:id', apiRateLimit, getGalleryImage);

export default router;
