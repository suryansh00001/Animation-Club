import Opportunity from '../models/Opportunity.js';

// Public endpoints


export const getAllOpportunities = async (req, res) => {
    try {
        const opportunities = await Opportunity.find({});
        res.status(200).json({
            success: true,
            opportunities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get opportunities',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

