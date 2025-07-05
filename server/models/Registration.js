import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    participantDetails: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: false,
            default: 'N/A'
        },
        department: {
            type: String,
            default: 'N/A'
        },
        year: {
            type: String,
            default: 'N/A'
        },
        experience: String,
        studentId: {
            type: String,
            default: 'N/A'
        }
    },
    registrationData: {
        motivation: {
            type: String,
            maxlength: 1000
        },
        previousExperience: {
            type: String,
            maxlength: 1000
        },
        expectations: {
            type: String,
            maxlength: 1000
        },
        teamMembers: [{
            name: String,
            email: String,
            studentId: String
        }],
        specialRequirements: String,
        dietaryRestrictions: String,
        emergencyContact: {
            name: String,
            phone: String,
            relationship: String
        }
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'waitlisted', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentDetails: {
        amount: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 'USD'
        },
        transactionId: String,
        paymentMethod: String,
        paymentDate: Date
    },
    attendanceStatus: {
        type: String,
        enum: ['registered', 'attended', 'partially-attended', 'absent'],
        default: 'registered'
    },
    certificateIssued: {
        type: Boolean,
        default: false
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            maxlength: 1000
        },
        suggestions: String
    },
    metadata: {
        source: {
            type: String,
            enum: ['website', 'mobile', 'admin'],
            default: 'website'
        },
        ipAddress: String,
        userAgent: String,
        referrer: String
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
