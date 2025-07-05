import express from 'express';
import { authenticateToken, requireUser } from '../middlewares/authMiddleware.js';
import { apiRateLimit } from '../middlewares/rateLimitMiddleware.js';

// Import artwork controllers
import {
    getArtworks,
    getArtwork,
    createArtwork
} from '../controllers/artworkController.js';

const router = express.Router();

// ============================================================================
// PUBLIC ARTWORK ROUTES (No Authentication Required)
// ============================================================================

// Get all artworks with filters
router.get('/', apiRateLimit, getArtworks);

// Get single artwork
router.get('/:id', apiRateLimit, getArtwork);

// Get artworks by category
router.get('/category/:category', apiRateLimit, (req, res, next) => {
    req.query.category = req.params.category;
    next();
}, getArtworks);

// ============================================================================
// USER ARTWORK ROUTES (Authentication Required)
// ============================================================================

// All user routes require authentication
router.use(authenticateToken);
router.use(requireUser);

// User artwork submission only
router.post('/submit', apiRateLimit, createArtwork);

export default router;
