import Member from "../models/Member.js";


// Get public members for user pages
const getMembers = async (req, res) => {
    try {
        // Simplified: just get all members and let frontend handle filtering
        const members = await Member.find({})
            .sort({ status: 1, 'currentPosition.role': 1, name: 1 });

        res.status(200).json({
            success: true,
            members
        });

    } catch (error) {
        console.error('Get public members error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get members',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};