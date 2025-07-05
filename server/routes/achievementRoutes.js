import express from 'express';
import { authenticateToken, requireUser } from '../middlewares/authMiddleware.js';
import { apiRateLimit } from '../middlewares/rateLimitMiddleware.js';

// Import achievement controllers
import {
    getAchievements,
    getAchievement
} from '../controllers/achievementController.js';

const router = express.Router();

// ============================================================================
// PUBLIC ACHIEVEMENT ROUTES (No Authentication Required)
// ============================================================================

// Get all achievements with filters
router.get('/', apiRateLimit, getAchievements);

// Get single achievement
router.get('/:id', apiRateLimit, getAchievement);

// Get achievements by category
router.get('/category/:category', apiRateLimit, (req, res, next) => {
    req.query.category = req.params.category;
    next();
}, getAchievements);

export default router;
