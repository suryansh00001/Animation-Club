import express from 'express';
import {
    getSettings,
    updateSettings
} from '../controllers/settingsController.js';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getSettings);

// Protected admin routes
router.put('/', authenticateToken, requireAdmin, updateSettings);

export default router;
