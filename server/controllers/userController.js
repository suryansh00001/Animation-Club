import User from '../models/User.js';
import Registration from '../models/Registration.js';
import Submission from '../models/Submission.js';

// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updateData = req.body;

        console.log('Update request for user:', userId);
        console.log('Update data received:', updateData);

        // Remove sensitive fields that shouldn't be updated through this endpoint
        delete updateData.password;
        delete updateData.email;
        delete updateData.role;
        delete updateData._id;

        // Only update fields that are provided
        const allowedFields = ['name', 'phone', 'department', 'institution', 'experience', 'avatar'];
        const filteredUpdateData = {};
        
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined && updateData[field] !== null) {
                // Allow empty string for avatar to clear it
                if (field === 'avatar' || updateData[field] !== '') {
                    filteredUpdateData[field] = updateData[field];
                }
            }
        });

        console.log('Filtered update data:', filteredUpdateData);

        if (Object.keys(filteredUpdateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields provided for update'
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: filteredUpdateData },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('User updated successfully:', updatedUser._id);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profile update failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete User Profile
export const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        // Delete user's registrations and submissions
        await Registration.deleteMany({ userId });
        await Submission.deleteMany({ userId });

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile deleted successfully'
        });

    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Profile deletion failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Activity
export const getUserActivity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 20 } = req.query;

        // Get recent registrations
        const recentRegistrations = await Registration.find({ userId })
            .populate('eventId', 'title date')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get recent submissions
        const recentSubmissions = await Submission.find({ userId })
            .populate('eventId', 'title date')
            .sort({ createdAt: -1 })
            .limit(5);

        // Combine and sort activities
        const activities = [
            ...recentRegistrations.map(reg => ({
                type: 'registration',
                action: 'Registered for event',
                eventTitle: reg.eventId?.title,
                date: reg.createdAt,
                status: reg.status
            })),
            ...recentSubmissions.map(sub => ({
                type: 'submission',
                action: 'Submitted work for event',
                eventTitle: sub.eventId?.title,
                date: sub.createdAt,
                status: sub.status
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            success: true,
            activities: activities.slice(0, parseInt(limit))
        });

    } catch (error) {
        console.error('Get user activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user activity',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Registrations
export const getUserRegistrations = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, page = 1, limit = 20 } = req.query;

        const query = { userId };
        if (status) {
            query.status = status;
        }

        const registrations = await Registration.find(query)
            .populate('eventId', 'title date location type status description')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Registration.countDocuments(query);

        res.status(200).json({
            success: true,
            registrations,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get user registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user registrations',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Submissions
export const getUserSubmissions = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, page = 1, limit = 20 } = req.query;

        const query = { userId };
        if (status) {
            query.status = status;
        }

        const submissions = await Submission.find(query)
            .populate('eventId', 'title date location type status description')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Submission.countDocuments(query);

        res.status(200).json({
            success: true,
            submissions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get user submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user submissions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Achievements (placeholder)
export const getUserAchievements = async (req, res) => {
    try {
        // For now, return empty achievements
        // This can be implemented when achievement system is added
        res.status(200).json({
            success: true,
            achievements: []
        });

    } catch (error) {
        console.error('Get user achievements error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user achievements',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Dashboard Summary
export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get counts
        const registrationsCount = await Registration.countDocuments({ userId });
        const submissionsCount = await Submission.countDocuments({ userId });
        const upcomingEventsCount = await Registration.countDocuments({
            userId,
            status: 'confirmed'
        });

        // Get recent activity
        const recentRegistrations = await Registration.find({ userId })
            .populate('eventId', 'title date')
            .sort({ createdAt: -1 })
            .limit(3);

        const recentSubmissions = await Submission.find({ userId })
            .populate('eventId', 'title date')
            .sort({ createdAt: -1 })
            .limit(3);

        res.status(200).json({
            success: true,
            dashboard: {
                stats: {
                    registrations: registrationsCount,
                    submissions: submissionsCount,
                    upcomingEvents: upcomingEventsCount
                },
                recentActivity: {
                    registrations: recentRegistrations,
                    submissions: recentSubmissions
                }
            }
        });

    } catch (error) {
        console.error('Get user dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user dashboard',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Stats
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = {
            totalRegistrations: await Registration.countDocuments({ userId }),
            totalSubmissions: await Submission.countDocuments({ userId }),
            confirmedRegistrations: await Registration.countDocuments({ userId, status: 'confirmed' }),
            approvedSubmissions: await Submission.countDocuments({ userId, status: 'approved' }),
            pendingSubmissions: await Submission.countDocuments({ userId, status: 'pending' })
        };

        res.status(200).json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user stats',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Upcoming Events
export const getUserUpcomingEvents = async (req, res) => {
    try {
        const userId = req.user._id;

        const upcomingRegistrations = await Registration.find({
            userId,
            status: 'confirmed'
        }).populate({
            path: 'eventId',
            match: { date: { $gte: new Date() } },
            select: 'title date location type description'
        });

        const upcomingEvents = upcomingRegistrations
            .filter(reg => reg.eventId)
            .map(reg => reg.eventId);

        res.status(200).json({
            success: true,
            events: upcomingEvents
        });

    } catch (error) {
        console.error('Get user upcoming events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get upcoming events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get User Past Events
export const getUserPastEvents = async (req, res) => {
    try {
        const userId = req.user._id;

        const pastRegistrations = await Registration.find({
            userId
        }).populate({
            path: 'eventId',
            match: { date: { $lt: new Date() } },
            select: 'title date location type description'
        });

        const pastEvents = pastRegistrations
            .filter(reg => reg.eventId)
            .map(reg => reg.eventId);

        res.status(200).json({
            success: true,
            events: pastEvents
        });

    } catch (error) {
        console.error('Get user past events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get past events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
