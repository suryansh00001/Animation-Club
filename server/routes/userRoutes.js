import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
    getUserActivity,
    getUserRegistrations,
    getUserSubmissions,
    getUserAchievements,
    getUserDashboard,
    getUserStats,
    getUserUpcomingEvents,
    getUserPastEvents
} from '../controllers/userController.js';


import { getPublicMembers } from '../controllers/adminController.js';

// Import middlewares
import { authenticateToken, requireUser } from '../middlewares/authMiddleware.js';
import { apiRateLimit } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/members', getPublicMembers);

// All other routes require authentication
router.use(authenticateToken);
router.use(requireUser);

// User Profile Management
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/profile', deleteUserProfile);

// User Activity and Stats
router.get('/activity', getUserActivity);
router.get('/dashboard', getUserDashboard);
router.get('/stats', getUserStats);

// User Registrations & Submissions
router.get('/registrations', getUserRegistrations);
router.get('/submissions', getUserSubmissions);
router.get('/achievements', getUserAchievements);

// User Events
router.get('/events/upcoming', getUserUpcomingEvents);
router.get('/events/past', getUserPastEvents);

export default router;
