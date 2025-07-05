import Event from '../models/Event.js';
import connectDB from '../configs/db.js';
import 'dotenv/config';

// Connect to database
await connectDB();

// Sample events data
const sampleEvents = [
    {
        title: "2D Animation Workshop",
        description: "Learn the fundamentals of 2D animation using industry-standard tools. This workshop covers keyframe animation, timing, and basic character animation principles.",
        shortDescription: "Learn 2D animation fundamentals with industry tools",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&h=800&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1593642532454-e138e28a63f4?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1574492859584-81668716ee77?w=800&h=600&fit=crop"
        ],
        date: new Date('2025-08-15T10:00:00Z'),
        endDate: new Date('2025-08-15T16:00:00Z'),
        location: "Animation Lab, Building A",
        venue: "Room 101",
        type: "workshop",
        category: "2d",
        status: "upcoming",
        maxParticipants: 30,
        registrationDeadline: new Date('2025-08-10T23:59:59Z'),
        submissionDeadline: new Date('2025-08-20T23:59:59Z'),
        requirements: [
            "Laptop with Adobe Animate or similar software",
            "Basic drawing skills",
            "Enthusiasm to learn"
        ],
        prerequisites: [
            "Basic computer skills",
            "Interest in animation"
        ],
        prizes: [
            { position: "1st", prize: "Software License", amount: 500 },
            { position: "2nd", prize: "Drawing Tablet", amount: 300 },
            { position: "3rd", prize: "Art Supplies", amount: 100 }
        ],
        organizer: "Animation Club",
        instructors: [
            {
                name: "Prof. Sarah Johnson",
                bio: "Professional animator with 10+ years experience",
                image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop"
            }
        ],
        tags: ["2d", "animation", "workshop", "beginner"],
        price: 50,
        featured: true,
        isActive: true
    },
    {
        title: "3D Modeling Competition",
        description: "Showcase your 3D modeling skills in this exciting competition. Create stunning 3D models and compete for amazing prizes.",
        shortDescription: "3D modeling competition with amazing prizes",
        image: "https://images.unsplash.com/photo-1642052502780-8ee67e3bf939?w=1200&h=800&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop"
        ],
        date: new Date('2025-09-01T09:00:00Z'),
        endDate: new Date('2025-09-01T18:00:00Z'),
        location: "Design Studio, Building B",
        venue: "Studio 201",
        type: "competition",
        category: "3d",
        status: "upcoming",
        maxParticipants: 50,
        registrationDeadline: new Date('2025-08-25T23:59:59Z'),
        submissionDeadline: new Date('2025-09-05T23:59:59Z'),
        requirements: [
            "3D modeling software (Blender, Maya, etc.)",
            "Portfolio of previous work",
            "Creativity and passion"
        ],
        prerequisites: [
            "Basic 3D modeling knowledge",
            "Understanding of 3D software"
        ],
        prizes: [
            { position: "1st", prize: "Professional 3D Software License", amount: 1000 },
            { position: "2nd", prize: "High-end Graphics Tablet", amount: 600 },
            { position: "3rd", prize: "3D Printing Kit", amount: 300 }
        ],
        organizer: "Animation Club",
        instructors: [
            {
                name: "Dr. Michael Chen",
                bio: "3D artist and professor specializing in character modeling",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
            }
        ],
        tags: ["3d", "modeling", "competition", "intermediate"],
        price: 75,
        featured: true,
        isActive: true
    },
    {
        title: "VFX Masterclass",
        description: "Dive deep into visual effects techniques used in modern filmmaking. Learn compositing, motion tracking, and advanced VFX workflows.",
        shortDescription: "Professional VFX techniques and workflows",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=800&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1626785774733-168d970a7ad3?w=800&h=600&fit=crop"
        ],
        date: new Date('2025-09-15T14:00:00Z'),
        endDate: new Date('2025-09-15T18:00:00Z'),
        location: "Media Center, Building C",
        venue: "VFX Lab",
        type: "seminar",
        category: "vfx",
        status: "upcoming",
        maxParticipants: 25,
        registrationDeadline: new Date('2025-09-10T23:59:59Z'),
        requirements: [
            "After Effects or similar VFX software",
            "High-performance computer",
            "Sample footage (provided)"
        ],
        prerequisites: [
            "Intermediate knowledge of video editing",
            "Understanding of compositing basics"
        ],
        organizer: "Animation Club",
        instructors: [
            {
                name: "Alex Rodriguez",
                bio: "Industry VFX supervisor with credits on major films",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
            }
        ],
        tags: ["vfx", "compositing", "masterclass", "advanced"],
        price: 100,
        featured: false,
        isActive: true
    },
    {
        title: "Motion Graphics Festival",
        description: "A showcase of the best motion graphics work from students and professionals. Network, learn, and get inspired by cutting-edge motion design.",
        shortDescription: "Showcase and networking event for motion graphics",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=800&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop"
        ],
        date: new Date('2025-10-01T10:00:00Z'),
        endDate: new Date('2025-10-01T20:00:00Z'),
        location: "Main Auditorium",
        venue: "Grand Hall",
        type: "festival",
        category: "motion-graphics",
        status: "upcoming",
        maxParticipants: 200,
        registrationDeadline: new Date('2025-09-25T23:59:59Z'),
        submissionDeadline: new Date('2025-09-20T23:59:59Z'),
        requirements: [
            "Portfolio of motion graphics work",
            "Professional presentation materials"
        ],
        organizer: "Animation Club & Design Department",
        tags: ["motion-graphics", "festival", "showcase", "networking"],
        price: 0,
        featured: true,
        isActive: true
    },
    {
        title: "Character Animation Bootcamp",
        description: "Intensive 2-day bootcamp focusing on character animation principles, including walk cycles, facial animation, and acting for animators.",
        shortDescription: "Intensive character animation training program",
        image: "https://images.unsplash.com/photo-1612487528505-d2338264c821?w=1200&h=800&fit=crop",
        gallery: [
            "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1587355760421-b9de3226a046?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=800&h=600&fit=crop"
        ],
        date: new Date('2025-10-15T09:00:00Z'),
        endDate: new Date('2025-10-16T17:00:00Z'),
        location: "Animation Lab, Building A",
        venue: "Rooms 101-103",
        type: "workshop",
        category: "2d",
        status: "upcoming",
        maxParticipants: 20,
        registrationDeadline: new Date('2025-10-08T23:59:59Z'),
        submissionDeadline: new Date('2025-10-25T23:59:59Z'),
        requirements: [
            "Animation software (any)",
            "Drawing tablet recommended",
            "Commitment to attend both days"
        ],
        prerequisites: [
            "Basic animation knowledge",
            "Understanding of timeline-based software"
        ],
        prizes: [
            { position: "Best Performance", prize: "Industry Mentorship", amount: 0 },
            { position: "Most Improved", prize: "Animation Books Set", amount: 150 }
        ],
        organizer: "Animation Club",
        instructors: [
            {
                name: "Emma Thompson",
                bio: "Senior animator at major animation studio",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
            },
            {
                name: "James Wilson",
                bio: "Character animation specialist and educator",
                image: "https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&h=400&fit=crop"
            }
        ],
        tags: ["character", "animation", "bootcamp", "intensive"],
        price: 150,
        featured: false,
        isActive: true
    }
];

// Create events
const createSampleEvents = async () => {
    try {
        console.log('Creating sample events...');
        
        // Clear existing events
        await Event.deleteMany({});
        console.log('Cleared existing events');
        
        // Insert sample events
        const createdEvents = await Event.insertMany(sampleEvents);
        console.log(`Created ${createdEvents.length} sample events`);
        
        // Display created events
        createdEvents.forEach(event => {
            console.log(`✅ ${event.title} - ${event.type} (${event.category})`);
        });
        
        console.log('\n🎉 Sample events created successfully!');
        
    } catch (error) {
        console.error('Error creating sample events:', error);
    } finally {
        process.exit(0);
    }
};

// Run the script
createSampleEvents();
