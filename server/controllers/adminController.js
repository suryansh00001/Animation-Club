import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Submission from '../models/Submission.js';
import Member from '../models/Member.js';

// Helper function to validate image URLs
const isValidImageUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
        return false;
    }
};

// ============================================================================
// ADMIN GENERAL ENDPOINTS (Admin Authentication Required)
// ============================================================================

// Get admin dashboard data
const getAdminDashboard = async (req, res) => {
    try {
        // Get basic counts
        const [
            totalEvents,
            totalUsers,
            totalRegistrations,
            totalSubmissions,
            recentEvents,
            recentRegistrations
        ] = await Promise.all([
            Event.countDocuments(),
            User.countDocuments({ role: { $ne: 'admin' } }),
            Registration.countDocuments(),
            Submission.countDocuments(),
            Event.find().sort({ createdAt: -1 }).limit(5).populate('createdBy', 'name email'),
            Registration.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email').populate('eventId', 'title')
        ]);

        res.status(200).json({
            success: true,
            dashboard: {
                stats: {
                    totalEvents,
                    totalUsers,
                    totalRegistrations,
                    totalSubmissions
                },
                recentEvents,
                recentRegistrations
            }
        });

    } catch (error) {
        console.error('Get admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get admin dashboard',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get admin statistics
const getAdminStats = async (req, res) => {
    try {
        const stats = await Promise.all([
            Event.countDocuments(),
            User.countDocuments({ role: { $ne: 'admin' } }),
            Registration.countDocuments(),
            Submission.countDocuments(),
            Event.countDocuments({ status: 'upcoming' }),
            Event.countDocuments({ status: 'ongoing' }),
            Event.countDocuments({ status: 'completed' })
        ]);

        const [
            totalEvents,
            totalUsers,
            totalRegistrations,
            totalSubmissions,
            upcomingEvents,
            ongoingEvents,
            completedEvents
        ] = stats;

        res.status(200).json({
            success: true,
            stats: {
                events: {
                    total: totalEvents,
                    upcoming: upcomingEvents,
                    ongoing: ongoingEvents,
                    completed: completedEvents
                },
                users: {
                    total: totalUsers
                },
                registrations: {
                    total: totalRegistrations
                },
                submissions: {
                    total: totalSubmissions
                }
            }
        });

    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get admin statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all registrations (admin view)
const getAdminRegistrations = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            eventId,
            search,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;
        if (eventId) query.eventId = eventId;
        if (search) {
            query.$or = [
                { 'participantDetails.name': { $regex: search, $options: 'i' } },
                { 'participantDetails.email': { $regex: search, $options: 'i' } },
                { 'participantDetails.studentId': { $regex: search, $options: 'i' } }
            ];
        }

        const registrations = await Registration.find(query)
            .populate('userId', 'name email studentId')
            .populate({
                path: 'eventId',
                select: 'title date status location',
                options: { strictPopulate: false }
            })
            .sort(sort)
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
        console.error('Get admin registrations error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get registrations',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all submissions (admin view)
const getAdminSubmissions = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status, 
            eventId,
            search,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = {};
        if (status) query.status = status;
        if (eventId) query.eventId = eventId;
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
            .populate('eventId', 'title date status')
            .sort(sort)
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
        console.error('Get admin submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get submissions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all members (admin view)
const getAdminMembers = async (req, res) => {
    try {
        // Get all members without backend filtering (filtering will be done on frontend)
        const members = await Member.find({})
            .sort({ 'currentPosition.isActive': -1, 'currentPosition.role': 1, name: 1 });

        res.status(200).json({
            success: true,
            members,
            total: members.length
        });

    } catch (error) {
        console.error('Get admin members error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get members',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Create new member
const createMember = async (req, res) => {
    try {
        console.log('Creating member with request body:', req.body);
        
        const {
            name,
            email,
            membershipType,
            currentPosition,
            positionHistory,
            profile,
            visibility,
            status
        } = req.body;

        console.log('Position history received:', positionHistory);

        // Validate positionHistory for legacy members
        if (Array.isArray(positionHistory) && positionHistory.length > 0) {
            const validPositions = positionHistory.filter(pos => 
                pos.role && pos.period && pos.role !== '' && pos.period !== ''
            );
            console.log('Valid positions found:', validPositions.length, 'out of', positionHistory.length);
            
            if (validPositions.length === 0 && membershipType === 'alumni') {
                return res.status(400).json({
                    success: false,
                    message: 'Legacy members must have at least one valid position with role and period'
                });
            }
        }

        // Normalize email for consistent comparison
        const normalizedEmail = email.toLowerCase().trim();
        
        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        // Basic URL validation for profileImage
        if (profile?.profileImage && profile.profileImage.trim() && !isValidImageUrl(profile.profileImage)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid image URL format'
            });
        }

        // Calculate academic year period with clear logic
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        
        // Academic year calculation:
        // July-December: Current academic year starts this year
        // January-June: Current academic year started last year
        let academicStartYear, academicEndYear;
        if (currentMonth >= 6) { // July (month 6) onwards
            academicStartYear = currentYear;
            academicEndYear = currentYear + 1;
        } else { // January to June
            academicStartYear = currentYear - 1;
            academicEndYear = currentYear;
        }
        const academicPeriod = `${academicStartYear}-${academicEndYear}`;

        console.log(`Academic period calculation: Current date: ${currentDate.toISOString()}, Academic period: ${academicPeriod}`);

        // Create member with proper position tracking
        const memberData = {
            name,
            email: normalizedEmail, // Use normalized email
            membershipType: membershipType || 'core',
            currentPosition: {
                title: getRoleTitle(currentPosition?.role || 'core-member'), // Always derive title from role
                role: currentPosition?.role || 'core-member',
                department: currentPosition?.department || 'general',
                responsibilities: Array.isArray(currentPosition?.responsibilities) 
                    ? currentPosition.responsibilities 
                    : (currentPosition?.responsibilities ? [currentPosition.responsibilities] : []),
                startDate: currentPosition?.startDate ? new Date(currentPosition.startDate) : new Date(),
                endDate: null, // Active position has no end date
                period: currentPosition?.period || academicPeriod,
                isActive: true
            },
            positionHistory: Array.isArray(positionHistory) ? positionHistory : [], // Use provided history or empty
            profile: {
                bio: profile?.bio || '',
                mobile: profile?.mobile || '',
                profileImage: profile?.profileImage || '',
                skills: Array.isArray(profile?.skills) ? profile.skills : []
            },
            visibility: {
                profileVisible: visibility?.profileVisible !== false,
                showInDirectory: visibility?.showInDirectory !== false,
                contactAllowed: visibility?.contactAllowed !== false
            },
            status: status || 'active',
            joinDate: new Date(),
            lastActive: new Date()
        };

        console.log('Creating member with data:', JSON.stringify(memberData, null, 2));

        const member = new Member(memberData);
        await member.save();

        console.log('Member created successfully:', member._id);

        res.status(201).json({
            success: true,
            message: 'Member created successfully',
            member: {
                ...member.toObject(),
                // Add computed fields for frontend
                currentAcademicYear: academicPeriod,
                tenureInformation: {
                    currentRole: member.currentPosition.role,
                    currentTitle: member.currentPosition.title,
                    currentDepartment: member.currentPosition.department,
                    startDate: member.currentPosition.startDate,
                    period: member.currentPosition.period,
                    isActive: member.currentPosition.isActive,
                    isLeadershipRole: ['secretary', 'joint-secretary'].includes(member.currentPosition.role),
                    responsibilities: member.currentPosition.responsibilities,
                    academicYearCalculation: {
                        currentDate: currentDate.toISOString(),
                        academicStartYear,
                        academicEndYear,
                        calculatedPeriod: academicPeriod,
                        explanation: currentMonth >= 6 
                            ? `Academic year ${academicStartYear}-${academicEndYear} (started in July ${academicStartYear})`
                            : `Academic year ${academicStartYear}-${academicEndYear} (started in July ${academicStartYear})`
                    },
                    yearsActive: Math.floor((new Date() - member.currentPosition.startDate) / (365.25 * 24 * 60 * 60 * 1000))
                }
            }
        });

    } catch (error) {
        console.error('Create member error:', error);
        console.error('Error stack:', error.stack);
        
        let errorMessage = 'Failed to create member';
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            errorMessage = `Validation failed: ${errors.join(', ')}`;
        }
        else if (error.code === 11000) {
            // Handle duplicate key errors more specifically
            if (error.keyPattern && error.keyPattern.userId) {
                errorMessage = 'Database index error: Multiple members with null userId not allowed. Please run the index fix script.';
                console.error('💥 URGENT: userId index needs to be fixed! Run: node fix-member-indexes.js');
            } else if (error.keyPattern && error.keyPattern.email) {
                errorMessage = 'Member with this email already exists';
            } else {
                errorMessage = 'Duplicate key error: ' + error.message;
            }
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? {
                message: error.message,
                stack: error.stack
            } : 'Internal server error'
        });
    }
};

// Update member
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Basic URL validation for profileImage if it's being updated
        if (updateData.profile?.profileImage && updateData.profile.profileImage.trim() && !isValidImageUrl(updateData.profile.profileImage)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid image URL format'
            });
        }

        const member = await Member.findByIdAndUpdate(
            id,
            { 
                ...updateData,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Member updated successfully',
            member
        });

    } catch (error) {
        console.error('Update member error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update member',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete member
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await Member.findByIdAndDelete(id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Member deleted successfully'
        });

    } catch (error) {
        console.error('Delete member error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete member',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update member position (promote/change role)
const updateMemberPosition = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPosition, reason } = req.body;

        console.log(`Updating position for member ${id}:`, { newPosition, reason });

        // Validate required fields
        if (!newPosition || !newPosition.role) {
            return res.status(400).json({
                success: false,
                message: 'New position role is required'
            });
        }

        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        // Calculate new academic period
        const academicPeriod = Member.calculateAcademicPeriod();

        // Record current position in history if it's not the default 'core-member' role
        if (member.currentPosition.role !== 'core-member' && member.currentPosition.isActive) {
            const historyEntry = {
                title: member.currentPosition.title,
                role: member.currentPosition.role,
                department: member.currentPosition.department,
                responsibilities: member.currentPosition.responsibilities,
                startDate: member.currentPosition.startDate,
                endDate: new Date(),
                period: member.currentPosition.period,
                achievements: []
            };

            if (reason) {
                historyEntry.endReason = reason;
            }

            member.positionHistory.push(historyEntry);
        }

        // Update current position
        member.currentPosition = {
            title: newPosition.title || 'Core Team Member',
            role: newPosition.role,
            department: newPosition.department || 'general',
            responsibilities: Array.isArray(newPosition.responsibilities) 
                ? newPosition.responsibilities 
                : (newPosition.responsibilities ? [newPosition.responsibilities] : []),
            startDate: new Date(),
            endDate: null,
            period: academicPeriod,
            isActive: true
        };

        // Update membership type based on new role
        if (['secretary', 'joint-secretary'].includes(newPosition.role)) {
            member.membershipType = 'core';
        } else if (newPosition.role === 'core-member') {
            member.membershipType = 'core';
        } else {
            member.membershipType = 'core';
        }

        await member.save();

        console.log(`Position updated successfully for member ${member.name}`);

        res.json({
            success: true,
            message: `${member.name} has been promoted to ${newPosition.title || newPosition.role}`,
            member: {
                ...member.toObject(),
                tenureInformation: member.getTenureInfo(),
                academicPeriod,
                promotionDetails: {
                    newRole: newPosition.role,
                    newTitle: newPosition.title,
                    newDepartment: newPosition.department,
                    effectiveDate: new Date(),
                    academicYear: academicPeriod,
                    reason: reason || 'Position update'
                }
            }
        });

    } catch (error) {
        console.error('Update member position error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update member position',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get public members for user pages
const getPublicMembers = async (req, res) => {
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

// Update registration status
const updateRegistrationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'waitlist'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const registration = await Registration.findByIdAndUpdate(
            id,
            { 
                status,
                'timestamps.updatedAt': new Date()
            },
            { new: true }
        ).populate('userId', 'name email').populate('eventId', 'title');

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Registration status updated successfully',
            registration
        });

    } catch (error) {
        console.error('Update registration status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update registration status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update submission status
const updateSubmissionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['draft', 'submitted', 'pending', 'under-review', 'approved', 'rejected', 'winner'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const submission = await Submission.findByIdAndUpdate(
            id,
            { 
                status,
                'timestamps.lastModifiedAt': new Date()
            },
            { new: true }
        ).populate('userId', 'name email').populate('eventId', 'title');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Submission status updated successfully',
            submission
        });

    } catch (error) {
        console.error('Update submission status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update submission award status
const updateSubmissionAward = async (req, res) => {
    try {
        const { id } = req.params;
        const { position, prize, certificate } = req.body;

        const validPositions = ['first', 'second', 'third', 'honorable-mention', 'special-recognition', 'none'];
        if (position && !validPositions.includes(position)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid award position'
            });
        }

        const updateData = {
            'award.position': position || 'none',
            'award.awardedDate': position && position !== 'none' ? new Date() : null
        };

        if (prize !== undefined) {
            updateData['award.prize'] = prize;
        }
        if (certificate !== undefined) {
            updateData['award.certificate'] = certificate;
        }

        const submission = await Submission.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('userId', 'name email').populate('eventId', 'title');

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Submission award updated successfully',
            submission
        });

    } catch (error) {
        console.error('Update submission award error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update submission award',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// ============================================================================
// SYSTEM STATUS ENDPOINT (No Authentication Required)
// ============================================================================

// Get system status
const getSystemStatus = async (req, res) => {
    try {
        const uptime = process.uptime();
        const currentTime = new Date();
        
        // Get database stats
        const [
            totalUsers,
            totalEvents,
            totalMembers,
            totalSubmissions,
            totalRegistrations
        ] = await Promise.all([
            User.countDocuments(),
            Event.countDocuments(),
            Member.countDocuments(),
            Submission.countDocuments(),
            Registration.countDocuments()
        ]);

        // Calculate system health
        const memoryUsage = process.memoryUsage();
        const memoryUsagePercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100);
        
        // System status
        const status = {
            status: 'operational',
            timestamp: currentTime.toISOString(),
            uptime: {
                seconds: Math.floor(uptime),
                formatted: formatUptime(uptime)
            },
            version: process.env.APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            database: {
                status: 'connected',
                collections: {
                    users: totalUsers,
                    events: totalEvents,
                    members: totalMembers,
                    submissions: totalSubmissions,
                    registrations: totalRegistrations
                }
            },
            server: {
                nodeVersion: process.version,
                platform: process.platform,
                memory: {
                    used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
                    total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
                    percentage: memoryUsagePercent
                }
            },
            services: {
                api: 'operational',
                database: 'operational',
                fileStorage: 'operational'
            }
        };

        res.status(200).json({
            success: true,
            ...status
        });

    } catch (error) {
        console.error('Get system status error:', error);
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'System status check failed',
            timestamp: new Date().toISOString(),
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Helper function to format uptime
const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let result = '';
    if (days > 0) result += `${days}d `;
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0) result += `${minutes}m `;
    result += `${secs}s`;
    
    return result.trim();
};

// Update member profile (simplified - only bio, mobile, skills)
const updateMemberProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { bio, mobile, profileImage, skills } = req.body;

        console.log('Updating profile for member:', id);
        console.log('Profile data:', { bio, mobile, profileImage, skills });

        // Basic URL validation for profileImage
        if (profileImage && profileImage.trim() && !isValidImageUrl(profileImage)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid image URL format'
            });
        }

        const member = await Member.findById(id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        // Update only profile fields
        member.profile = {
            bio: bio || member.profile?.bio || '',
            mobile: mobile || member.profile?.mobile || '',
            profileImage: profileImage || member.profile?.profileImage || '',
            skills: Array.isArray(skills) ? skills : (member.profile?.skills || [])
        };

        await member.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            member
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Helper function to get proper title from role
const getRoleTitle = (role) => {
    const roleTitleMap = {
        'secretary': 'Secretary',
        'joint-secretary': 'Joint Secretary',
        'core-member': 'Core Team Member'
    };
    return roleTitleMap[role] || role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Export all functions
export {
    getAdminDashboard,
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
    getSystemStatus
};
