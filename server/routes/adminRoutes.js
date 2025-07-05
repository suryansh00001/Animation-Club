import express from 'express';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware.js';
import {
    getAdminStats,
    getAdminRegistrations,
    getAdminSubmissions,
    getAdminMembers,
    createMember,
    updateMember,
    updateMemberProfile,
    deleteMember,
    updateMemberPosition,
    getPublicMembers,
    updateRegistrationStatus,
    updateSubmissionStatus,
    updateSubmissionAward,
    getAdminDashboard,
    getSystemStatus
} from '../controllers/adminController.js';

import {
    getAllSubmissions,
    getEventSubmissions,
    updateSubmissionStatus as updateSubmissionStatusNew,
    reviewSubmission,
    deleteSubmissionById
} from '../controllers/submissionController.js';

// Import achievement controllers
import {
    getAchievements as getAllAchievements,
    createAchievement,
    updateAchievement,
    deleteAchievement
} from '../controllers/achievementController.js';

// Import gallery controllers
import {
    getAllGalleryImages,
    createGalleryImage,
    updateGalleryImage,
    deleteGalleryImage
} from '../controllers/galleryController.js';

// Import artwork controllers
import {
    getAllArtworks,
    adminCreateArtwork,
    adminUpdateArtwork,
    deleteArtwork
} from '../controllers/artworkController.js';

const router = express.Router();

// Public routes (no auth required)
router.get('/members/public', getPublicMembers);
router.get('/system/status', getSystemStatus);

// All other admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Admin dashboard and stats
router.get('/dashboard', getAdminDashboard);
router.get('/stats', getAdminStats);

// Admin data management
router.get('/registrations', getAdminRegistrations);
router.get('/submissions', getAdminSubmissions);

// Member management routes
router.get('/members', getAdminMembers);
router.post('/members', createMember);
router.put('/members/:id', updateMember);
router.patch('/members/:id/profile', updateMemberProfile);
router.delete('/members/:id', deleteMember);
router.patch('/members/:id/position', updateMemberPosition);

// Status updates
router.patch('/registrations/:id/status', updateRegistrationStatus);
router.patch('/submissions/:id/status', updateSubmissionStatus);
router.patch('/submissions/:id/award', updateSubmissionAward);

// Enhanced submission management
router.get('/submissions/all', getAllSubmissions);
router.get('/events/:eventId/submissions', getEventSubmissions);
router.patch('/submissions/:id/review', reviewSubmission);
router.patch('/submissions/:id/status-new', updateSubmissionStatusNew);
router.delete('/submissions/:id', deleteSubmissionById);

// Achievement management routes
router.get('/achievements', getAllAchievements);
router.post('/achievements', createAchievement);
router.put('/achievements/:id', updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// Gallery management routes
router.get('/gallery', getAllGalleryImages);
router.post('/gallery', createGalleryImage);
router.put('/gallery/:id', updateGalleryImage);
router.delete('/gallery/:id', deleteGalleryImage);

// Artwork management routes
router.get('/artworks', getAllArtworks);
router.post('/artworks', adminCreateArtwork);
router.put('/artworks/:id', adminUpdateArtwork);
router.delete('/artworks/:id', deleteArtwork);

export default router;
