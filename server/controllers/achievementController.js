import Achievement from '../models/Achievement.js';

// Public endpoints
export const getAchievements = async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;
        
        const query = { status: 'active' };
        if (category) query.category = category;

        const achievements = await Achievement.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Achievement.countDocuments(query);

        res.status(200).json({
            success: true,
            achievements,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get achievements',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const getAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        
        const achievement = await Achievement.findOne({ _id: id, status: 'active' });
        
        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: 'Achievement not found'
            });
        }

        res.status(200).json({
            success: true,
            achievement
        });
    } catch (error) {
        console.error('Get achievement error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get achievement',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Admin endpoints
export const createAchievement = async (req, res) => {
    try {
        const achievementData = req.body;
        
        const achievement = new Achievement(achievementData);
        await achievement.save();

        res.status(201).json({
            success: true,
            message: 'Achievement created successfully',
            achievement
        });
    } catch (error) {
        console.error('Create achievement error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create achievement',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const updateAchievement = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const achievement = await Achievement.findByIdAndUpdate(
            id,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: 'Achievement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Achievement updated successfully',
            achievement
        });
    } catch (error) {
        console.error('Update achievement error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update achievement',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const deleteAchievement = async (req, res) => {
    try {
        const { id } = req.params;

        const achievement = await Achievement.findByIdAndDelete(id);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                message: 'Achievement not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Achievement deleted successfully'
        });
    } catch (error) {
        console.error('Delete achievement error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete achievement',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};