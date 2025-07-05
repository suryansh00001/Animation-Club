import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
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
    submissionDetails: {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        }
    },
    files: {
        mainFileUrl: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return /^https?:\/\/.+/.test(v);
                },
                message: 'Main file URL must be a valid URL'
            }
        }
    },
    participantInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        studentId: String,
        department: String,
        year: String
    },
    status: {
        type: String,
        enum: ['submitted', 'under-review', 'approved', 'rejected', 'winner'],
        default: 'submitted'
    },
    submissionTime: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    award: {
        position: {
            type: String,
            enum: ['first', 'second', 'third', 'honorable-mention', 'special-recognition', 'none'],
            default: 'none'
        },
        prize: String,
        certificate: String,
        awardedDate: Date
    }
}, {
    timestamps: true
});

// Update lastModified on save
submissionSchema.pre('save', function(next) {
    this.lastModified = new Date();
    next();
});

// Compound index to prevent duplicate submissions
submissionSchema.index({ eventId: 1, userId: 1 }, { unique: true });

export default mongoose.model('Submission', submissionSchema);
