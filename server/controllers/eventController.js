import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

// ============================================================================
// PUBLIC EVENT ENDPOINTS (No Authentication Required)
// ============================================================================

// Get all public events with filters
const getEvents = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 50, 
            type, 
            status,
            search,
            sort = '-date'
        } = req.query;

        // Build query
        const query = { isActive: true };
        
        if (type) query.type = type;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get single event details
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId format
        if (!id || id === 'null' || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid event ID format'
            });
        }

        const event = await Event.findById(id);

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        console.error('Get event by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get event details with participant count
const getEventDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Get participant count
        const participantCount = await Registration.countDocuments({ 
            eventId: id, 
            status: 'confirmed' 
        });

        res.status(200).json({
            success: true,
            event: {
                ...event.toObject(),
                currentParticipants: participantCount
            }
        });

    } catch (error) {
        console.error('Get event details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event details',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const events = await Event.find({
            isActive: true,
            status: 'upcoming',
            date: { $gte: new Date() }
        })
        .sort({ date: 1 })
        .limit(parseInt(limit))
        .select('-__v');

        res.status(200).json({
            success: true,
            events
        });

    } catch (error) {
        console.error('Get upcoming events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get upcoming events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get past events
const getPastEvents = async (req, res) => {
    try {
        const { limit = 10, page = 1 } = req.query;

        const events = await Event.find({
            isActive: true,
            status: 'completed',
            date: { $lt: new Date() }
        })
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .select('-__v');

        const total = await Event.countDocuments({
            isActive: true,
            status: 'completed',
            date: { $lt: new Date() }
        });

        res.status(200).json({
            success: true,
            events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get past events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get past events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get event types
const getEventTypes = async (req, res) => {
    try {
        const types = await Event.distinct('type', { isActive: true });

        res.status(200).json({
            success: true,
            types
        });

    } catch (error) {
        console.error('Get event types error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event types',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get event participants count (public)
const getEventParticipants = async (req, res) => {
    try {
        const { id } = req.params;

        const participantCount = await Registration.countDocuments({ 
            eventId: id, 
            status: 'confirmed' 
        });

        res.status(200).json({
            success: true,
            participantCount
        });

    } catch (error) {
        console.error('Get event participants error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event participants',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get event gallery
const getEventGallery = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).select('gallery title');

        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            gallery: event.gallery || [],
            title: event.title
        });

    } catch (error) {
        console.error('Get event gallery error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get event gallery',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Search events
const searchEvents = async (req, res) => {
    try {
        const { 
            q, 
            type, 
            status,
            page = 1, 
            limit = 10 
        } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const query = {
            isActive: true,
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        };

        if (type) query.type = type;
        if (status) query.status = status;

        const events = await Event.find(query)
            .sort({ date: 1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .select('-__v');

        const total = await Event.countDocuments(query);

        res.status(200).json({
            success: true,
            events,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Search events error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search events',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// ============================================================================
// USER EVENT ENDPOINTS (Authentication Required)
// ============================================================================

// Register for an event
const registerForEvent = async (req, res) => {
    try {
        console.log('🔵 Registration attempt started');
        console.log('Full request URL:', req.originalUrl);
        console.log('Request params:', req.params);
        console.log('Raw ID from params:', req.params.id);
        console.log('Event ID:', req.params.id);
        console.log('User ID:', req.user?._id);
        console.log('User details:', {
            name: req.user?.name,
            email: req.user?.email,
            phone: req.user?.phone
        });
        console.log('Registration data:', req.body);

        const { id } = req.params;
        const userId = req.user._id;
        const registrationData = req.body;

        // Check if user exists and has required data
        if (!req.user || !req.user._id) {
            console.log('❌ User not authenticated or missing user data');
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        // Validate required user fields for registration
        const requiredFields = ['name', 'email'];
        const missingFields = requiredFields.filter(field => !req.user[field]);
        
        if (missingFields.length > 0) {
            console.log('❌ User missing required fields:', missingFields);
            return res.status(400).json({
                success: false,
                message: `Please complete your profile. Missing: ${missingFields.join(', ')}`,
                missingFields
            });
        }

        // Validate ObjectId format
        console.log('🔍 Validating event ID:', { id, type: typeof id, length: id?.length });
        
        // Trim any whitespace and decode if necessary
        const cleanId = id?.toString().trim();
        console.log('🔍 Cleaned ID:', { cleanId, original: id, areEqual: cleanId === id });
        
        if (!mongoose.Types.ObjectId.isValid(cleanId)) {
            console.log('❌ Invalid event ID format:', cleanId);
            console.log('❌ ID details:', {
                id: cleanId,
                original: id,
                type: typeof cleanId,
                length: cleanId?.length,
                isString: typeof cleanId === 'string',
                hasCorrectLength: cleanId?.length === 24,
                chars: cleanId?.split('').map((c, i) => `${i}: ${c} (${c.charCodeAt(0)})`)
            });
            return res.status(400).json({
                success: false,
                message: `Invalid event ID format: ${cleanId}`
            });
        }
        
        // Use the cleaned ID for further processing
        const eventId = cleanId;

        // Check if event exists
        console.log('🔍 Checking if event exists...');
        const event = await Event.findById(eventId);
        if (!event || !event.isActive) {
            console.log('❌ Event not found or inactive:', { eventFound: !!event, isActive: event?.isActive });
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        console.log('✅ Event found:', event.title);

        // Check if registration deadline has passed (only if registration is required and deadline exists)
        if (event.registrationRequired && event.registrationDeadline && new Date() > event.registrationDeadline) {
            console.log('❌ Registration deadline passed');
            return res.status(400).json({
                success: false,
                message: 'Registration deadline has passed'
            });
        }

        // Check if user is already registered
        console.log('🔍 Checking for existing registration...');
        const existingRegistration = await Registration.findOne({
            eventId: new mongoose.Types.ObjectId(eventId),
            userId: new mongoose.Types.ObjectId(userId)
        });

        if (existingRegistration) {
            console.log('❌ User already registered');
            return res.status(400).json({
                success: false,
                message: 'You are already registered for this event'
            });
        }

        // Check if event is full
        console.log('🔍 Checking event capacity...');
        const currentParticipants = await Registration.countDocuments({
            eventId: new mongoose.Types.ObjectId(eventId),
            status: 'confirmed'
        });

        console.log(`📊 Current participants: ${currentParticipants}/${event.maxParticipants}`);

        if (currentParticipants >= event.maxParticipants) {
            console.log('❌ Event is full');
            return res.status(400).json({
                success: false,
                message: 'Event is full'
            });
        }

        // Create registration
        console.log('💾 Creating registration...');
        console.log('User data:', {
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            department: req.user.department,
            year: req.user.year,
            studentId: req.user.studentId
        });
        
        // Process team members if provided
        let processedTeamMembers = [];
        if (registrationData.teamMembers && typeof registrationData.teamMembers === 'string') {
            // If teamMembers is a string, split it into individual members
            const teamMembersText = registrationData.teamMembers.trim();
            if (teamMembersText) {
                processedTeamMembers = teamMembersText.split('\n').map(member => ({
                    name: member.trim(),
                    email: '', // Not provided in current form
                    studentId: '' // Not provided in current form
                })).filter(member => member.name); // Remove empty entries
            }
        } else if (Array.isArray(registrationData.teamMembers)) {
            processedTeamMembers = registrationData.teamMembers;
        }
        
        try {
            const registration = new Registration({
                eventId: new mongoose.Types.ObjectId(eventId),
                userId: new mongoose.Types.ObjectId(userId),
                participantDetails: {
                    name: req.user.name || 'Unknown User',
                    email: req.user.email || 'unknown@email.com',
                    phone: req.user.phone || 'N/A',
                    department: req.user.department || 'N/A',
                    year: req.user.year || 'N/A',
                    studentId: req.user.studentId || 'N/A'
                },
                registrationData: {
                    expectations: registrationData.expectations || '',
                    previousExperience: registrationData.experience || '', // Map 'experience' to 'previousExperience'
                    teamMembers: processedTeamMembers,
                    motivation: registrationData.motivation || '',
                    specialRequirements: registrationData.specialRequirements || '',
                    dietaryRestrictions: registrationData.dietaryRestrictions || ''
                },
                status: 'confirmed'
            });

            console.log('🚀 Saving registration to database...');
            console.log('Registration object:', JSON.stringify(registration.toObject(), null, 2));
            
            const savedRegistration = await registration.save();
            console.log('✅ Registration saved with ID:', savedRegistration._id);

            console.log('📈 Updating event registration count...');
            // Update event participant count
            const updatedEvent = await Event.findByIdAndUpdate(new mongoose.Types.ObjectId(eventId), {
                $inc: { registrationCount: 1 }
            }, { new: true });
            
            console.log('Updated event registration count:', updatedEvent.registrationCount);

            console.log('✅ Registration successful!');
            res.status(201).json({
                success: true,
                message: 'Successfully registered for event',
                registration: savedRegistration
            });

        } catch (validationError) {
            console.error('🔴 Registration validation error:', validationError);
            
            if (validationError.name === 'ValidationError') {
                const validationMessages = Object.values(validationError.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: 'Registration validation failed',
                    errors: validationMessages
                });
            }
            
            throw validationError; // Re-throw if not a validation error
        }

    } catch (error) {
        console.error('🔴 Register for event error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to register for event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get user's registration for an event
const getUserEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const registration = await Registration.findOne({
            eventId: id,
            userId
        }).populate('eventId', 'title date location');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            registration
        });

    } catch (error) {
        console.error('Get user event registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update user's registration for an event
const updateEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        const registration = await Registration.findOneAndUpdate(
            { eventId: id, userId },
            { $set: { registrationData: updateData } },
            { new: true }
        ).populate('eventId', 'title date location');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Registration updated successfully',
            registration
        });

    } catch (error) {
        console.error('Update event registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Cancel registration for an event
const cancelEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const registration = await Registration.findOneAndDelete({
            eventId: id,
            userId
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        // Update event participant count
        await Event.findByIdAndUpdate(id, {
            $inc: { registrationCount: -1 }
        });

        res.status(200).json({
            success: true,
            message: 'Registration cancelled successfully'
        });

    } catch (error) {
        console.error('Cancel event registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Check if user is registered for an event
const checkEventRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const registration = await Registration.findOne({
            eventId: id,
            userId
        });

        res.status(200).json({
            success: true,
            isRegistered: !!registration,
            registration: registration || null
        });

    } catch (error) {
        console.error('Check event registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check registration',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get registration status
const getRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const registration = await Registration.findOne({
            eventId: id,
            userId
        });

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            status: registration.status,
            registrationDate: registration.createdAt
        });

    } catch (error) {
        console.error('Get registration status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get registration status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Import submission controller functions
import { 
    submitToEvent as submitToEventController,
    getUserEventSubmission as getUserEventSubmissionController
} from './submissionController.js';

// Submit work to an event (delegated to submission controller)
const submitToEvent = submitToEventController;

// Get user's submission for an event (delegated to submission controller)
const getUserEventSubmission = getUserEventSubmissionController;

// Export all functions
export {
    // Public endpoints
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
};
