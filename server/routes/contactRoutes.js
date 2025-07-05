import express from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import {
    submitContactForm,
    getContactSubmissions,
    markContactAsRead,
    updateContactStatus,
    deleteContactSubmission,
    getContactStats
} from '../controllers/contactController.js';

const router = express.Router();

// Public contact routes
router.post('/submit', submitContactForm);

// Admin contact routes (require admin authentication)
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/submissions', getContactSubmissions);
router.get('/stats', getContactStats);
router.patch('/:id/read', markContactAsRead);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContactSubmission);

export default router;
