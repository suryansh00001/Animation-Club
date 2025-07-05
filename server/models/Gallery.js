import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 1000
    },
    images: [{
        type: String,
        required: true
    }],
    status: {
        type: String,
        enum: ['pending', 'approved'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Indexes for better query performance
gallerySchema.index({ status: 1 });
gallerySchema.index({ createdAt: -1 });

export default mongoose.model('Gallery', gallerySchema);
