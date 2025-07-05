import Contact from '../models/Contact.js';

// Submit contact form (Public)
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message, category } = req.body;
        
        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Create contact submission
        const contact = new Contact({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            message: message.trim(),
            category: category || 'general',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent')
        });

        await contact.save();

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
            submissionId: contact._id
        });

    } catch (error) {
        console.error('Submit contact form error:', error);
        
        let errorMessage = 'Failed to submit contact form';
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            errorMessage = errors.join(', ');
        }
        
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get all contact submissions (Admin only)
export const getContactSubmissions = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 20, 
            status,
            category,
            isRead,
            search,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = {};
        if (status && status !== 'all') query.status = status;
        if (category && category !== 'all') query.category = category;
        if (isRead !== undefined) query.isRead = isRead === 'true';
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { subject: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const contacts = await Contact.find(query)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Contact.countDocuments(query);

        // Get unread count
        const unreadCount = await Contact.countDocuments({ isRead: false });

        res.status(200).json({
            success: true,
            contacts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            },
            stats: {
                unreadCount,
                totalSubmissions: await Contact.countDocuments()
            }
        });

    } catch (error) {
        console.error('Get contact submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contact submissions',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Mark contact as read (Admin only)
export const markContactAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { isRead = true } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            id,
            { isRead },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Contact marked as ${isRead ? 'read' : 'unread'}`,
            contact
        });

    } catch (error) {
        console.error('Mark contact as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Update contact status (Admin only)
export const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, priority } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;

        const contact = await Contact.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact status updated successfully',
            contact
        });

    } catch (error) {
        console.error('Update contact status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Delete contact submission (Admin only)
export const deleteContactSubmission = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact submission not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact submission deleted successfully'
        });

    } catch (error) {
        console.error('Delete contact submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact submission',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get contact statistics (Admin only)
export const getContactStats = async (req, res) => {
    try {
        const [
            totalContacts,
            unreadContacts,
            pendingContacts,
            resolvedContacts,
            recentContacts
        ] = await Promise.all([
            Contact.countDocuments(),
            Contact.countDocuments({ isRead: false }),
            Contact.countDocuments({ status: 'pending' }),
            Contact.countDocuments({ status: 'resolved' }),
            Contact.find().sort({ createdAt: -1 }).limit(5)
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalContacts,
                unreadContacts,
                pendingContacts,
                resolvedContacts,
                recentContacts
            }
        });

    } catch (error) {
        console.error('Get contact stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get contact statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
