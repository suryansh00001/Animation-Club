import Artwork from '../models/Artwork.js';

// Public endpoints
export const getArtworks = async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;
        
        const query = {};
        if (category) query.category = category;

        const artworks = await Artwork.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Artwork.countDocuments(query);

        res.status(200).json({
            success: true,
            artworks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get artworks error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get artworks',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const getArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        
        const artwork = await Artwork.findById(id);
        
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        res.status(200).json({
            success: true,
            artwork
        });
    } catch (error) {
        console.error('Get artwork error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get artwork',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// User endpoints (authenticated)
export const createArtwork = async (req, res) => {
    // Artwork submission is currently disabled
    res.status(503).json({
        success: false,
        message: 'Artwork submission is currently disabled',
        error: 'Service temporarily unavailable'
    });
};

// Admin endpoints
export const getAllArtworks = async (req, res) => {
    try {
        const { category, limit = 20, page = 1 } = req.query;
        
        const query = {};
        if (category) query.category = category;

        const artworks = await Artwork.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Artwork.countDocuments(query);

        res.status(200).json({
            success: true,
            artworks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get all artworks error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get artworks',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Admin artwork creation function
export const adminCreateArtwork = async (req, res) => {
    try {
        const {
            title,
            artist,
            category,
            source,
            description,
            artworkUrl,
            tools,
            duration,
            resolution,
            instagramUrl
        } = req.body;

        // Validate required fields
        if (!title || !artist || !category || !artworkUrl) {
            return res.status(400).json({
                success: false,
                message: 'Title, artist, category, and artwork URL are required'
            });
        }

        const artworkData = {
            title,
            artist,
            category,
            source: source || 'admin',
            description,
            artworkUrl,
            tools: Array.isArray(tools) ? tools : (tools ? tools.split(',').map(t => t.trim()) : []),
            duration: duration || null,
            resolution: resolution || null,
            instagramUrl: instagramUrl || null
        };

        const artwork = new Artwork(artworkData);
        await artwork.save();

        res.status(201).json({
            success: true,
            message: 'Artwork created successfully',
            artwork
        });
    } catch (error) {
        console.error('Admin create artwork error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create artwork',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Admin artwork update function
export const adminUpdateArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            artist,
            category,
            source,
            description,
            artworkUrl,
            tools,
            duration,
            resolution,
            instagramUrl
        } = req.body;

        const artwork = await Artwork.findById(id);
        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        // Update artwork fields
        if (title) artwork.title = title;
        if (artist) artwork.artist = artist;
        if (category) artwork.category = category;
        if (source) artwork.source = source;
        if (description !== undefined) artwork.description = description;
        if (artworkUrl) artwork.artworkUrl = artworkUrl;
        
        // Update metadata
        if (tools !== undefined) {
            artwork.tools = Array.isArray(tools) ? tools : (tools ? tools.split(',').map(t => t.trim()) : []);
        }
        if (duration !== undefined) artwork.duration = duration;
        if (resolution !== undefined) artwork.resolution = resolution;
        if (instagramUrl !== undefined) artwork.instagramUrl = instagramUrl;

        await artwork.save();

        res.status(200).json({
            success: true,
            message: 'Artwork updated successfully',
            artwork
        });
    } catch (error) {
        console.error('Admin update artwork error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update artwork',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

export const deleteArtwork = async (req, res) => {
    try {
        const { id } = req.params;

        const artwork = await Artwork.findByIdAndDelete(id);

        if (!artwork) {
            return res.status(404).json({
                success: false,
                message: 'Artwork not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Artwork deleted successfully'
        });
    } catch (error) {
        console.error('Delete artwork error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete artwork',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
