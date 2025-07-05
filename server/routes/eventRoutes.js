import express from 'express';

// Import controllers
import {
    // Public endpoints
    getEvents,
    getEventById,
    getEventDetails,
    getUpcomingEvents,
    getPastEvents,
    getEventTypes,
    getEventParticipants,
    getEventGallery,
    searchEvents,
    
    // User endpoints  
    registerForEvent,
    getUserEventRegistration,
    updateEventRegistration,
    cancelEventRegistration,
    checkEventRegistration,
    getRegistrationStatus,
    submitToEvent,
    getUserEventSubmission
} from '../controllers/eventController.js';

// Import middlewares
import { authenticateToken, requireUser } from '../middlewares/authMiddleware.js';
import { apiRateLimit } from '../middlewares/rateLimitMiddleware.js';

const router = express.Router();

// ============================================================================
// PUBLIC EVENT ROUTES (No Authentication Required)
// ============================================================================

// Specific routes first (before parameterized routes)
// Get upcoming events
router.get('/upcoming', apiRateLimit, getUpcomingEvents);

// Get past events
router.get('/past', apiRateLimit, getPastEvents);

// Get event types  
router.get('/types', apiRateLimit, getEventTypes);

// Search events
router.get('/search', apiRateLimit, searchEvents);

// Get all events with filters
router.get('/', apiRateLimit, getEvents);

// Parameterized routes after specific routes
// Get single event details
router.get('/:id', apiRateLimit, getEventById);

// Get detailed event information
router.get('/:id/details', apiRateLimit, getEventDetails);

// Get event participants count
router.get('/:id/participants', apiRateLimit, getEventParticipants);

// Get event gallery
router.get('/:id/gallery', apiRateLimit, getEventGallery);

// ============================================================================
// USER EVENT ROUTES (Authentication Required)
// ============================================================================

// Event Registration Routes
router.post('/:id/register', authenticateToken, requireUser, registerForEvent);
router.get('/:id/registration', authenticateToken, requireUser, getUserEventRegistration);
router.put('/:id/registration', authenticateToken, requireUser, updateEventRegistration);
router.delete('/:id/registration', authenticateToken, requireUser, cancelEventRegistration);
router.get('/:id/registrations/check', authenticateToken, requireUser, checkEventRegistration);
router.get('/:id/registration/status', authenticateToken, requireUser, getRegistrationStatus);

// Event Submission Routes
router.post('/:id/submit', authenticateToken, requireUser, submitToEvent);
router.get('/:id/submission', authenticateToken, requireUser, getUserEventSubmission);

export default router;
