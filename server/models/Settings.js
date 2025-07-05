import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    site: {
        name: {
            type: String,
            default: 'Animation Club'
        },
        description: {
            type: String,
            default: 'A creative community for animation enthusiasts'
        },
        established: {
            type: String,
            default: '2020'
        },
        mission: {
            type: String,
            default: 'To provide learning opportunities, industry connections, and creative platforms for students interested in animation and visual storytelling.'
        },
        vision: {
            type: String,
            default: 'To foster creativity, innovation, and excellence in animation while building a supportive community of aspiring animators.'
        },
        keywords: {
            type: String,
            default: 'animation, club, university, creative, motion graphics, 3D animation, 2D animation, storytelling'
        },
        logo: {
            url: String
        },
        favicon: {
            url: String
        },
        contactEmail: {
            type: String,
            default: 'animation.fmcweekend@gmail.com'
        },
        contactPhone: String,
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
            full: String
        },
        officeHours: {
            type: String,
            default: 'Mon-Fri 9:00 AM - 5:00 PM'
        }
    },
    socialMedia: {
        instagram: String,
        youtube: String,
        twitter: String,
        facebook: String,
        linkedin: String,
        discord: String,
        tiktok: String
    },
    announcements: [{
        title: String,
        message: String,
        type: {
            type: String,
            enum: ['info', 'warning', 'success', 'error'],
            default: 'info'
        },
        active: {
            type: Boolean,
            default: true
        },
        expiresAt: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    email: {
        smtpHost: String,
        smtpPort: Number,
        smtpUser: String,
        smtpPass: String,
        fromEmail: String,
        fromName: String
    }
}, {
    timestamps: true
});

// Ensure only one settings document exists
settingsSchema.index({}, { unique: true });

export default mongoose.model('Settings', settingsSchema);
