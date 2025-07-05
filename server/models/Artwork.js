import mongoose from 'mongoose';

const artworkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        maxlength: 2000
    },
    artist: {
        type: String,
        required: true
    },
    artworkUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['2d', '3d', 'illustration', 'motion', 'student'],
        required: true
    },
    source: {
        type: String,
        enum: ['student', 'instagram', 'exhibition', 'admin'],
        default: 'student'
    },
    tools: [String],
    duration: String,
    resolution: String,
    instagramUrl: String
}, {
    timestamps: true
});

// Indexes for better query performance
artworkSchema.index({ category: 1 });
artworkSchema.index({ createdAt: -1 });

export default mongoose.model('Artwork', artworkSchema);
