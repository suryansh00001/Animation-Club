import Event from '../models/Event.js';
import Submission from '../models/Submission.js';
import Registration from '../models/Registration.js';

// ============================================================================
// EVENT SUBMISSION ENDPOINTS (Authentication Required)
// ============================================================================

// Submit work for an event
const submitToEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const submissionData = req.body;

        // Check if event exists
        const event = await Event.findById(id);
        if (!event || !event.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if submission deadline has passed
        if (event.submissionDeadline && new Date() > event.submissionDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Submission deadline has passed'
            });
        }

        // Check if user is registered for the event (if registration is required)
        // For events that require only submission, auto-register the user
        if (event.registrationRequired) {
            const registration = await Registration.findOne({
                eventId: id,
                userId,
                status: 'confirmed'
            });

            if (!registration) {
                return res.status(400).json({
                    success: false,
                    message: 'You must be registered for this event to submit'
                });
            }
        } else if (event.submissionRequired && !event.registrationRequired) {
            // Auto-register user for submission-only events
            const existingRegistration = await Registration.findOne({
                eventId: id,
                userId
            });

            if (!existingRegistration) {
                // Create automatic registration with submission data
                const autoRegistration = new Registration({
                    eventId: id,
                    userId,
                    participantDetails: {
                        name: req.user.name,
                        email: req.user.email,
                        studentId: req.user.studentId || '',
                        department: req.user.department || '',
                        year: req.user.year || '',
                        experience: 'Auto-registered via submission',
                        expectations: submissionData.description || 'Participating through submission',
                        teamMembers: ''
                    },
                    status: 'confirmed',
                    registrationDate: new Date(),
                    source: 'auto-submission'
                });

                await autoRegistration.save();
                console.log('Auto-registered user for submission-only event:', autoRegistration._id);
            }
        }

        // Check if user has already submitted
        const existingSubmission = await Submission.findOne({
            eventId: id,
            userId
        });

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted for this event'
            });
        }

        // Create submission
        const submission = new Submission({
            eventId: id,
            userId,
            submissionDetails: {
                title: submissionData.title || 'Untitled Submission',
                description: submissionData.description || ''
            },
            files: {
                mainFileUrl: submissionData.mainFileUrl
            },
            participantInfo: {
                name: req.user.name,
                email: req.user.email,
                studentId: req.user.studentId || '',
                department: req.user.department || '',
                year: req.user.year || ''
            },
            status: 'submitted',
            submissionTime: new Date(),
            lastModified: new Date()
        });

        await submission.save();

        // Update event submission count
        await Event.findByIdAndUpdate(id, {
            $inc: { submissionCount: 1 }
        });

        res.status(201).json({
            success: true,
            message: 'Submission created successfully',
            submission
        });

    } catch (error) {
        console.error('Submit to event error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit to event',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get user's submission for an event
const getUserEventSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const submission = await Submission.findOne({
            eventId: id,
            userId
        }).populate('eventId', 'title date location submissionDeadline');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.status(200).json({
            success: true,
            submission
        });

    } catch (error) {
        console.error('Get user event submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get submission',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update user's submission for an event
const updateEventSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const updateData = req.body;

        // Check if submission deadline has passed
        const event = await Event.findById(id);
        if (event.submissionDeadline && new Date() > event.submissionDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Submission deadline has passed'
            });
        }

        const submission = await Submission.findOneAndUpdate(
            { eventId: id, userId },
            { 
                $set: { 
                    submissionDetails: {
                        ...updateData,
                        lastModified: new Date()
                    }
                } 
            },
            { new: true }
        ).populate('eventId', 'title date location submissionDeadline');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Submission updated successfully',
            submission
        });

    } catch (error) {
        console.error('Update event submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete user's submission for an event
const deleteEventSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Check if submission deadline has passed
        const event = await Event.findById(id);
        if (event.submissionDeadline && new Date() > event.submissionDeadline) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete submission after deadline'
            });
        }

        const submission = await Submission.findOneAndDelete({
            eventId: id,
            userId
        });

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }


        // Update event submission count
        await Event.findByIdAndUpdate(id, {
            $inc: { submissionCount: -1 }
        });

        res.status(200).json({
            success: true,
            message: 'Submission deleted successfully'
        });

    } catch (error) {
        console.error('Delete event submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete submission',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get submission status and feedback
const getSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const submission = await Submission.findOne({
            eventId: id,
            userId
        }).select('status evaluation timestamps');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.status(200).json({
            success: true,
            status: submission.status,
            evaluation: submission.evaluation,
            submittedAt: submission.timestamps.submittedAt,
            evaluatedAt: submission.timestamps.evaluatedAt
        });

    } catch (error) {
        console.error('Get submission status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get submission status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get submission files
const getSubmissionFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const submission = await Submission.findOne({
            eventId: id,
            userId
        }).select('files');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.status(200).json({
            success: true,
            files: submission.files || {}
        });

    } catch (error) {
        console.error('Get submission files error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get submission files',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// ============================================================================
// ADMIN SUBMISSION ENDPOINTS (Admin Authentication Required)
// ============================================================================

// Get all submissions for an event (Admin only)
const getEventSubmissions = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { page = 1, limit = 20, status, sortBy = 'submissionTime' } = req.query;

        const query = { eventId };
        if (status) {
            query.status = status;
        }

        const submissions = await Submission.find(query)
            .populate('userId', 'name email studentId department year')
            .populate('eventId', 'title date submissionDeadline')
            .sort({ [sortBy]: -1 })
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
            message: 'Failed to get submissions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all submissions across all events (Admin only)
const getAllSubmissions = async (req, res) => {
    try {
        const { page = 1, limit = 20, status, eventId, sortBy = 'submissionTime' } = req.query;

        const query = {};
        if (status) query.status = status;
        if (eventId) query.eventId = eventId;

        const submissions = await Submission.find(query)
            .populate('userId', 'name email studentId department year')
            .populate('eventId', 'title date type status')
            .sort({ [sortBy]: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Submission.countDocuments(query);

        // Get submission statistics
        const stats = await Submission.aggregate([
            { $group: { 
                _id: '$status', 
                count: { $sum: 1 } 
            }},
            { $sort: { _id: 1 }}
        ]);

        res.status(200).json({
            success: true,
            submissions,
            stats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get all submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get submissions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update submission status (Admin only)
const updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, review } = req.body;

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Update submission
        const updateData = { status };
        
        if (review) {
            updateData.review = {
                ...submission.review,
                reviewerId: req.user._id,
                reviewDate: new Date(),
                ...review
            };
        }

        const updatedSubmission = await Submission.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('userId', 'name email studentId department year')
         .populate('eventId', 'title date');

        res.status(200).json({
            success: true,
            message: 'Submission updated successfully',
            submission: updatedSubmission
        });

    } catch (error) {
        console.error('Update submission status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Review submission with scores (Admin only)
const reviewSubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const { scores, feedback, publicFeedback, privateFeedback } = req.body;

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Calculate overall score
        const overallScore = scores ? 
            ((scores.creativity || 0) + (scores.technical || 0) + (scores.presentation || 0)) / 3 
            : 0;

        const reviewData = {
            reviewerId: req.user._id,
            reviewDate: new Date(),
            score: {
                ...scores,
                overall: Math.round(overallScore * 10) / 10
            },
            feedback: feedback || '',
            publicFeedback: publicFeedback || '',
            privateFeedback: privateFeedback || ''
        };

        const updatedSubmission = await Submission.findByIdAndUpdate(
            id,
            { 
                review: reviewData,
                status: 'under-review'
            },
            { new: true }
        ).populate('userId', 'name email studentId department year')
         .populate('eventId', 'title date');

        res.status(200).json({
            success: true,
            message: 'Submission reviewed successfully',
            submission: updatedSubmission
        });

    } catch (error) {
        console.error('Review submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to review submission',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete any submission (Admin only)
const deleteSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;

        const submission = await Submission.findById(id);
        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Delete the submission
        await Submission.findByIdAndDelete(id);

        // Update event submission count
        await Event.findByIdAndUpdate(submission.eventId, {
            $inc: { submissionCount: -1 }
        });

        res.status(200).json({
            success: true,
            message: 'Submission deleted successfully'
        });

    } catch (error) {
        console.error('Delete submission by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete submission',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Export all functions
export {
    submitToEvent,
    getUserEventSubmission,
    updateEventSubmission,
    deleteEventSubmission,
    getSubmissionStatus,
    getSubmissionFiles,
    // Admin endpoints
    getEventSubmissions,
    getAllSubmissions,
    updateSubmissionStatus,
    reviewSubmission,
    deleteSubmissionById
};
