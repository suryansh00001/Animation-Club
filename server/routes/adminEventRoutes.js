import express from 'express';

// Import admin event controllers
import {
    getAdminEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventRegistrations,
    getEventSubmissions,
    updateEventStatus,
    toggleEventFeatured,
    uploadEventImage,
    getEventAnalytics
} from '../controllers/adminEventController.js';

// Import middlewares
import { authenticateToken, requireAdminOrManager } from '../middlewares/authMiddleware.js';
import { apiRateLimit, uploadRateLimit } from '../middlewares/rateLimitMiddleware.js';
import { uploadImage } from '../configs/multer.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdminOrManager);

// ============================================================================
// ADMIN EVENT MANAGEMENT ROUTES
// ============================================================================

// Get all events (admin view)
router.get('/', apiRateLimit, getAdminEvents);

// Create new event
router.post('/', apiRateLimit, createEvent);

// Update event
router.post('/:id', apiRateLimit, updateEvent);

// Delete event (soft delete)
router.delete('/:id', apiRateLimit, deleteEvent);

// Get event registrations
router.get('/:id/registrations', apiRateLimit, getEventRegistrations);

// Get event submissions
router.get('/:id/submissions', apiRateLimit, getEventSubmissions);

// Update event status
router.put('/:id/status', apiRateLimit, updateEventStatus);

// Toggle event featured status
router.put('/:id/featured', apiRateLimit, toggleEventFeatured);

// Upload event image
router.post('/:id/upload-image', uploadRateLimit, uploadImage, uploadEventImage);

// Get event analytics
router.get('/:id/analytics', apiRateLimit, getEventAnalytics);

export default router;
