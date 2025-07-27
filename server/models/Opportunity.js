import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type :String,
        required : true
    },
    compensation:{
        type: String,
        default : "Unpaid"
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    tag:{
        type: String,
        enum : ['beginner','intermediate','advanced'],
        default : 'intermediate'
    }
}, {
    timestamps: true
});


export default mongoose.model('Opportunity', opportunitySchema);