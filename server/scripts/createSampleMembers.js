import mongoose from 'mongoose';
import connectDB from '../configs/db.js';
import Member from '../models/Member.js';
import User from '../models/User.js';
import 'dotenv/config';

// Connect to database
await connectDB();

const createSampleMembers = async () => {
  try {
    console.log('Creating sample members...');
    
    // Delete existing members
    await Member.deleteMany({});
    
    // Sample users data
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'user',
        profile: {
          bio: 'Passionate about 2D animation and character design',
          skills: ['Animation', 'Character Design', 'Storyboarding']
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'user',
        profile: {
          bio: 'Expert in 3D modeling and visual effects',
          skills: ['3D Modeling', 'VFX', 'Rigging']
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'user',
        profile: {
          bio: 'Motion graphics specialist and video editor',
          skills: ['Motion Graphics', 'Video Editing', 'Compositing']
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        role: 'user',
        profile: {
          bio: 'Creative director with years of animation experience',
          skills: ['Direction', 'Animation', 'Team Leadership']
        }
      },
      {
        name: 'David Brown',
        email: 'david.brown@example.com',
        role: 'user',
        profile: {
          bio: 'Sound designer and music composer for animated projects',
          skills: ['Sound Design', 'Music Composition', 'Audio Engineering']
        }
      }
    ];

    // Create users first
    const createdUsers = [];
    for (const userData of sampleUsers) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = new User(userData);
        await user.save();
      }
      createdUsers.push(user);
    }

    // Sample members data
    const sampleMembers = [
      {
        userId: createdUsers[0]._id,
        name: createdUsers[0].name,
        email: createdUsers[0].email,
        currentPosition: {
          role: 'president',
          title: 'President',
          department: 'executive',
          responsibilities: ['Overall leadership', 'Strategic planning', 'External relations'],
          startDate: new Date('2024-01-01'),
          period: '2024-2025'
        },
        isActive: true,
        profile: {
          bio: 'Leading the animation club with passion and dedication',
          skills: ['Leadership', 'Animation', 'Project Management']
        }
      },
      {
        userId: createdUsers[1]._id,
        name: createdUsers[1].name,
        email: createdUsers[1].email,
        currentPosition: {
          role: 'secretary',
          title: 'Secretary',
          department: 'administration',
          responsibilities: ['Meeting coordination', 'Documentation', 'Communication'],
          startDate: new Date('2024-01-01'),
          period: '2024-2025'
        },
        isActive: true,
        profile: {
          bio: 'Keeping the club organized and running smoothly',
          skills: ['Organization', 'Communication', 'Documentation']
        }
      },
      {
        userId: createdUsers[2]._id,
        name: createdUsers[2].name,
        email: createdUsers[2].email,
        currentPosition: {
          role: 'joint-secretary',
          title: 'Joint Secretary',
          department: 'technical',
          responsibilities: ['Technical support', 'Event coordination', 'Workshop planning'],
          startDate: new Date('2024-01-01'),
          period: '2024-2025'
        },
        isActive: true,
        profile: {
          bio: 'Supporting the secretary and managing technical aspects',
          skills: ['Technical Support', 'Event Planning', 'Animation']
        }
      },
      {
        userId: createdUsers[3]._id,
        name: createdUsers[3].name,
        email: createdUsers[3].email,
        currentPosition: {
          role: 'core-member',
          title: 'Core Member',
          department: 'creative',
          responsibilities: ['Workshop facilitation', 'Member mentoring', 'Project guidance'],
          startDate: new Date('2024-01-01'),
          period: '2024-2025'
        },
        isActive: true,
        profile: {
          bio: 'Mentoring new members and leading creative projects',
          skills: ['Mentoring', 'Creative Direction', 'Animation']
        }
      },
      {
        userId: createdUsers[4]._id,
        name: createdUsers[4].name,
        email: createdUsers[4].email,
        isActive: false,
        positionHistory: [
          {
            role: 'president',
            title: 'President',
            department: 'executive',
            responsibilities: ['Overall leadership', 'Strategic planning', 'External relations'],
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-12-31'),
            period: '2023-2024'
          }
        ],
        profile: {
          bio: 'Former president who established many club traditions',
          skills: ['Leadership', 'Sound Design', 'Music Composition']
        }
      }
    ];

    // Create members
    const members = [];
    for (const memberData of sampleMembers) {
      const member = new Member(memberData);
      await member.save();
      members.push(member);
    }

    console.log(`✅ Created ${members.length} sample members successfully!`);
    console.log('Sample members:');
    members.forEach(member => {
      const position = member.currentPosition?.title || 'Former Member';
      console.log(`- ${member.name} (${position})`);
    });

  } catch (error) {
    console.error('❌ Error creating sample members:', error);
  } finally {
    mongoose.connection.close();
  }
};

createSampleMembers();
