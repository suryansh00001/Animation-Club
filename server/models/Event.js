import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    location: {
        type: String,
        required: true
    },
    venue: {
        type: String
    },
    type: {
        type: String,
        enum: ['workshop', 'competition', 'exhibition', 'seminar', 'meetup', 'festival'],
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    currentParticipants: {
        type: Number,
        default: 0
    },
    registrationDeadline: {
        type: Date,
        required: function() {
            return this.registrationRequired === true;
        }
    },
    registrationRequired: {
        type: Boolean,
        default: true
    },
    submissionDeadline: {
        type: Date
    },
    submissionRequired: {
        type: Boolean,
        default: false
    },
    requirements: [{
        type: String
    }],
    prizes: [{
        position: String,
        prize: String
    }],
    organizer: {
        type: String,
        required: true
    },
    instructors: [{
        name: String,
        bio: String,
        image: String
    }],
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534337621606-e3df5ee0e97f?q=80&w=1000&auto=format&fit=crop',
        validate: {
            validator: function(v) {
                return v === null || /^https?:\/\/.+\..+/.test(v);
            },
            message: 'Image must be a valid URL'
        }
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    schedule: [{
        date: Date,
        startTime: String,
        endTime: String,
        activity: String,
        speaker: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    registrationCount: {
        type: Number,
        default: 0
    },
    submissionCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Virtual property to display venue and location combined
eventSchema.virtual('fullLocation').get(function() {
    if (this.venue && this.location) {
        return `${this.venue}, ${this.location}`;
    } else if (this.venue) {
        return this.venue;
    } else {
        return this.location;
    }
});

// Include virtual fields when converting to JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure registration is required for events with submissions
eventSchema.pre('save', function(next) {
    // If submissions are required, registration must also be required
    if (this.submissionRequired === true) {
        this.registrationRequired = true;
    }
    next();
});

// Index for better query performance
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ status: 1 });

const Event = mongoose.model('Event', eventSchema);
export default Event;
