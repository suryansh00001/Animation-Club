import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    category: {
        type: String,
        enum: ['award', 'recognition', 'competition'],
        default: 'award'
    },
    date: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    award: String,
    project: {
        title: String,
        description: String
    },
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true
});

achievementSchema.index({ category: 1 });
achievementSchema.index({ date: -1 });

export default mongoose.model('Achievement', achievementSchema);