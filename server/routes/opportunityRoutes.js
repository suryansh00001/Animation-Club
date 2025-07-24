import express from 'express';
import { apiRateLimit } from '../middlewares/rateLimitMiddleware.js';
import { getAllOpportunities } from '../controllers/opportunityController.js';

// Import artwork controllers


const router = express.Router();


// Get all artworks with filters
router.get('/', apiRateLimit, getAllOpportunities);

export default router;
