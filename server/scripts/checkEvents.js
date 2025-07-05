import Event from '../models/Event.js';
import connectDB from '../configs/db.js';
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to database
await connectDB();

try {
    const events = await Event.find({}).limit(5);
    
    console.log('📊 Events in database:');
    console.log('Total events:', await Event.countDocuments());
    
    events.forEach((event, index) => {
        console.log(`\n${index + 1}. Event: ${event.title}`);
        console.log(`   ID: ${event._id}`);
        console.log(`   ID type: ${typeof event._id}`);
        console.log(`   ID length: ${event._id.toString().length}`);
        console.log(`   Is valid ObjectId: ${mongoose.Types.ObjectId.isValid(event._id)}`);
        console.log(`   Status: ${event.status}`);
        console.log(`   Type: ${event.type}`);
        console.log(`   Is Active: ${event.isActive}`);
    });
    
} catch (error) {
    console.error('Error checking events:', error);
} finally {
    process.exit(0);
}
