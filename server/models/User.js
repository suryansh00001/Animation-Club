import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: false,
        default: ''
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    year: {
        type: String,
        required: false,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni'],
        default: '1st Year'
    },
    department: {
        type: String,
        required: false,
        default: ''
    },
    institution: {
        type: String,
        required: false,
        default: ''
    },
    experience: {
        type: String,
        required: false,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
        default: 'Beginner'
    },
    avatar: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    profile: {
        bio: {
            type: String,
            maxlength: 500
        },
        interests: [{
            type: String
        }],
        portfolio: {
            type: String
        },
        socialLinks: {
            instagram: String,
            twitter: String,
            linkedin: String
        }
    },
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true },
            eventReminders: { type: Boolean, default: true }
        },
        privacy: {
            showEmail: { type: Boolean, default: false },
            showPhone: { type: Boolean, default: false },
            profileVisibility: { 
                type: String, 
                enum: ['public', 'private'], 
                default: 'public' 
            }
        }
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    lastLoginAt: {
        type: Date
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
}, {
    timestamps: true
});


export default mongoose.model('User', userSchema);
