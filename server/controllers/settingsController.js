import Settings from '../models/Settings.js';

// Get settings
export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        // If no settings exist, create default settings
        if (!settings) {
            settings = new Settings({});
            await settings.save();
        }
        
        res.status(200).json({
            success: true,
            settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get settings',
            error: error.message
        });
    }
};

// Update settings
export const updateSettings = async (req, res) => {
    try {
        const updates = req.body;
        
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = new Settings(updates);
        } else {
            // Update settings fields
            if (updates.site) {
                Object.assign(settings.site, updates.site);
            }
            if (updates.socialMedia) {
                Object.assign(settings.socialMedia, updates.socialMedia);
            }
            if (updates.email) {
                Object.assign(settings.email, updates.email);
            }
        }
        
        await settings.save();
        
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update settings',
            error: error.message
        });
    }
};
