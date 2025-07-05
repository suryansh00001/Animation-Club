import Gallery from '../models/Gallery.js';

// Public endpoints
export const getGalleryImages = async (req, res) => {
    try {
        const { limit = 20, page = 1 } = req.query;
        
        const query = { status: 'approved' };

        const images = await Gallery.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Gallery.countDocuments(query);

        res.status(200).json({
            success: true,
            images,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get gallery images error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get gallery images',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const getGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        
        const image = await Gallery.findOne({ 
            _id: id, 
            status: 'approved'
        });
        
        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.status(200).json({
            success: true,
            image
        });
    } catch (error) {
        console.error('Get gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get gallery image',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Admin endpoints
export const createGalleryImage = async (req, res) => {
    try {
        const { title, description, images } = req.body;

        // Validate required fields
        if (!title || !images || !Array.isArray(images) || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Title and at least one image are required'
            });
        }

        const imageData = {
            title,
            description,
            images,
            status: 'approved' // Auto-approve admin uploads
        };
        
        const image = new Gallery(imageData);
        await image.save();

        res.status(201).json({
            success: true,
            message: 'Gallery image created successfully',
            image
        });
    } catch (error) {
        console.error('Create gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create gallery image',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const updateGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, images, status } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (images && Array.isArray(images)) updateData.images = images;
        if (status) updateData.status = status;

        const image = await Gallery.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gallery image updated successfully',
            image
        });
    } catch (error) {
        console.error('Update gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update gallery image',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;

        const image = await Gallery.findByIdAndDelete(id);

        if (!image) {
            return res.status(404).json({
                success: false,
                message: 'Image not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Gallery image deleted successfully'
        });
    } catch (error) {
        console.error('Delete gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete gallery image',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Admin function to get all gallery images (including pending)
export const getAllGalleryImages = async (req, res) => {
    try {
        const { status, limit = 20, page = 1 } = req.query;
        
        const query = {};
        if (status) query.status = status;

        const images = await Gallery.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Gallery.countDocuments(query);

        res.status(200).json({
            success: true,
            images,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get all gallery images error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get gallery images',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};