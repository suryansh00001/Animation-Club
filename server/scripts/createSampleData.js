import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Submission from '../models/Submission.js';
import User from '../models/User.js';
import 'dotenv/config';

// Connect to database
await connectDB();

const createSampleRegistrations = async () => {
  try {
    console.log('Creating sample registrations...');
    
    // Get all events and users from the database
    const events = await Event.find({}).limit(10);
    const users = await User.find({ role: { $ne: 'admin' } }).limit(10);
    
    if (events.length === 0) {
      console.log('No events found. Please create some events first.');
      return;
    }
    
    if (users.length === 0) {
      console.log('No users found. Please create some users first.');
      return;
    }
    
    console.log(`Found ${events.length} events and ${users.length} users`);
    
    // Delete existing registrations
    await Registration.deleteMany({});
    
    // Create registrations
    const registrations = [];
    
    for (const event of events) {
      // Create 3-5 registrations per event
      const registrationsCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < registrationsCount; i++) {
        // Use random user or create one if we run out
        const user = users[Math.floor(Math.random() * users.length)];
        
        const registration = new Registration({
          eventId: event._id,
          userId: user._id,
          participantDetails: {
            name: user.name,
            email: user.email,
            phone: user.phone || '555-' + Math.floor(1000 + Math.random() * 9000),
            department: user.department || ['Animation', 'Digital Arts', 'Computer Science', 'Design'][Math.floor(Math.random() * 4)],
            year: ['1st', '2nd', '3rd', '4th'][Math.floor(Math.random() * 4)],
            experience: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
            studentId: user.studentId || 'ST' + Math.floor(10000 + Math.random() * 90000)
          },
          registrationData: {
            teamName: Math.random() > 0.7 ? `Team ${Math.floor(Math.random() * 100)}` : null,
            teamSize: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 1,
            preferences: {
              diet: Math.random() > 0.7 ? ['Vegetarian', 'Vegan', 'Non-vegetarian'][Math.floor(Math.random() * 3)] : null,
              accommodation: Math.random() > 0.8
            }
          },
          status: ['confirmed', 'pending', 'waitlisted', 'cancelled'][Math.floor(Math.random() * 4)],
          paymentStatus: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
          paymentDetails: {
            amount: event.price || 0,
            currency: 'USD',
            transactionId: Math.random() > 0.7 ? 'TXN' + Math.floor(100000 + Math.random() * 900000) : null,
            paymentMethod: ['credit_card', 'paypal', 'cash'][Math.floor(Math.random() * 3)]
          },
          timestamps: {
            registeredAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            confirmedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000) : null,
            updatedAt: new Date()
          },
          metadata: {
            source: ['website', 'mobile', 'admin'][Math.floor(Math.random() * 3)],
            ipAddress: '192.168.1.' + Math.floor(Math.random() * 255),
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        registrations.push(registration);
      }
    }
    
    // Save registrations
    await Registration.insertMany(registrations);
    console.log(`Created ${registrations.length} registrations`);
  } catch (error) {
    console.error('Error creating sample registrations:', error);
  }
};

const createSampleSubmissions = async () => {
  try {
    console.log('Creating sample submissions...');
    
    // Get all events and users from the database
    const events = await Event.find({}).limit(10);
    const users = await User.find({ role: { $ne: 'admin' } }).limit(10);
    
    if (events.length === 0) {
      console.log('No events found. Please create some events first.');
      return;
    }
    
    if (users.length === 0) {
      console.log('No users found. Please create some users first.');
      return;
    }
    
    console.log(`Found ${events.length} events and ${users.length} users`);
    
    // Delete existing submissions
    await Submission.deleteMany({});
    
    // Create submissions
    const submissions = [];
    
    for (const event of events) {
      // Create 2-4 submissions per event
      const submissionsCount = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < submissionsCount; i++) {
        // Use random user
        const user = users[Math.floor(Math.random() * users.length)];
        
        // Generate random title
        const titles = [
          'Character Animation Showcase', 
          'Environment Design', 
          '3D Model Portfolio', 
          'Animation Short Film',
          'Motion Graphics Project',
          'Character Design Concepts',
          'Storyboard Presentation',
          'Visual Effects Demo',
          'Stop Motion Animation',
          'Digital Painting Collection'
        ];
        
        const techniques = [
          '3D Modeling', 'Rigging', 'Texturing', 'Animation', 'Rendering',
          'Compositing', 'Sculpting', 'UV Mapping', 'Motion Capture',
          'Particle Effects', 'Character Design', 'Environment Design',
          'Storyboarding', 'Concept Art', 'Color Theory'
        ];
        
        const software = [
          'Maya', 'Blender', 'Cinema 4D', '3ds Max', 'ZBrush',
          'Substance Painter', 'Houdini', 'After Effects', 'Photoshop',
          'Illustrator', 'Toon Boom', 'TVPaint', 'Unreal Engine', 'Unity'
        ];
        
        // Pick 2-5 random techniques
        const randomTechniques = [];
        const techCount = Math.floor(Math.random() * 4) + 2;
        for (let j = 0; j < techCount; j++) {
          const tech = techniques[Math.floor(Math.random() * techniques.length)];
          if (!randomTechniques.includes(tech)) {
            randomTechniques.push(tech);
          }
        }
        
        // Pick 1-3 random software
        const randomSoftware = [];
        const softCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < softCount; j++) {
          const soft = software[Math.floor(Math.random() * software.length)];
          if (!randomSoftware.includes(soft)) {
            randomSoftware.push(soft);
          }
        }
        
        const submission = new Submission({
          eventId: event._id,
          userId: user._id,
          submissionDetails: {
            title: titles[Math.floor(Math.random() * titles.length)],
            description: 'This is a sample submission for testing purposes. It represents ' +
              'work created using various animation techniques and tools.',
            category: ['2D Animation', '3D Animation', 'Motion Graphics', 'Character Design', 
                      'Environment Design', 'Concept Art'][Math.floor(Math.random() * 6)],
            duration: Math.floor(Math.random() * 300) + 10, // 10-310 seconds
            techniques: randomTechniques,
            software: randomSoftware
          },
          files: {
            primary: {
              filename: ['submission.mp4', 'animation.mp4', 'project.mov', 'design.jpg'][Math.floor(Math.random() * 4)],
              url: `https://example.com/submissions/${Math.floor(Math.random() * 1000)}.mp4`,
              fileSize: Math.floor(Math.random() * 1000000) + 1000000,
              mimeType: ['video/mp4', 'image/jpeg', 'image/png', 'application/pdf'][Math.floor(Math.random() * 4)],
              duration: Math.floor(Math.random() * 300) + 10,
              resolution: ['1920x1080', '3840x2160', '1280x720'][Math.floor(Math.random() * 3)],
              checksum: `sha256:${Date.now() + i}`
            },
            thumbnails: [
              {
                url: `https://example.com/thumbnails/${Math.floor(Math.random() * 1000)}.jpg`,
                width: 640,
                height: 360
              }
            ],
            additional: Math.random() > 0.7 ? [
              {
                filename: 'making_of.pdf',
                url: `https://example.com/additional/${Math.floor(Math.random() * 1000)}.pdf`,
                fileSize: Math.floor(Math.random() * 500000) + 100000,
                mimeType: 'application/pdf'
              }
            ] : []
          },
          participantInfo: {
            name: user.name,
            email: user.email,
            studentId: user.studentId || 'ST' + Math.floor(10000 + Math.random() * 90000),
            department: user.department || ['Animation', 'Digital Arts', 'Computer Science', 'Design'][Math.floor(Math.random() * 4)],
            year: ['1st', '2nd', '3rd', '4th'][Math.floor(Math.random() * 4)]
          },
          submissionMetadata: {
            originalFilename: ['original_file.mp4', 'project_source.blend', 'animation_draft.mp4'][Math.floor(Math.random() * 3)],
            uploadProgress: 100,
            processingStatus: 'completed',
            virusScanStatus: 'clean',
            moderationStatus: ['pending', 'approved', 'flagged'][Math.floor(Math.random() * 3)],
            moderationNotes: Math.random() > 0.8 ? 'Please ensure content adheres to guidelines' : null
          },
          evaluation: {
            status: ['pending', 'evaluated', 'shortlisted', 'winner'][Math.floor(Math.random() * 4)],
            scores: Math.random() > 0.7 ? {
              technical: Math.floor(Math.random() * 5) + 1,
              creativity: Math.floor(Math.random() * 5) + 1,
              storytelling: Math.floor(Math.random() * 5) + 1,
              overall: Math.floor(Math.random() * 5) + 1
            } : null,
            feedback: Math.random() > 0.7 ? 'Great work on the technical aspects. The storytelling could be improved.' : null,
            judgeId: Math.random() > 0.7 ? mongoose.Types.ObjectId() : null,
            rank: Math.random() > 0.8 ? Math.floor(Math.random() * 10) + 1 : null,
            awards: Math.random() > 0.9 ? ['Best Technical Execution', 'People\'s Choice'][Math.floor(Math.random() * 2)] : []
          },
          status: ['submitted', 'under_review', 'approved', 'rejected', 'winner'][Math.floor(Math.random() * 5)],
          timestamps: {
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
            submittedAt: new Date(Date.now() - Math.floor(Math.random() * 25) * 24 * 60 * 60 * 1000),
            lastModifiedAt: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000),
            evaluatedAt: Math.random() > 0.7 ? new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000) : null
          },
          version: {
            current: 1,
            history: [
              {
                version: 1,
                timestamp: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                changes: 'Initial submission',
                fileChecksum: `sha256:${Date.now() + i}`
              }
            ]
          }
        });
        
        submissions.push(submission);
      }
    }
    
    // Save submissions
    await Submission.insertMany(submissions);
    console.log(`Created ${submissions.length} submissions`);
  } catch (error) {
    console.error('Error creating sample submissions:', error);
  }
};

// Run the script
try {
  await createSampleRegistrations();
  await createSampleSubmissions();
  console.log('Sample data creation completed!');
} catch (error) {
  console.error('Error creating sample data:', error);
}

// Close the database connection
await mongoose.connection.close();
console.log('Database connection closed');
