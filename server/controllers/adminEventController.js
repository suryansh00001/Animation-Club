import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Submission from '../models/Submission.js';

// ============================================================================
// ADMIN EVENT MANAGEMENT ENDPOINTS (Admin Authentication Required)
// ============================================================================

// Get all events (admin view)
const getAdminEvents = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            type,
            search,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { organizer: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await Event.countDocuments(query);

        // Get additional stats for each event
        const eventsWithStats = await Promise.all(
            events.map(async (event) => {
                const registrationCount = await Registration.countDocuments({ eventId: event._id });
                const submissionCount = await Submission.countDocuments({ eventId: event._id });
                
                return {
                    ...event.toObject(),
                    stats: {
                        registrations: registrationCount,
                        submissions: submissionCount
                    }
                };
            })
        );

        res.status(200).json({
            success: true,
            events: eventsWithStats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get admin events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Create new event
const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        
        // Remove createdBy field as it doesn't exist in Event schema
        // eventData.createdBy = req.user?._id;
        
        // Validate required fields
        const requiredFields = ['title', 'description', 'date', 'location', 'type', 'organizer'];
        const missingFields = requiredFields.filter(field => !eventData[field]);
        
        // Add registrationDeadline to required fields only if registration is required
        if (eventData.registrationRequired && !eventData.registrationDeadline) {
            missingFields.push('registrationDeadline');
        }
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Validate dates
        if (new Date(eventData.date) <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Event date must be in the future'
            });
        }

        // Only validate registration deadline if registration is required
        if (eventData.registrationRequired && eventData.registrationDeadline && new Date(eventData.registrationDeadline) >= new Date(eventData.date)) {
            return res.status(400).json({
                success: false,
                message: 'Registration deadline must be before event date'
            });
        }

        const event = new Event(eventData);
        await event.save();

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        });

    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove fields that shouldn't be updated
        delete updateData._id;
        delete updateData.createdBy;
        delete updateData.createdAt;

        const event = await Event.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event
        });

    } catch (error) {
        console.error('Update event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        
        await Event.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });

    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get event registrations (admin)
const getEventRegistrations = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, status, search } = req.query;

        // Build query
        const query = { eventId: id };
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { 'participantDetails.name': { $regex: search, $options: 'i' } },
                { 'participantDetails.email': { $regex: search, $options: 'i' } },
                { 'participantDetails.studentId': { $regex: search, $options: 'i' } }
            ];
        }

        const registrations = await Registration.find(query)
            .populate('userId', 'name email studentId')
            .populate('eventId', 'title date')
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
        console.error('Get event registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event registrations',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get event submissions (admin)
const getEventSubmissions = async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1, limit = 20, status, search } = req.query;

        // Build query
        const query = { eventId: id };
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { 'participantInfo.name': { $regex: search, $options: 'i' } },
                { 'participantInfo.email': { $regex: search, $options: 'i' } },
                { 'participantInfo.studentId': { $regex: search, $options: 'i' } },
                { 'submissionDetails.title': { $regex: search, $options: 'i' } }
            ];
        }

        const submissions = await Submission.find(query)
            .populate('userId', 'name email studentId')
            .populate('eventId', 'title date')
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
        console.error('Get event submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event submissions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update event status
const updateEventStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const event = await Event.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event status updated successfully',
            event
        });

    } catch (error) {
        console.error('Update event status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Toggle event featured status
const toggleEventFeatured = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        event.featured = !event.featured;
        await event.save();

        res.status(200).json({
            success: true,
            message: `Event ${event.featured ? 'featured' : 'unfeatured'} successfully`,
            event
        });

    } catch (error) {
        console.error('Toggle event featured error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update event featured status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get event analytics
const getEventAnalytics = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get registration stats
        const registrationStats = await Registration.aggregate([
            { $match: { eventId: event._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get submission stats
        const submissionStats = await Submission.aggregate([
            { $match: { eventId: event._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get registration timeline
        const registrationTimeline = await Registration.aggregate([
            { $match: { eventId: event._id } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                event: {
                    title: event.title,
                    date: event.date,
                    maxParticipants: event.maxParticipants
                },
                registrations: {
                    stats: registrationStats,
                    timeline: registrationTimeline,
                    total: await Registration.countDocuments({ eventId: id })
                },
                submissions: {
                    stats: submissionStats,
                    total: await Submission.countDocuments({ eventId: id })
                }
            }
        });

    } catch (error) {
        console.error('Get event analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event analytics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Export all functions
export {
    getAdminEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventRegistrations,
    getEventSubmissions,
    updateEventStatus,
    toggleEventFeatured,
    getEventAnalytics
};
