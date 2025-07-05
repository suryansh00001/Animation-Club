import express from 'express';
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshToken
} from '../controllers/authController.js';

// Import middlewares
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authRateLimit, bruteForceProtection } from '../middlewares/rateLimitMiddleware.js';
import {
    validateRegistration,
    validateLogin
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Public authentication routes with rate limiting and brute force protection
router.post('/register', 
    authRateLimit,
    bruteForceProtection(),
    validateRegistration,
    registerUser
);

router.post('/login', 
    authRateLimit,
    bruteForceProtection(),
    validateLogin,
    loginUser
);

router.post('/logout', logoutUser);

router.post('/refresh-token', refreshToken);

// Protected routes (require authentication)
router.get('/me', authenticateToken, getCurrentUser);

export default router;
