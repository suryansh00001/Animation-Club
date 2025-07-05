// Sample data for Animation Club website

/*
  SAMPLE LOGIN CREDENTIALS FOR TESTING:
  Email: john.doe@university.edu
  Password: password123
*/

// Fallback images for testing
export const fallbackImages = {
  event: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e5e7eb"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280" font-family="Arial" font-size="16">Event Image</text></svg>',
  workshop: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23fef3c7"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23f59e0b" font-family="Arial" font-size="16">Workshop Image</text></svg>',
  achievement: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23d1fae5"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%2310b981" font-family="Arial" font-size="16">Achievement Image</text></svg>',
  social: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23e0e7ff"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%235b21b6" font-family="Arial" font-size="16">Social Image</text></svg>'
};

export const sampleEvents = [
  {
    _id: "668f1c2d3e4f5a6b7c8d9e0f",
    title: "Annual Animation Festival 2025",
    description: "Join us for our biggest event of the year featuring student animations, workshops, and guest speakers from the animation industry.",
    slug: "annual-animation-festival-2025",
    date: "2025-08-15T00:00:00.000Z",
    deadline: "2025-07-30T23:59:59.000Z",
    status: "upcoming", // upcoming, ongoing, completed, cancelled
    type: "competition", // competition, workshop, seminar, exhibition
    category: ["2d_animation", "3d_animation", "stop_motion", "experimental"],
    registrationRequired: true,
    submissionRequired: true,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
    pricing: {
      registrationFee: 0,
      currency: "USD",
      earlyBirdDiscount: {
        enabled: false,
        discountPercent: 0,
        deadline: null
      }
    },
    prizes: [
      { position: "1st Place", prize: "₹10,000 Cash Prize" },
      { position: "2nd Place", prize: "₹5,000 Cash Prize" },
      { position: "3rd Place", prize: "₹2,500 Cash Prize" }
    ],
    requirements: [
      "Original animation work only",
      "Duration: 30 seconds to 3 minutes",
      "Any animation technique allowed",
      "Submit in MP4 format, 1080p minimum"
    ],
    schedule: {
      submissionOpen: "2025-07-01T00:00:00.000Z",
      submissionClose: "2025-07-30T23:59:59.000Z",
      judging: {
        start: "2025-08-01T00:00:00.000Z",
        end: "2025-08-10T23:59:59.000Z"
      },
      resultsAnnouncement: "2025-08-15T10:00:00.000Z"
    },
    organizers: ["668f1a2b3c4d5e6f7a8b9c0e"],
    judges: ["668f1e2f3a4b5c6d7e8f9a0b", "668f1e2f3a4b5c6d7e8f9a0c"],
    sponsors: ["Animation Studio XYZ", "Creative Software Inc."],
    timestamps: {
      createdAt: "2025-05-01T00:00:00.000Z",
      updatedAt: "2025-06-15T10:00:00.000Z",
      publishedAt: "2025-05-01T09:00:00.000Z"
    }
  },
  {
    _id: "668f1c2d3e4f5a6b7c8d9e1a",
    title: "3D Modeling Workshop",
    description: "Learn the basics of 3D modeling with industry professionals. Hands-on session with Blender and Maya.",
    slug: "3d-modeling-workshop-july-2025",
    date: "2025-07-20T00:00:00.000Z",
    deadline: "2025-07-15T23:59:59.000Z",
    status: "ongoing",
    type: "workshop",
    category: ["3d_modeling", "blender", "maya"],
    registrationRequired: true,
    submissionRequired: false,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
    pricing: {
      registrationFee: 25.00,
      currency: "USD",
      earlyBirdDiscount: {
        enabled: true,
        discountPercent: 20,
        deadline: "2025-07-10T23:59:59.000Z"
      }
    },
    instructors: [
      {
        name: "Prof. Sarah Johnson",
        bio: "Industry veteran with 15 years experience at Pixar and DreamWorks",
        specialization: "3D Character Modeling",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80"
      }
    ],
    duration: "3 days",
    schedule: {
      sessions: [
        {
          day: 1,
          date: "2025-07-20",
          time: "10:00-16:00",
          topic: "Blender Basics & Interface",
          activities: ["Tool overview", "Basic modeling", "Hands-on practice"]
        },
        {
          day: 2,
          date: "2025-07-21",
          time: "10:00-16:00",
          topic: "Advanced Modeling Techniques",
          activities: ["Subdivision modeling", "Character creation", "UV mapping"]
        },
        {
          day: 3,
          date: "2025-07-22",
          time: "10:00-16:00",
          topic: "Maya Fundamentals & Project",
          activities: ["Maya interface", "Final project", "Portfolio review"]
        }
      ]
    },
    capacity: {
      max: 30,
      current: 22,
      waitlist: 5
    },
    prerequisites: ["Basic computer skills", "Own laptop recommended"],
    materials: ["Blender (free download)", "Maya (student license provided)"],
    location: {
      type: "in_person",
      venue: "Animation Lab, Building A, Room 301",
      address: "University Campus, Animation Department",
      coordinates: null
    },
    organizers: ["668f1a2b3c4d5e6f7a8b9c0e"],
    timestamps: {
      createdAt: "2025-06-01T00:00:00.000Z",
      updatedAt: "2025-07-01T14:30:00.000Z",
      publishedAt: "2025-06-01T09:00:00.000Z"
    }
  },
  {
    _id: "668f1c2d3e4f5a6b7c8d9e1b",
    title: "Stop Motion Animation Contest",
    description: "Create amazing stop motion animations using everyday objects. Perfect for beginners and experts alike.",
    slug: "stop-motion-contest-2025",
    date: "2025-06-10",
    deadline: "2025-05-25",
    status: "completed",
    type: "competition",
    category: ["stop_motion", "practical_effects"],
    registrationRequired: true,
    submissionRequired: true,
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
    pricing: {
      registrationFee: 0,
      currency: "USD",
      earlyBirdDiscount: {
        enabled: false,
        discountPercent: 0,
        deadline: null
      }
    },
    results: {
      winners: [
        { 
          rank: 1, 
          participant: "John Doe",
          userId: "668f1a2b3c4d5e6f7a8b9c0d",
          submissionId: "668f1d2e3f4a5b6c7d8e9f0a",
          title: "My Stop Motion Adventure",
          prize: "Best Overall"
        },
        { 
          rank: 2, 
          participant: "Jane Smith",
          userId: "668f1a2b3c4d5e6f7a8b9c0f",
          submissionId: "668f1d2e3f4a5b6c7d8e9f0c",
          title: "Object Stories",
          prize: "Most Creative"
        },
        { 
          rank: 3, 
          participant: "Mike Wilson",
          userId: "668f1a2b3c4d5e6f7a8b9c1a",
          submissionId: "668f1d2e3f4a5b6c7d8e9f0d",
          title: "Kitchen Chronicles",
          prize: "Technical Excellence"
        }
      ],
      totalSubmissions: 15,
      judgedBy: ["668f1e2f3a4b5c6d7e8f9a0b"],
      judgingCriteria: ["Creativity", "Technical Skill", "Storytelling", "Use of Objects"]
    },
    requirements: [
      "Use only everyday household objects",
      "Duration: 15 seconds to 2 minutes",
      "Original soundtrack encouraged",
      "Submit in MP4 format"
    ],
    organizers: ["668f1a2b3c4d5e6f7a8b9c0e"],
    judges: ["668f1e2f3a4b5c6d7e8f9a0b"],
    timestamps: {
      createdAt: "2025-04-01T00:00:00.000Z",
      updatedAt: "2025-06-10T18:00:00.000Z",
      publishedAt: "2025-04-01T09:00:00.000Z",
      completedAt: "2025-06-10T18:00:00.000Z"
    }
  }
];

// Sample gallery images - replace these with your actual gallery data
export const galleryImages = [
  {
    _id: "668f1f2a3b4c5d6e7f8a9b0c",
    title: "Animation Festival 2024 Opening Ceremony",
    description: "Students and faculty gathered for the grand opening of our annual animation festival.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    category: "event",
    tags: ["festival", "ceremony", "students", "faculty"],
    eventId: "668f1c2d3e4f5a6b7c8d9e0e",
    uploadedBy: "668f1a2b3c4d5e6f7a8b9c0e",
    metadata: {
      photographer: "Animation Club Photography Team",
      camera: "Canon EOS R5",
      location: "Main Auditorium",
      resolution: "4000x2668",
      fileSize: 2845612
    },
    timestamps: {
      takenAt: '2024-08-15T10:30:00.000Z',
      uploadedAt: '2024-08-16T09:15:00.000Z',
      updatedAt: '2024-08-16T09:15:00.000Z'
    },
    isPublic: true,
    featured: true
  },
  {
    _id: "668f1f2a3b4c5d6e7f8a9b0d",
    title: "3D Workshop in Progress",
    description: "Students learning advanced 3D modeling techniques during our monthly workshop.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    category: "workshop",
    tags: ["3d", "modeling", "workshop", "learning"],
    eventId: "668f1c2d3e4f5a6b7c8d9e1a",
    uploadedBy: "668f1a2b3c4d5e6f7a8b9c0e",
    metadata: {
      photographer: "Prof. Sarah Johnson",
      location: "Animation Lab, Room 301",
      resolution: "3840x2160",
      fileSize: 1945823
    },
    timestamps: {
      takenAt: '2024-07-20T14:22:00.000Z',
      uploadedAt: '2024-07-21T08:30:00.000Z',
      updatedAt: '2024-07-21T08:30:00.000Z'
    },
    isPublic: true,
    featured: false
  },
  {
    _id: "668f1f2a3b4c5d6e7f8a9b0e",
    title: "Award Ceremony 2024",
    description: "Celebrating our talented members and their outstanding achievements in animation.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
    category: "achievement",
    tags: ["awards", "ceremony", "achievements", "celebration"],
    eventId: null,
    uploadedBy: "668f1a2b3c4d5e6f7a8b9c0e",
    metadata: {
      photographer: "University Media Team",
      location: "Grand Hall",
      resolution: "4096x2732",
      fileSize: 3254789
    },
    timestamps: {
      takenAt: '2024-09-05T19:45:00.000Z',
      uploadedAt: '2024-09-06T10:00:00.000Z',
      updatedAt: '2024-09-06T10:00:00.000Z'
    },
    isPublic: true,
    featured: true
  },
  {
    _id: "668f1f2a3b4c5d6e7f8a9b0f",
    title: "Club Team Building Event",
    description: "Fun team building activities to strengthen bonds among club members.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    category: "social",
    tags: ["team building", "social", "fun", "bonding"],
    eventId: null,
    uploadedBy: "668f1a2b3c4d5e6f7a8b9c0e",
    metadata: {
      photographer: "Club Members",
      location: "University Park",
      resolution: "3024x2016",
      fileSize: 1823456
    },
    timestamps: {
      takenAt: '2024-06-15T15:30:00.000Z',
      uploadedAt: '2024-06-16T11:20:00.000Z',
      updatedAt: '2024-06-16T11:20:00.000Z'
    },
    isPublic: true,
    featured: false
  }
];

export const achievements = [
  {
    _id: "668f1a2b3c4d5e6f7a8b9c1f",
    title: "National Animation Contest Winner",
    description: "Our club won 1st place in the National Student Animation Contest with 'The Digital Dream' project.",
    award: "Gold Medal",
    level: "national", // local, regional, national, international
    category: "competition",
    project: {
      title: "The Digital Dream",
      participants: [
        {
          userId: "668f1a2b3c4d5e6f7a8b9c0d",
          name: "John Doe",
          role: "Director/Animator"
        },
        {
          userId: "668f1a2b3c4d5e6f7a8b9c0f",
          name: "Jane Smith", 
          role: "Character Designer"
        }
      ],
      description: "A groundbreaking 3D animated short exploring AI consciousness",
      duration: 240,
      techniques: ["3d_animation", "motion_capture", "procedural_generation"]
    },
    organization: {
      name: "National Student Animation Society",
      website: "https://nsas.org",
      location: "Los Angeles, CA"
    },
    competition: {
      totalParticipants: 150,
      totalClubs: 45,
      judgingCriteria: ["Technical Excellence", "Storytelling", "Innovation", "Artistic Merit"]
    },
    media: {
      image: "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=800&q=80",
      projectVideo: "https://example.com/videos/digital-dream-trailer.mp4",
      certificate: "https://example.com/certificates/nsas-2024-winner.pdf",
      pressRelease: "https://example.com/press/digital-dream-wins-national.html"
    },
    impact: {
      mediaAppearances: 3,
      scholarshipsAwarded: 2,
      industryRecognition: ["Featured on Animation Magazine", "Pixar Talent Scout Recognition"]
    },
    timestamps: {
      eventDate: '2024-11-15T18:00:00.000Z',
      awardedAt: '2024-11-15T19:30:00.000Z',
      addedAt: '2024-11-16T09:00:00.000Z',
      updatedAt: '2024-11-16T09:00:00.000Z'
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2a",
    title: "Best Animation Club Award",
    description: "Recognized as the best animation club in the university for three consecutive years.",
    award: "Excellence Award",
    level: "institutional",
    category: "organizational",
    criteria: {
      memberEngagement: 95,
      eventQuality: 92,
      industryConnections: 88,
      studentSatisfaction: 96,
      overallScore: 93
    },
    recognitionPeriod: {
      years: ["2022", "2023", "2024"],
      consecutiveYears: 3
    },
    achievements: [
      "Highest member retention rate (94%)",
      "Most industry partnerships (12 studios)",
      "Best student project outcomes",
      "Excellence in community outreach"
    ],
    university: {
      name: "University of Creative Arts",
      department: "Digital Media & Animation",
      totalClubs: 45
    },
    media: {
      image: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
      ceremonyVideo: "https://example.com/videos/excellence-award-ceremony.mp4",
      certificate: "https://example.com/certificates/best-club-2024.pdf"
    },
    timestamps: {
      awardedAt: '2024-09-20T15:00:00.000Z',
      addedAt: '2024-09-21T08:30:00.000Z',
      updatedAt: '2024-09-21T08:30:00.000Z'
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2b",
    title: "Industry Partnership Expansion",
    description: "Successfully established partnerships with leading animation studios for internship and mentorship opportunities.",
    award: "Partnership Excellence",
    level: "industry",
    category: "collaboration",
    partnerships: [
      {
        studio: "Pixar Animation Studios",
        type: "Internship Program",
        positions: 5,
        duration: "Summer 2024",
        contactPerson: "Sarah Mitchell",
        benefits: ["Paid internships", "Mentorship", "Portfolio reviews"]
      },
      {
        studio: "DreamWorks Animation", 
        type: "Guest Speaker Series",
        sessions: 4,
        duration: "Academic Year 2024-25",
        contactPerson: "Michael Rodriguez",
        benefits: ["Monthly workshops", "Career guidance", "Industry insights"]
      },
      {
        studio: "Illumination Entertainment",
        type: "Project Collaboration",
        projects: 2,
        duration: "Spring 2024",
        contactPerson: "Emma Thompson",
        benefits: ["Real project experience", "Industry feedback", "Networking"]
      }
    ],
    outcomes: {
      studentsPlaced: 12,
      fullTimeOffers: 3,
      continuingInternships: 7,
      industryMentorships: 15
    },
    media: {
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      partnershipAnnouncement: "https://example.com/news/industry-partnerships-2024.html",
      studentTestimonials: "https://example.com/videos/partnership-testimonials.mp4"
    },
    timestamps: {
      initiatedAt: '2024-08-10T00:00:00.000Z',
      announcedAt: '2024-08-10T14:00:00.000Z',
      addedAt: '2024-08-11T09:00:00.000Z',
      updatedAt: '2024-08-11T09:00:00.000Z'
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2c",
    title: "International Film Festival Selections",
    description: "Three outstanding student films selected for prestigious international animation film festivals.",
    award: "Festival Selection Honor",
    level: "international",
    category: "recognition",
    selections: [
      {
        film: "Underwater Dreams",
        director: "Maya Chen",
        userId: "668f1a2b3c4d5e6f7a8b9c0g",
        festival: "Annecy International Animation Film Festival",
        category: "Student Competition",
        country: "France",
        selectionDate: "2024-06-05",
        screeningDate: "2024-06-15",
        awards: ["Best Student Short - Honorable Mention"]
      },
      {
        film: "Digital Landscapes",
        director: "Alex Rodriguez",
        userId: "668f1a2b3c4d5e6f7a8b9c0h",
        festival: "Ottawa International Animation Festival",
        category: "Student Films",
        country: "Canada",
        selectionDate: "2024-06-05",
        screeningDate: "2024-09-20",
        awards: ["Audience Choice Award"]
      },
      {
        film: "Time Traveler",
        director: "Jordan Thompson",
        userId: "668f1a2b3c4d5e6f7a8b9c0i",
        festival: "Zagreb World Festival of Animated Film",
        category: "Student Competition",
        country: "Croatia",
        selectionDate: "2024-06-05",
        screeningDate: "2024-06-10",
        awards: []
      }
    ],
    statistics: {
      totalSubmissions: 8,
      acceptanceRate: 37.5,
      festivalsAppliedTo: 15,
      totalSelections: 3,
      awardsReceived: 2
    },
    impact: {
      mediaArticles: 5,
      universityFeature: true,
      industryAttention: ["Animation Magazine Feature", "Cartoon Brew Mention"],
      careerOpportunities: 4
    },
    media: {
      image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
      festivalHighlights: "https://example.com/videos/festival-selections-2024.mp4",
      pressKit: "https://example.com/press/international-selections-2024.pdf"
    },
    timestamps: {
      selectionDate: '2024-06-05T00:00:00.000Z',
      announcedAt: '2024-06-06T10:00:00.000Z',
      addedAt: '2024-06-06T15:30:00.000Z',
      updatedAt: '2024-06-06T15:30:00.000Z'
    }
  }
];

export const currentMembers = [
  {
    _id: "668f1a2b3c4d5e6f7a8b9c0e",
    name: "Alex Rodriguez",
    position: "Secretary",
    role: "secretary",
    description: "Leading the club with passion for 2D animation and storytelling. Specializes in character design and narrative development.",
    contactInfo: {
      phone: "+1-555-0101",
      email: "alex.rodriguez@university.edu",
      socialMedia: {
        instagram: "@alexanimator",
        linkedin: "linkedin.com/in/alexrodriguez"
      }
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    specialization: ["2D Animation", "Character Design", "Storytelling"],
    tenure: {
      position: "Secretary",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "4th Year",
      department: "Digital Media Arts",
      studentId: "DMA2021001",
      gpa: 3.85
    },
    clubHistory: [
      {
        position: "Joint Secretary",
        period: "2023-2024",
        achievements: ["Organized 5 successful workshops", "Increased membership by 40%"]
      },
      {
        position: "Core Member",
        period: "2022-2023",
        achievements: ["Led student animation project", "Won regional competition"]
      }
    ],
    achievements: [
      "National Animation Contest Winner 2024",
      "Best Leadership Award 2024",
      "Dean's List 2023-2024"
    ],
    skills: {
      software: ["Adobe Animate", "Toon Boom Harmony", "After Effects", "Photoshop"],
      techniques: ["2D Animation", "Character Design", "Storyboarding", "Motion Graphics"],
      proficiency: {
        animation: 95,
        leadership: 90,
        communication: 88
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2022-09-01T00:00:00.000Z",
      lastActive: "2025-07-01T10:00:00.000Z",
      updatedAt: "2025-06-15T14:30:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c0f",
    name: "Maya Chen",
    position: "Joint Secretary",
    role: "joint-secretary",
    description: "Expert in 3D modeling and animation with experience in industry-standard software like Maya and Blender.",
    contactInfo: {
      phone: "+1-555-0102",
      email: "maya.chen@university.edu",
      socialMedia: {
        instagram: "@maya3d",
        artstation: "artstation.com/mayachen"
      }
    },
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80",
    specialization: ["3D Animation", "Visual Effects", "Technical Animation"],
    tenure: {
      position: "Joint Secretary",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "3rd Year",
      department: "Computer Graphics",
      studentId: "CG2022015",
      gpa: 3.92
    },
    clubHistory: [
      {
        position: "Technical Lead",
        period: "2023-2024",
        achievements: ["Implemented new 3D pipeline", "Mentored 15 students"]
      }
    ],
    achievements: [
      "Best 3D Animation Award 2024",
      "Technical Excellence Recognition",
      "Industry Internship at Pixar 2024"
    ],
    skills: {
      software: ["Maya", "Blender", "ZBrush", "Substance Painter", "Houdini"],
      techniques: ["3D Modeling", "Rigging", "Animation", "VFX", "Procedural Generation"],
      proficiency: {
        modeling: 92,
        animation: 88,
        technical: 95
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2023-09-01T00:00:00.000Z",
      lastActive: "2025-07-01T09:45:00.000Z",
      updatedAt: "2025-06-20T11:15:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c1a",
    name: "Jordan Thompson",
    position: "Joint Secretary",
    role: "joint-secretary",
    description: "Organizes club events and workshops. Passionate about stop motion animation and experimental techniques.",
    contactInfo: {
      phone: "+1-555-0103",
      email: "jordan.thompson@university.edu",
      socialMedia: {
        youtube: "youtube.com/stopmotion_jordan",
        twitter: "@jordanstopmotion"
      }
    },
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    specialization: ["Stop Motion", "Event Management", "Experimental Animation"],
    tenure: {
      position: "Joint Secretary",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "3rd Year",
      department: "Film and Animation",
      studentId: "FA2022028",
      gpa: 3.75
    },
    clubHistory: [
      {
        position: "Event Coordinator",
        period: "2023-2024",
        achievements: ["Organized 12 successful events", "Managed $5000 budget"]
      }
    ],
    achievements: [
      "Best Stop Motion Film 2024",
      "Event Management Excellence",
      "Creative Innovation Award"
    ],
    skills: {
      software: ["Dragonframe", "Stop Motion Studio", "Premiere Pro", "After Effects"],
      techniques: ["Stop Motion", "Event Planning", "Project Management", "Creative Direction"],
      proficiency: {
        stopMotion: 90,
        eventManagement: 85,
        creativity: 92
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2023-09-01T00:00:00.000Z",
      lastActive: "2025-06-30T16:20:00.000Z",
      updatedAt: "2025-06-25T09:30:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c1b",
    name: "Sam Rivera",
    position: "Technical Lead",
    role: "core-member",
    description: "Handles technical aspects of club activities and maintains equipment. Expert in motion capture and digital compositing.",
    contactInfo: {
      phone: "+1-555-0104",
      email: "sam.rivera@university.edu",
      socialMedia: {
        github: "github.com/samtech",
        linkedin: "linkedin.com/in/samrivera"
      }
    },
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    specialization: ["Motion Capture", "Digital Compositing", "Technical Support"],
    tenure: {
      position: "Technical Lead",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "4th Year",
      department: "Computer Science",
      studentId: "CS2021042",
      gpa: 3.88
    },
    clubHistory: [
      {
        position: "Technical Assistant",
        period: "2023-2024",
        achievements: ["Set up motion capture studio", "Maintained all equipment"]
      }
    ],
    achievements: [
      "Technical Innovation Award 2024",
      "Best Technical Support",
      "Motion Capture Specialist Certification"
    ],
    skills: {
      software: ["MotionBuilder", "OptiTrack", "Nuke", "Fusion", "Python"],
      techniques: ["Motion Capture", "Compositing", "Technical Troubleshooting", "Pipeline Development"],
      proficiency: {
        technical: 95,
        motionCapture: 90,
        problemSolving: 93
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2023-09-01T00:00:00.000Z",
      lastActive: "2025-07-01T08:30:00.000Z",
      updatedAt: "2025-06-28T13:45:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c1c",
    name: "Lisa Wang",
    position: "Creative Director",
    role: "core-member",
    type: "core_member",
    description: "Guides creative direction for club projects and mentors new members in animation techniques.",
    contactInfo: {
      phone: "+1-555-0105",
      email: "lisa.wang@university.edu",
      socialMedia: {
        behance: "behance.net/lisawang",
        instagram: "@lisa_creates"
      }
    },
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    specialization: ["Creative Direction", "Mentoring", "Concept Art"],
    tenure: {
      position: "Creative Director",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "4th Year",
      department: "Fine Arts",
      studentId: "FA2021018",
      gpa: 3.95
    },
    clubHistory: [
      {
        position: "Art Director",
        period: "2023-2024",
        achievements: ["Led 8 creative projects", "Mentored 20+ students"]
      }
    ],
    achievements: [
      "Best Creative Vision Award 2024",
      "Outstanding Mentor Recognition",
      "Portfolio Excellence Award"
    ],
    skills: {
      software: ["Photoshop", "Illustrator", "Concept Design Tools", "Miro"],
      techniques: ["Concept Art", "Creative Direction", "Mentoring", "Art Direction"],
      proficiency: {
        creativity: 98,
        mentoring: 92,
        artDirection: 95
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2022-09-01T00:00:00.000Z",
      lastActive: "2025-06-30T17:15:00.000Z",
      updatedAt: "2025-06-22T10:20:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2b",
    name: "Sophie Martinez",
    position: "Technical Lead",
    role: "core-member",
    type: "core_member",
    description: "Leads technical workshops and manages our software and hardware resources. Expert in motion graphics and visual effects.",
    contactInfo: {
      phone: "+1-555-0104",
      email: "sophie.martinez@university.edu",
      socialMedia: {
        github: "github.com/sophietech",
        linkedin: "linkedin.com/in/sophiemartinez"
      }
    },
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    specialization: ["Motion Graphics", "Visual Effects", "Technical Support"],
    tenure: {
      position: "Technical Lead",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "4th Year",
      department: "Computer Science",
      studentId: "CS2021045",
      gpa: 3.88
    },
    achievements: [
      "Best Motion Graphics Award 2024",
      "Technical Innovation Recognition",
      "Outstanding Mentor Award"
    ],
    skills: {
      software: ["After Effects", "Cinema 4D", "Nuke", "DaVinci Resolve"],
      techniques: ["Motion Graphics", "VFX", "Compositing", "Color Grading"],
      proficiency: {
        technical: 95,
        teaching: 88,
        creativity: 85
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2022-09-01T00:00:00.000Z",
      lastActive: "2025-07-01T14:20:00.000Z",
      updatedAt: "2025-06-28T16:45:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2c",
    name: "Ryan Kumar",
    position: "Workshop Coordinator",
    role: "core-member",
    type: "core_member",
    description: "Organizes and conducts weekly workshops. Specializes in character animation and rigging techniques.",
    contactInfo: {
      phone: "+1-555-0105",
      email: "ryan.kumar@university.edu",
      socialMedia: {
        instagram: "@ryananimates",
        youtube: "youtube.com/ryananimationworkshop"
      }
    },
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    specialization: ["Character Animation", "Rigging", "Workshop Teaching"],
    tenure: {
      position: "Workshop Coordinator",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "3rd Year",
      department: "Animation Arts",
      studentId: "AA2022067",
      gpa: 3.79
    },
    achievements: [
      "Excellence in Teaching Award 2024",
      "Character Animation Specialist",
      "Student Favorite Instructor"
    ],
    skills: {
      software: ["Maya", "Blender", "Adobe Animate", "MotionBuilder"],
      techniques: ["Character Animation", "Rigging", "Teaching", "Mentoring"],
      proficiency: {
        animation: 90,
        teaching: 92,
        rigging: 87
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2022-09-01T00:00:00.000Z",
      lastActive: "2025-07-01T11:30:00.000Z",
      updatedAt: "2025-06-29T13:15:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2g",
    name: "Priya Patel",
    position: "Creative Director",
    role: "core-member",
    type: "core_member",
    description: "Oversees creative projects and maintains the artistic vision of the club. Expert in storyboarding and concept art.",
    contactInfo: {
      phone: "+1-555-0106",
      email: "priya.patel@university.edu",
      socialMedia: {
        artstation: "artstation.com/priyacreates",
        instagram: "@priyaconceptart"
      }
    },
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80",
    specialization: ["Concept Art", "Storyboarding", "Art Direction"],
    tenure: {
      position: "Creative Director",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "4th Year",
      department: "Visual Arts",
      studentId: "VA2021089",
      gpa: 3.91
    },
    achievements: [
      "Best Concept Art Award 2024",
      "Creative Leadership Excellence",
      "National Portfolio Recognition"
    ],
    skills: {
      software: ["Photoshop", "Illustrator", "Procreate", "Storyboard Pro"],
      techniques: ["Concept Art", "Storyboarding", "Character Design", "Environment Design"],
      proficiency: {
        conceptArt: 94,
        storyboarding: 91,
        leadership: 87
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2022-09-01T00:00:00.000Z",
      lastActive: "2025-07-01T15:45:00.000Z",
      updatedAt: "2025-06-30T09:30:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2h",
    name: "Marcus Johnson",
    position: "Social Media Manager",
    role: "core-member",
    type: "core_member",
    description: "Manages our online presence and creates engaging content for social media platforms. Expert in digital marketing for creative communities.",
    contactInfo: {
      phone: "+1-555-0107",
      email: "marcus.johnson@university.edu",
      socialMedia: {
        instagram: "@marcusdigital",
        tiktok: "@animationclubofficial"
      }
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    specialization: ["Social Media", "Digital Marketing", "Content Creation"],
    tenure: {
      position: "Social Media Manager",
      period: "2024-2025",
      startDate: "2024-09-01T00:00:00.000Z",
      endDate: "2025-08-31T23:59:59.000Z"
    },
    academic: {
      year: "2nd Year",
      department: "Digital Communications",
      studentId: "DC2023112",
      gpa: 3.82
    },
    achievements: [
      "Social Media Growth Award 2024",
      "Best Content Creator",
      "Digital Innovation Recognition"
    ],
    skills: {
      software: ["Canva", "Adobe Creative Suite", "Hootsuite", "Analytics Tools"],
      techniques: ["Content Strategy", "Community Management", "Brand Development", "Analytics"],
      proficiency: {
        socialMedia: 93,
        contentCreation: 89,
        analytics: 85
      }
    },
    isActive: true,
    timestamps: {
      joinedClub: "2023-09-01T00:00:00.000Z",
      lastActive: "2025-07-01T18:20:00.000Z",
      updatedAt: "2025-07-01T08:15:00.000Z"
    }
  }
];

export const previousMembers = [
  // 2023-2024 Leadership
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2d",
    name: "Emily Davis",
    position: "Secretary",
    role: "secretary",
    type: "previous_secretary",
    tenure: {
      position: "Secretary",
      period: "2023-2024",
      startDate: "2023-09-01T00:00:00.000Z",
      endDate: "2024-08-31T23:59:59.000Z"
    },
    career: {
      currentRole: "Animation Director at Studio XYZ",
      company: "Studio XYZ",
      location: "Los Angeles, CA",
      startDate: "2024-09-15T00:00:00.000Z",
      salary: "$85,000"
    },
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    specialization: ["2D Animation", "Leadership", "Team Management"],
    clubAchievements: [
      "Increased club membership by 60%",
      "Established industry partnerships",
      "Led winning animation festival team",
      "Implemented mentorship program"
    ],
    academic: {
      graduationYear: 2024,
      department: "Digital Media Arts",
      degree: "Bachelor of Fine Arts",
      finalGPA: 3.89,
      honors: ["Magna Cum Laude", "Dean's List"]
    },
    contactInfo: {
      email: "emily.davis.alumni@university.edu",
      linkedin: "linkedin.com/in/emilydavis-animator",
      portfolio: "emilydavis.com"
    },
    mentorship: {
      availableForMentoring: true,
      expertise: ["Career Guidance", "Industry Connections", "Leadership Development"],
      contactPreference: "LinkedIn"
    },
    timestamps: {
      joinedClub: "2021-09-01T00:00:00.000Z",
      graduatedClub: "2024-08-31T00:00:00.000Z",
      lastUpdated: "2025-01-15T10:30:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2e",
    name: "Michael Chang",
    position: "Joint Secretary",
    role: "joint-secretary",
    type: "previous_secretary",
    tenure: {
      position: "Joint Secretary",
      period: "2023-2024",
      startDate: "2023-09-01T00:00:00.000Z",
      endDate: "2024-08-31T23:59:59.000Z"
    },
    career: {
      currentRole: "Lead Animator at Creative Studios",
      company: "Creative Studios",
      location: "San Francisco, CA",
      startDate: "2024-08-01T00:00:00.000Z",
      salary: "$78,000"
    },
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    specialization: ["3D Animation", "Technical Direction", "Pipeline Development"],
    clubAchievements: [
      "Developed 3D animation curriculum",
      "Led technical workshops",
      "Mentored 25+ students",
      "Won national 3D competition"
    ],
    academic: {
      graduationYear: 2024,
      department: "Computer Graphics",
      degree: "Bachelor of Science",
      finalGPA: 3.92,
      honors: ["Summa Cum Laude", "Outstanding Student Award"]
    },
    contactInfo: {
      email: "michael.chang.alumni@university.edu",
      linkedin: "linkedin.com/in/michaelchang3d",
      portfolio: "michaelchang3d.artstation.com"
    },
    mentorship: {
      availableForMentoring: true,
      expertise: ["3D Animation", "Technical Skills", "Industry Preparation"],
      contactPreference: "Email"
    },
    timestamps: {
      joinedClub: "2021-09-01T00:00:00.000Z",
      graduatedClub: "2024-08-31T00:00:00.000Z",
      lastUpdated: "2025-02-01T14:20:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c2f",
    name: "Sofia Martinez",
    position: "Joint Secretary",
    role: "joint-secretary", 
    type: "previous_secretary",
    tenure: {
      position: "Joint Secretary",
      period: "2023-2024",
      startDate: "2023-09-01T00:00:00.000Z",
      endDate: "2024-08-31T23:59:59.000Z"
    },
    career: {
      currentRole: "VFX Artist at Digital Dreams",
      company: "Digital Dreams",
      location: "Vancouver, BC",
      startDate: "2024-09-01T00:00:00.000Z",
      salary: "$72,000 CAD"
    },
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    specialization: ["Visual Effects", "Motion Graphics", "Compositing"],
    clubAchievements: [
      "Created award-winning VFX project",
      "Organized international exchange program",
      "Led diversity and inclusion initiatives",
      "Established scholarship fund"
    ],
    academic: {
      graduationYear: 2024,
      department: "Digital Media Production",
      degree: "Bachelor of Arts",
      finalGPA: 3.87,
      honors: ["Dean's List", "VFX Excellence Award"]
    },
    contactInfo: {
      email: "sofia.martinez.alumni@university.edu",
      linkedin: "linkedin.com/in/sofiamartinez-vfx",
      portfolio: "sofiamartinez.com"
    },
    mentorship: {
      availableForMentoring: true,
      expertise: ["VFX Career Path", "International Opportunities", "Work-Life Balance"],
      contactPreference: "LinkedIn"
    },
    timestamps: {
      joinedClub: "2022-01-15T00:00:00.000Z",
      graduatedClub: "2024-08-31T00:00:00.000Z",
      lastUpdated: "2025-01-20T09:45:00.000Z"
    }
  },
  
  // 2022-2023 Leadership
  {
    _id: "668f1a2b3c4d5e6f7a8b9c3a",
    name: "David Kim",
    position: "Secretary",
    role: "secretary",
    type: "previous_secretary",
    tenure: {
      position: "Secretary",
      period: "2022-2023",
      startDate: "2022-09-01T00:00:00.000Z",
      endDate: "2023-08-31T23:59:59.000Z"
    },
    career: {
      currentRole: "Senior Animator at Pixar Animation Studios",
      company: "Pixar Animation Studios",
      location: "Emeryville, CA",
      startDate: "2023-07-01T00:00:00.000Z",
      salary: "$110,000"
    },
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    specialization: ["Character Animation", "Storytelling", "Feature Film Production"],
    clubAchievements: [
      "Led club to national recognition",
      "Established Pixar partnership",
      "Created alumni network",
      "Won multiple film festival awards"
    ],
    academic: {
      graduationYear: 2023,
      department: "Animation and Digital Arts",
      degree: "Bachelor of Fine Arts",
      finalGPA: 3.96,
      honors: ["Summa Cum Laude", "Valedictorian", "Outstanding Achievement in Animation"]
    },
    contactInfo: {
      email: "david.kim.alumni@university.edu",
      linkedin: "linkedin.com/in/davidkim-pixar",
      portfolio: "davidkim-animation.com"
    },
    mentorship: {
      availableForMentoring: true,
      expertise: ["Feature Film Animation", "Pixar Culture", "Advanced Character Animation"],
      contactPreference: "Portfolio Website"
    },
    timestamps: {
      joinedClub: "2020-09-01T00:00:00.000Z",
      graduatedClub: "2023-08-31T00:00:00.000Z",
      lastUpdated: "2024-12-15T16:30:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c3b",
    name: "Rachel Green",
    position: "Joint Secretary",
    role: "joint-secretary",
    type: "previous_secretary",
    tenure: {
      position: "Joint Secretary",
      period: "2022-2023",
      startDate: "2022-09-01T00:00:00.000Z",
      endDate: "2023-08-31T23:59:59.000Z"
    },
    career: {
      currentRole: "Art Director at DreamWorks Animation",
      company: "DreamWorks Animation",
      location: "Glendale, CA",
      startDate: "2023-08-15T00:00:00.000Z",
      salary: "$95,000"
    },
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=400&q=80",
    specialization: ["Art Direction", "Concept Design", "Visual Development"],
    clubAchievements: [
      "Revolutionized visual standards",
      "Led concept art workshops",
      "Established art scholarship",
      "Created visual identity guidelines"
    ],
    academic: {
      graduationYear: 2023,
      department: "Concept Art and Illustration",
      degree: "Bachelor of Fine Arts",
      finalGPA: 3.91,
      honors: ["Magna Cum Laude", "Art Director's Choice Award"]
    },
    contactInfo: {
      email: "rachel.green.alumni@university.edu",
      linkedin: "linkedin.com/in/rachelgreen-artdirector",
      portfolio: "rachelgreen-art.com"
    },
    mentorship: {
      availableForMentoring: true,
      expertise: ["Art Direction", "Concept Development", "Studio Art Department"],
      contactPreference: "Email"
    },
    timestamps: {
      joinedClub: "2020-09-01T00:00:00.000Z",
      graduatedClub: "2023-08-31T00:00:00.000Z",
      lastUpdated: "2024-11-20T11:15:00.000Z"
    }
  },
  {
    _id: "668f1a2b3c4d5e6f7a8b9c3c",
    name: "James Wilson",
    position: "Joint Secretary",
    role: "joint-secretary",
    type: "previous_secretary",
    tenure: {
      position: "Joint Secretary",
      period: "2022-2023",
      startDate: "2022-09-01T00:00:00.000Z",
      endDate: "2023-08-31T23:59:59.000Z"
    },
    career: {
      currentRole: "Technical Director at Blue Sky Studios",
      company: "Blue Sky Studios",
      location: "Greenwich, CT",
      startDate: "2023-06-01T00:00:00.000Z",
      salary: "$88,000"
    },
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    specialization: ["Technical Animation", "Pipeline Development", "Tool Creation"],
    clubAchievements: [
      "Built automation pipeline",
      "Created custom animation tools",
      "Led technical training program",
      "Optimized rendering workflows"
    ],
    academic: {
      graduationYear: 2023,
      department: "Computer Science with Animation Focus",
      degree: "Bachelor of Science",
      finalGPA: 3.94,
      honors: ["Summa Cum Laude", "Technical Innovation Award"]
    },
    contactInfo: {
      email: "james.wilson.alumni@university.edu",
      linkedin: "linkedin.com/in/jameswilson-td",
      github: "github.com/jwilson-animation"
    },
    mentorship: {
      availableForMentoring: true,
      expertise: ["Technical Direction", "Pipeline Programming", "Animation Technology"],
      contactPreference: "LinkedIn"
    },
    timestamps: {
      joinedClub: "2020-09-01T00:00:00.000Z",
      graduatedClub: "2023-08-31T00:00:00.000Z",
      lastUpdated: "2024-10-05T13:20:00.000Z"
    }
  }
];

export const announcements = [
  {
    _id: "668f1h2i3j4k5l6m7n8o9p0a",
    title: "New Workshop Series Announced!",
    message: "We're excited to announce our new monthly workshop series featuring industry professionals. Registration opens next week!",
    date: "2025-07-01",
    type: "workshop",
    priority: "high",
    active: true
  },
  {
    _id: "668f1h2i3j4k5l6m7n8o9p0b",
    title: "Animation Festival 2025 Registration Open",
    message: "Registration for our annual animation festival is now open! Don't miss this opportunity to showcase your work.",
    date: "2025-06-25",
    type: "event",
    priority: "urgent",
    active: true
  }
];

export const socialMediaLinks = {
  instagram: "https://instagram.com/animationclub",
  youtube: "https://youtube.com/animationclub",
  twitter: "https://twitter.com/animationclub",
  facebook: "https://facebook.com/animationclub",
  email: "animation.fmcweekend@gmail.com"
};

export const clubInfo = {
  name: "University Animation Club",
  established: "2020",
  description: "A creative community dedicated to the art and craft of animation, bringing together students passionate about storytelling through motion.",
  vision: "To foster creativity, innovation, and excellence in animation while building a supportive community of aspiring animators.",
  mission: "To provide learning opportunities, industry connections, and creative platforms for students interested in animation and visual storytelling."
};

// Mock user data for authentication (MongoDB optimized)
export const mockUserData = {
  _id: "668f1a2b3c4d5e6f7a8b9c0d", // MongoDB ObjectId format
  name: 'John Doe',
  email: 'john.doe@university.edu',
  password: 'password123', // Sample password for testing
  phone: '+1 (555) 123-4567',
  studentId: 'ST2023001',
  year: '3rd Year',
  department: 'Computer Science',
  experience: 'Intermediate',
  avatar: 'https://ui-avatars.com/api/?name=John Doe&background=7c3aed&color=fff',
  isActive: true,
  role: 'student',
  profile: {
    bio: 'Passionate animation student exploring 2D and 3D techniques.',
    interests: ['2D Animation', '3D Modeling', 'Character Design'],
    portfolio: null,
    socialLinks: {
      instagram: null,
      twitter: null,
      linkedin: null
    }
  },
  preferences: {
    notifications: {
      email: true,
      push: true,
      eventReminders: true
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      profileVisibility: 'public'
    }
  },
  timestamps: {
    createdAt: "2023-09-01T00:00:00.000Z",
    updatedAt: "2025-06-01T10:30:00.000Z",
    lastLoginAt: "2025-07-01T08:15:00.000Z"
  }
};

// Sample user registration data (MongoDB optimized)
export const sampleUserRegistrations = [
  {
    _id: "668f1b2c3d4e5f6a7b8c9d0e",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f", // Reference to event ObjectId
    userId: "668f1a2b3c4d5e6f7a8b9c0d", // Reference to user ObjectId
    participantDetails: {
      name: 'John Doe',
      email: 'john.doe@university.edu',
      phone: '+1 (555) 123-4567',
      department: 'Computer Science',
      year: '3rd Year',
      experience: 'Intermediate',
      studentId: 'ST2023001'
    },
    registrationData: {
      motivation: 'I want to improve my animation skills and learn from industry professionals.',
      previousExperience: 'Created several short animations using Blender and After Effects.',
      expectations: 'Learn advanced techniques and network with fellow animators.',
      additionalInfo: null
    },
    status: 'confirmed', // pending, confirmed, cancelled, waitlisted
    paymentStatus: 'completed', // pending, completed, failed, refunded
    paymentDetails: {
      amount: 0, // Free event
      currency: 'USD',
      transactionId: null,
      paymentMethod: null
    },
    timestamps: {
      registeredAt: "2025-06-15T10:30:00.000Z",
      confirmedAt: "2025-06-15T10:35:00.000Z",
      updatedAt: "2025-06-15T10:35:00.000Z"
    },
    metadata: {
      source: 'website',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  },
  {
    _id: "668f1b2c3d4e5f6a7b8c9d0f",
    eventId: "668f1c2d3e4f5a6b7c8d9e1a", // Reference to workshop event
    userId: "668f1a2b3c4d5e6f7a8b9c0d",
    participantDetails: {
      name: 'John Doe',
      email: 'john.doe@university.edu',
      phone: '+1 (555) 123-4567',
      department: 'Computer Science',
      year: '3rd Year',
      experience: 'Intermediate',
      studentId: 'ST2023001'
    },
    registrationData: {
      motivation: 'Want to learn 3D modeling techniques for my animation projects.',
      softwareExperience: ['Blender (Basic)', 'Maya (Beginner)'],
      expectations: 'Hands-on experience with professional 3D tools.',
      additionalInfo: 'Have my own laptop for the workshop.'
    },
    status: 'confirmed',
    paymentStatus: 'completed',
    paymentDetails: {
      amount: 25.00,
      currency: 'USD',
      transactionId: 'txn_abc123xyz789',
      paymentMethod: 'credit_card'
    },
    timestamps: {
      registeredAt: "2025-07-01T09:15:00.000Z",
      confirmedAt: "2025-07-01T09:20:00.000Z",
      updatedAt: "2025-07-01T09:20:00.000Z"
    },
    metadata: {
      source: 'website',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  }
];

// Sample user submission data (MongoDB optimized)
export const sampleUserSubmissions = [
  {
    _id: "668f1d2e3f4a5b6c7d8e9f0a",
    eventId: "668f1c2d3e4f5a6b7c8d9e1b", // Reference to stop motion contest
    userId: "668f1a2b3c4d5e6f7a8b9c0d", // Reference to user ObjectId
    submissionDetails: {
      title: 'My Stop Motion Adventure',
      description: 'A creative stop motion animation using everyday objects to tell a story about friendship between a pencil and an eraser.',
      category: 'stop_motion',
      duration: 120, // Duration in seconds
      techniques: ['stop_motion', 'practical_effects', 'lighting'],
      software: ['Dragonframe', 'After Effects', 'Premiere Pro']
    },
    files: {
      primary: {
        filename: 'my-stop-motion-adventure.mp4',
        url: 'https://example.com/submissions/my-stop-motion-adventure.mp4',
        fileSize: 45678912, // Size in bytes
        mimeType: 'video/mp4',
        duration: 120,
        resolution: '1920x1080',
        checksum: 'sha256:a1b2c3d4e5f6...'
      },
      thumbnails: [
        {
          filename: 'thumbnail_small.jpg',
          url: 'https://example.com/submissions/thumbnails/small_my-stop-motion.jpg',
          size: '320x180'
        },
        {
          filename: 'thumbnail_large.jpg',
          url: 'https://example.com/submissions/thumbnails/large_my-stop-motion.jpg',
          size: '1280x720'
        }
      ],
      additional: [
        {
          filename: 'behind_the_scenes.jpg',
          url: 'https://example.com/submissions/bts_my-stop-motion.jpg',
          description: 'Behind the scenes setup photo',
          mimeType: 'image/jpeg'
        }
      ]
    },
    participantInfo: {
      name: 'John Doe',
      email: 'john.doe@university.edu',
      studentId: 'ST2023001',
      department: 'Computer Science',
      year: '3rd Year'
    },
    submissionMetadata: {
      originalFilename: 'final_animation_v3.mp4',
      uploadProgress: 100,
      processingStatus: 'completed', // pending, processing, completed, failed
      virusScanStatus: 'clean', // pending, clean, infected
      moderationStatus: 'approved', // pending, approved, rejected
      moderationNotes: null
    },
    evaluation: {
      status: 'evaluated', // pending, in_review, evaluated
      scores: {
        creativity: 8.5,
        technique: 7.8,
        storytelling: 9.2,
        overall: 8.5
      },
      feedback: 'Excellent storytelling with creative use of everyday objects. Technical execution could be improved.',
      judgeId: "668f1e2f3a4b5c6d7e8f9a0b",
      rank: 1,
      awards: ['1st Place', 'Best Storytelling']
    },
    status: 'submitted', // draft, submitted, under_review, accepted, rejected
    timestamps: {
      createdAt: "2025-05-18T16:30:00.000Z",
      submittedAt: "2025-05-20T14:45:00.000Z",
      lastModifiedAt: "2025-05-20T14:45:00.000Z",
      evaluatedAt: "2025-06-10T11:20:00.000Z"
    },
    version: {
      current: 1,
      history: [
        {
          version: 1,
          timestamp: "2025-05-20T14:45:00.000Z",
          changes: 'Initial submission',
          fileChecksum: 'sha256:a1b2c3d4e5f6...'
        }
      ]
    }
  },
  {
    _id: "668f1d2e3f4a5b6c7d8e9f0b",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f", // Reference to animation festival
    userId: "668f1a2b3c4d5e6f7a8b9c0d",
    submissionDetails: {
      title: 'Digital Dreams',
      description: 'A 2D animated short exploring the intersection of technology and imagination in modern society.',
      category: '2d_animation',
      duration: 180,
      techniques: ['traditional_2d', 'digital_painting', 'compositing'],
      software: ['Toon Boom Harmony', 'Photoshop', 'After Effects']
    },
    files: {
      primary: {
        filename: 'digital-dreams.mp4',
        url: 'https://example.com/submissions/digital-dreams.mp4',
        fileSize: 78901234,
        mimeType: 'video/mp4',
        duration: 180,
        resolution: '1920x1080',
        checksum: 'sha256:b2c3d4e5f6a7...'
      },
      thumbnails: [
        {
          filename: 'digital_dreams_thumb.jpg',
          url: 'https://example.com/submissions/thumbnails/digital_dreams.jpg',
          size: '1280x720'
        }
      ],
      additional: [
        {
          filename: 'concept_art.pdf',
          url: 'https://example.com/submissions/concept_art_digital_dreams.pdf',
          description: 'Original concept sketches and storyboard',
          mimeType: 'application/pdf'
        }
      ]
    },
    participantInfo: {
      name: 'John Doe',
      email: 'john.doe@university.edu',
      studentId: 'ST2023001',
      department: 'Computer Science',
      year: '3rd Year'
    },
    submissionMetadata: {
      originalFilename: 'digital_dreams_final_export.mp4',
      uploadProgress: 100,
      processingStatus: 'completed',
      virusScanStatus: 'clean',
      moderationStatus: 'pending',
      moderationNotes: null
    },
    evaluation: {
      status: 'pending',
      scores: null,
      feedback: null,
      judgeId: null,
      rank: null,
      awards: []
    },
    status: 'submitted',
    timestamps: {
      createdAt: "2025-07-01T10:00:00.000Z",
      submittedAt: "2025-07-01T15:30:00.000Z",
      lastModifiedAt: "2025-07-01T15:30:00.000Z",
      evaluatedAt: null
    },
    version: {
      current: 2,
      history: [
        {
          version: 1,
          timestamp: "2025-07-01T10:00:00.000Z",
          changes: 'Initial draft upload',
          fileChecksum: 'sha256:x1y2z3a4b5c6...'
        },
        {
          version: 2,
          timestamp: "2025-07-01T15:30:00.000Z",
          changes: 'Final version with improved audio mix',
          fileChecksum: 'sha256:b2c3d4e5f6a7...'
        }
      ]
    }
  }
];

// Sample artworks data for the new Artworks page
export const sampleArtworks = [
  {
    _id: "artwork1",
    title: "Dancing Robot",
    artist: "Sarah Chen",
    category: "3d",
    description: "A fun 3D animation featuring a robot dancing to electronic music. Created as part of my final project for Advanced 3D Animation class.",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=300&q=80",
    createdDate: "2024-12-01T00:00:00.000Z",
    tools: ["Blender", "After Effects", "Photoshop"],
    duration: "45 seconds",
    resolution: "1920x1080"
  },
  {
    _id: "artwork2",
    title: "Forest Walk",
    artist: "Mike Johnson",
    category: "2d",
    description: "A peaceful 2D animated scene of a character walking through an enchanted forest. Hand-drawn frame by frame.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&q=80",
    createdDate: "2024-11-28T00:00:00.000Z",
    tools: ["TVPaint", "Photoshop"],
    duration: "1 minute 30 seconds",
    resolution: "1920x1080"
  },
  {
    _id: "artwork3",
    title: "Character Design Study",
    artist: "Emma Rodriguez",
    category: "illustration",
    description: "Character design exploration for an upcoming animated short. Multiple poses and expressions of the main character.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
    createdDate: "2024-11-25T00:00:00.000Z",
    tools: ["Procreate", "Photoshop"],
    resolution: "2048x2048"
  },
  {
    _id: "artwork4",
    title: "Product Launch Intro",
    artist: "Alex Kim",
    category: "motion",
    description: "Motion graphics piece created for a fictional product launch. Features dynamic typography and smooth transitions.",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&q=80",
    createdDate: "2024-11-20T00:00:00.000Z",
    tools: ["After Effects", "Cinema 4D", "Illustrator"],
    duration: "30 seconds",
    resolution: "1920x1080"
  },
  {
    _id: "artwork5",
    title: "Bouncing Ball Study",
    artist: "Jessica Martinez",
    category: "student",
    description: "Classic bouncing ball animation exercise with emphasis on timing and physics principles.",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&q=80",
    createdDate: "2024-11-15T00:00:00.000Z",
    tools: ["Maya", "DaVinci Resolve"],
    duration: "10 seconds",
    resolution: "1920x1080"
  },
  {
    _id: "artwork6",
    title: "Cyberpunk City",
    artist: "David Wong",
    category: "3d",
    description: "Futuristic cityscape with neon lights and flying vehicles. Rendered with advanced lighting techniques.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&q=80",
    createdDate: "2024-11-10T00:00:00.000Z",
    tools: ["Blender", "Substance Painter", "Photoshop"],
    duration: "2 minutes",
    resolution: "3840x2160"
  },
  {
    _id: "artwork7",
    title: "Hand-drawn Portrait",
    artist: "Lisa Park",
    category: "illustration",
    description: "Traditional hand-drawn portrait study focusing on facial expressions and shading techniques.",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=300&q=80",
    createdDate: "2024-11-05T00:00:00.000Z",
    tools: ["Pencil", "Charcoal", "Blending Tools"],
    resolution: "2000x2500"
  },
  {
    _id: "artwork8",
    title: "Logo Animation",
    artist: "Ryan Torres",
    category: "motion",
    description: "Animated logo reveal for the Animation Club with smooth transformations and particle effects.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
    createdDate: "2024-11-01T00:00:00.000Z",
    tools: ["After Effects", "Illustrator"],
    duration: "5 seconds",
    resolution: "1920x1080"
  },
  {
    _id: "artwork9",
    title: "Character Walk Cycle",
    artist: "Amanda Foster",
    category: "2d",
    description: "Smooth character walk cycle animation demonstrating proper weight distribution and timing.",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&q=80",
    createdDate: "2024-10-28T00:00:00.000Z",
    tools: ["OpenToonz", "Photoshop"],
    duration: "2 seconds (looped)",
    resolution: "1920x1080"
  },
  {
    _id: "artwork10",
    title: "First Animation Attempt",
    artist: "Tom Wilson",
    category: "student",
    description: "My very first animation project - a simple ball bounce with color changes. Still learning but proud of the progress!",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&q=80",
    createdDate: "2024-10-25T00:00:00.000Z",
    tools: ["Pencil2D", "GIMP"],
    duration: "8 seconds",
    resolution: "1280x720"
  },
  {
    _id: "artwork11",
    title: "Nature Landscape",
    artist: "Sophia Lee",
    category: "illustration",
    description: "Digital painting of a serene mountain landscape with detailed textures and atmospheric perspective.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&q=80",
    createdDate: "2024-10-20T00:00:00.000Z",
    tools: ["Photoshop", "Wacom Tablet"],
    resolution: "3000x2000"
  },
  {
    _id: "artwork12",
    title: "Spaceship Launch",
    artist: "Carlos Mendez",
    category: "3d",
    description: "Epic spaceship launch sequence with particle effects, smoke simulation, and dramatic camera movements.",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=300&q=80",
    createdDate: "2024-10-15T00:00:00.000Z",
    tools: ["Blender", "Houdini", "DaVinci Resolve"],
    duration: "1 minute 45 seconds",
    resolution: "3840x2160"
  },
  {
    _id: "artwork13",
    title: "Character Animation Reel",
    artist: "Animation Club Official",
    category: "2d",
    source: "instagram",
    description: "Featured on our Instagram - compilation of best student character animations from this semester.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80",
    createdDate: "2024-12-15T00:00:00.000Z",
    tools: ["Various"],
    duration: "2 minutes",
    resolution: "1080x1080",
    instagramUrl: "https://instagram.com/p/example1",
    likes: 245,
    comments: 18
  },
  {
    _id: "artwork14",
    title: "Stop Motion Magic",
    artist: "Animation Club Students",
    category: "stop_motion",
    source: "instagram",
    description: "Behind the scenes of our stop motion workshop - watch how magic happens frame by frame!",
    image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&q=80",
    createdDate: "2024-12-10T00:00:00.000Z",
    tools: ["Dragon Frame", "DSLR Camera", "Clay"],
    duration: "30 seconds",
    resolution: "1080x1080",
    instagramUrl: "https://instagram.com/p/example2",
    likes: 189,
    comments: 12
  },
  {
    _id: "artwork15",
    title: "Digital Art Showcase",
    artist: "Club Members",
    category: "illustration",
    source: "instagram",
    description: "Monthly digital art showcase featuring the best illustrations from our talented members.",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=300&q=80",
    createdDate: "2024-12-05T00:00:00.000Z",
    tools: ["Photoshop", "Illustrator", "Procreate"],
    resolution: "1080x1350",
    instagramUrl: "https://instagram.com/p/example3",
    likes: 312,
    comments: 25
  },
  {
    _id: "artwork16",
    title: "3D Animation Festival Highlight",
    artist: "Festival Winners",
    category: "3d",
    source: "instagram",
    description: "Highlights from our annual 3D animation festival - celebrating creativity and innovation!",
    image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500&q=80",
    thumbnail: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=300&q=80",
    createdDate: "2024-11-30T00:00:00.000Z",
    tools: ["Blender", "Maya", "Cinema 4D"],
    duration: "1 minute 15 seconds",
    resolution: "1080x1080",
    instagramUrl: "https://instagram.com/p/example4",
    likes: 421,
    comments: 34
  }
];

// Additional MongoDB optimized data structures

// User roles and permissions
export const userRoles = {
  admin: {
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_events', 'manage_submissions'],
    level: 100
  },
  moderator: {
    permissions: ['read', 'write', 'moderate_submissions', 'manage_events'],
    level: 75
  },
  officer: {
    permissions: ['read', 'write', 'create_events'],
    level: 50
  },
  member: {
    permissions: ['read', 'register_events', 'submit_work'],
    level: 25
  },
  guest: {
    permissions: ['read'],
    level: 10
  }
};

// Event categories with metadata
export const eventCategories = [
  {
    _id: "668f1g2h3i4j5k6l7m8n9o0p",
    name: "2D Animation",
    slug: "2d-animation",
    description: "Traditional and digital 2D animation techniques",
    color: "#FF6B6B",
    icon: "paintbrush",
    requirements: ["Storyboard", "Character sheets", "Animation reel"],
    softwareRecommended: ["Toon Boom Harmony", "Adobe Animate", "Procreate"],
    skillLevel: ["beginner", "intermediate", "advanced"],
    isActive: true
  },
  {
    _id: "668f1g2h3i4j5k6l7m8n9o0q",
    name: "3D Animation",
    slug: "3d-animation",
    description: "Computer-generated 3D modeling and animation",
    color: "#4ECDC4",
    icon: "cube",
    requirements: ["3D model files", "Texture maps", "Rendered sequence"],
    softwareRecommended: ["Blender", "Maya", "Cinema 4D", "3ds Max"],
    skillLevel: ["intermediate", "advanced"],
    isActive: true
  },
  {
    _id: "668f1g2h3i4j5k6l7m8n9o0r",
    name: "Stop Motion",
    slug: "stop-motion",
    description: "Frame-by-frame animation using physical objects",
    color: "#45B7D1",
    icon: "camera",
    requirements: ["Setup photos", "Final video", "Behind-the-scenes documentation"],
    softwareRecommended: ["Dragonframe", "Stop Motion Studio", "iStopMotion"],
    skillLevel: ["beginner", "intermediate", "advanced"],
    isActive: true
  }
];

// System settings and configurations
export const systemConfig = {
  app: {
    name: "Animation Club Portal",
    version: "2.0.0",
    environment: "development", // development, staging, production
    maintenanceMode: false
  },
  uploads: {
    maxFileSize: 104857600, // 100MB in bytes
    allowedVideoFormats: [".mp4", ".mov", ".avi", ".mkv"],
    allowedImageFormats: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    allowedDocumentFormats: [".pdf", ".doc", ".docx"],
    virusScanEnabled: true,
    compressionEnabled: true
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: false,
    smsEnabled: false,
    templates: {
      welcome: "668f1h2i3j4k5l6m7n8o9p0a",
      eventRegistration: "668f1h2i3j4k5l6m7n8o9p0b",
      submissionReceived: "668f1h2i3j4k5l6m7n8o9p0c",
      resultAnnouncement: "668f1h2i3j4k5l6m7n8o9p0d"
    }
  },
  features: {
    userRegistration: true,
    eventSubmissions: true,
    paymentProcessing: false,
    socialIntegration: true,
    analytics: true,
    chatSupport: false
  },
  limits: {
    maxEventsPerUser: 10,
    maxSubmissionsPerEvent: 3,
    maxFileUploadsPerSubmission: 5,
    sessionTimeout: 86400000 // 24 hours in milliseconds
  }
};

// Utility functions for MongoDB ObjectId handling
export const generateObjectId = () => {
  // Generate a mock ObjectId for demo purposes (24 character hex string)
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomBytes = Array.from({length: 16}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `${timestamp}${randomBytes}`;
};

// Helper function to validate ObjectId format
export const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Convert legacy ID to ObjectId format for migration
export const legacyIdToObjectId = (legacyId) => {
  if (isValidObjectId(legacyId)) return legacyId;
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const paddedId = legacyId.toString().padStart(16, '0');
  return `${timestamp}${paddedId}`;
};

// Database indexes for optimal performance (for backend reference)
export const recommendedIndexes = {
  users: [
    { email: 1, unique: true },
    { studentId: 1, unique: true },
    { 'timestamps.createdAt': 1 },
    { isActive: 1, role: 1 }
  ],
  events: [
    { slug: 1, unique: true },
    { status: 1, type: 1 },
    { date: 1, deadline: 1 },
    { 'timestamps.publishedAt': 1 },
    { category: 1 }
  ],
  registrations: [
    { eventId: 1, userId: 1, unique: true },
    { userId: 1, 'timestamps.registeredAt': -1 },
    { eventId: 1, status: 1 },
    { 'timestamps.registeredAt': 1 }
  ],
  submissions: [
    { eventId: 1, userId: 1 },
    { userId: 1, 'timestamps.submittedAt': -1 },
    { eventId: 1, status: 1 },
    { 'evaluation.status': 1, 'evaluation.scores.overall': -1 }
  ],
  gallery: [
    { category: 1, featured: 1 },
    { eventId: 1 },
    { 'timestamps.uploadedAt': -1 },
    { isPublic: 1, tags: 1 }
  ]
};

// Sample registrations data optimized for MongoDB
export const sampleRegistrations = [
  {
    _id: "668f2a3b4c5d6e7f8a9b0c1d",
    userId: "668f1a2b3c4d5e6f7a8b9c0d",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f",
    user: {
      name: "John Doe",
      email: "john.doe@university.edu",
      studentId: "2023001",
      major: "Computer Science",
      year: "Junior"
    },
    event: {
      title: "Annual Animation Festival 2025",
      date: "2025-08-15T00:00:00.000Z",
      type: "competition"
    },
    status: "confirmed",
    paymentStatus: "completed",
    timestamps: {
      registeredAt: "2025-07-01T10:30:00.000Z",
      confirmedAt: "2025-07-01T10:30:00.000Z",
      updatedAt: "2025-07-01T10:30:00.000Z"
    }
  },
  {
    _id: "668f2a3b4c5d6e7f8a9b0c1e",
    userId: "668f1a2b3c4d5e6f7a8b9c0f",
    eventId: "668f1c2d3e4f5a6b7c8d9e1a",
    user: {
      name: "Jane Smith",
      email: "jane.smith@university.edu",
      studentId: "2022045",
      major: "Digital Arts",
      year: "Senior"
    },
    event: {
      title: "3D Modeling Workshop",
      date: "2025-07-20T00:00:00.000Z",
      type: "workshop"
    },
    status: "confirmed",
    paymentStatus: "completed",
    timestamps: {
      registeredAt: "2025-06-30T14:22:00.000Z",
      confirmedAt: "2025-06-30T14:25:00.000Z",
      updatedAt: "2025-06-30T14:25:00.000Z"
    }
  },
  {
    _id: "668f2a3b4c5d6e7f8a9b0c1f",
    userId: "668f1a2b3c4d5e6f7a8b9c1a",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f",
    user: {
      name: "Mike Johnson",
      email: "mike.johnson@university.edu",
      studentId: "2024012",
      major: "Animation",
      year: "Sophomore"
    },
    event: {
      title: "Annual Animation Festival 2025",
      date: "2025-08-15T00:00:00.000Z",
      type: "competition"
    },
    status: "pending",
    paymentStatus: "pending",
    timestamps: {
      registeredAt: "2025-06-29T09:15:00.000Z",
      confirmedAt: null,
      updatedAt: "2025-06-29T09:15:00.000Z"
    }
  },
  {
    _id: "668f2a3b4c5d6e7f8a9b0c20",
    userId: "668f1a2b3c4d5e6f7a8b9c0g",
    eventId: "668f1c2d3e4f5a6b7c8d9e1a",
    user: {
      name: "Sarah Wilson",
      email: "sarah.wilson@university.edu",
      studentId: "2023089",
      major: "Game Design",
      year: "Junior"
    },
    event: {
      title: "3D Modeling Workshop",
      date: "2025-07-20T00:00:00.000Z",
      type: "workshop"
    },
    status: "waitlisted",
    paymentStatus: "pending",
    timestamps: {
      registeredAt: "2025-06-28T16:45:00.000Z",
      confirmedAt: null,
      updatedAt: "2025-06-28T16:45:00.000Z"
    }
  },
  {
    _id: "668f2a3b4c5d6e7f8a9b0c21",
    userId: "668f1a2b3c4d5e6f7a8b9c0h",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f",
    user: {
      name: "Alex Chen",
      email: "alex.chen@university.edu",
      studentId: "2022167",
      major: "Visual Effects",
      year: "Senior"
    },
    event: {
      title: "Annual Animation Festival 2025",
      date: "2025-08-15T00:00:00.000Z",
      type: "competition"
    },
    status: "confirmed",
    paymentStatus: "completed",
    timestamps: {
      registeredAt: "2025-06-27T11:30:00.000Z",
      confirmedAt: "2025-06-27T11:30:00.000Z",
      updatedAt: "2025-06-27T11:30:00.000Z"
    }
  }
];

// Admin dashboard statistics
export const adminStats = {
  registrations: {
    thisMonth: 12,
    lastMonth: 8,
    growthRate: 50
  },
  members: {
    newThisMonth: 5
  },
  artworks: {
    newThisWeek: 3
  },
  gallery: {
    newThisWeek: 8
  }
};

// Sample submissions data optimized for MongoDB
export const sampleSubmissions = [
  {
    _id: "668f2b3c4d5e6f7a8b9c0d1e",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f", // Annual Animation Festival 2025
    userId: "668f1a2b3c4d5e6f7a8b9c0d",
    participant: {
      name: "Alice Brown",
      email: "alice.brown@university.edu",
      studentId: "2023045",
      major: "Animation",
      year: "Senior"
    },
    submission: {
      title: "A short animation about digital transformation",
      description: "An innovative 3D animation exploring the relationship between technology and human creativity in the digital age.",
      category: "3d_animation",
      duration: 180,
      techniques: ["3d_modeling", "rigging", "animation", "rendering"],
      software: ["Blender", "After Effects", "Premiere Pro"]
    },
    files: {
      primary: {
        filename: "digital_transformation.mp4",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        fileSize: 52428800,
        mimeType: "video/mp4",
        duration: 180,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
      additional: []
    },
    status: "pending",
    evaluation: {
      scores: {
        creativity: null,
        technical: null,
        storytelling: null,
        overall: null
      },
      feedback: null,
      evaluatedBy: null,
      evaluatedAt: null
    },
    timestamps: {
      submittedAt: "2025-06-20T14:30:00.000Z",
      updatedAt: "2025-06-20T14:30:00.000Z",
      deadline: "2025-07-30T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d1f",
    eventId: "668f1c2d3e4f5a6b7c8d9e1a", // 3D Modeling Workshop
    userId: "668f1a2b3c4d5e6f7a8b9c0f",
    participant: {
      name: "Bob Wilson",
      email: "bob.wilson@university.edu",
      studentId: "2022089",
      major: "Digital Arts",
      year: "Junior"
    },
    submission: {
      title: "Creative stop motion animation using clay figures",
      description: "A whimsical stop motion piece featuring hand-crafted clay characters in a miniature world setting.",
      category: "stop_motion",
      duration: 95,
      techniques: ["stop_motion", "clay_animation", "practical_lighting"],
      software: ["Dragonframe", "Photoshop", "Premiere Pro"]
    },
    files: {
      primary: {
        filename: "clay_figures_animation.mp4",
        url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
        fileSize: 38654976,
        mimeType: "video/mp4",
        duration: 95,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=80",
      additional: [
        {
          filename: "making_of.jpg",
          url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
          description: "Behind the scenes setup"
        }
      ]
    },
    status: "under-review",
    evaluation: {
      scores: {
        creativity: 8.5,
        technical: 7.0,
        storytelling: 9.0,
        overall: null
      },
      feedback: "Great creative concept and execution. Technical aspects could be improved with better lighting consistency.",
      evaluatedBy: "668f1a2b3c4d5e6f7a8b9c0e",
      evaluatedAt: "2025-06-25T10:15:00.000Z"
    },
    timestamps: {
      submittedAt: "2025-06-18T09:45:00.000Z",
      updatedAt: "2025-06-25T10:15:00.000Z",
      deadline: "2025-07-15T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d20",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f", // Annual Animation Festival 2025
    userId: "668f1a2b3c4d5e6f7a8b9c0g",
    participant: {
      name: "Charlie Davis",
      email: "charlie.davis@university.edu",
      studentId: "2024012",
      major: "Game Design",
      year: "Sophomore"
    },
    submission: {
      title: "Future City Concept Animation",
      description: "A 2D animated short depicting a futuristic cityscape with flying vehicles and advanced architecture.",
      category: "2d_animation",
      duration: 150,
      techniques: ["2d_animation", "digital_painting", "compositing"],
      software: ["Adobe Animate", "Photoshop", "After Effects"]
    },
    files: {
      primary: {
        filename: "future_city.mp4",
        url: "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=800&q=80",
        fileSize: 44040192,
        mimeType: "video/mp4",
        duration: 150,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1551721434-8b94ddff0e6d?w=400&q=80",
      additional: [
        {
          filename: "concept_art.jpg",
          url: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80",
          description: "Initial concept sketches"
        }
      ]
    },
    status: "approved",
    evaluation: {
      scores: {
        creativity: 9.5,
        technical: 8.8,
        storytelling: 8.2,
        overall: 8.8
      },
      feedback: "Excellent work! Outstanding visual design and creative vision. The animation flows smoothly and the concept is very engaging.",
      evaluatedBy: "668f1a2b3c4d5e6f7a8b9c0e",
      evaluatedAt: "2025-06-22T16:30:00.000Z"
    },
    timestamps: {
      submittedAt: "2025-06-15T11:20:00.000Z",
      updatedAt: "2025-06-22T16:30:00.000Z",
      deadline: "2025-07-30T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d21",
    eventId: "668f1c2d3e4f5a6b7c8d9e1b", // Stop Motion Animation Contest
    userId: "668f1a2b3c4d5e6f7a8b9c0h",
    participant: {
      name: "Diana Martinez",
      email: "diana.martinez@university.edu",
      studentId: "2023156",
      major: "Film Production",
      year: "Junior"
    },
    submission: {
      title: "Kitchen Adventures",
      description: "A playful stop motion animation featuring kitchen utensils that come to life during the night.",
      category: "stop_motion",
      duration: 78,
      techniques: ["stop_motion", "practical_effects", "miniature_sets"],
      software: ["Dragonframe", "Final Cut Pro"]
    },
    files: {
      primary: {
        filename: "kitchen_adventures.mp4",
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80",
        fileSize: 31457280,
        mimeType: "video/mp4",
        duration: 78,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80",
      additional: []
    },
    status: "rejected",
    evaluation: {
      scores: {
        creativity: 7.0,
        technical: 5.5,
        storytelling: 6.8,
        overall: 6.4
      },
      feedback: "Creative concept but technical execution needs improvement. Frame rate inconsistencies and lighting issues detract from the overall quality.",
      evaluatedBy: "668f1a2b3c4d5e6f7a8b9c0e",
      evaluatedAt: "2025-06-19T14:45:00.000Z"
    },
    timestamps: {
      submittedAt: "2025-06-12T08:30:00.000Z",
      updatedAt: "2025-06-19T14:45:00.000Z",
      deadline: "2025-05-25T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.103",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d22",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f", // Annual Animation Festival 2025
    userId: "668f1a2b3c4d5e6f7a8b9c0i",
    participant: {
      name: "Eva Thompson",
      email: "eva.thompson@university.edu",
      studentId: "2022234",
      major: "Computer Graphics",
      year: "Senior"
    },
    submission: {
      title: "Experimental Motion Graphics",
      description: "An abstract experimental animation exploring geometric patterns and color theory through motion design.",
      category: "experimental",
      duration: 120,
      techniques: ["motion_graphics", "procedural_generation", "color_theory"],
      software: ["Cinema 4D", "After Effects", "Houdini"]
    },
    files: {
      primary: {
        filename: "experimental_motion.mp4",
        url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
        fileSize: 41943040,
        mimeType: "video/mp4",
        duration: 120,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
      additional: [
        {
          filename: "process_breakdown.pdf",
          url: "https://example.com/submissions/process_breakdown.pdf",
          description: "Technical breakdown of the animation process"
        }
      ]
    },
    status: "pending",
    evaluation: {
      scores: {
        creativity: null,
        technical: null,
        storytelling: null,
        overall: null
      },
      feedback: null,
      evaluatedBy: null,
      evaluatedAt: null
    },
    timestamps: {
      submittedAt: "2025-06-28T16:15:00.000Z",
      updatedAt: "2025-06-28T16:15:00.000Z",
      deadline: "2025-07-30T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.104",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d23",
    eventId: "668f1c2d3e4f5a6b7c8d9e1a", // 3D Modeling Workshop
    userId: "668f1a2b3c4d5e6f7a8b9c0j",
    participant: {
      name: "Frank Robinson",
      email: "frank.robinson@university.edu",
      studentId: "2024078",
      major: "Digital Media",
      year: "Freshman"
    },
    submission: {
      title: "Character Modeling Showcase",
      description: "A 3D character model with full rigging and animation demonstrating advanced modeling techniques learned in the workshop.",
      category: "3d_modeling",
      duration: 30,
      techniques: ["3d_modeling", "character_rigging", "animation"],
      software: ["Blender", "Substance Painter"]
    },
    files: {
      primary: {
        filename: "character_showcase.mp4",
        url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80",
        fileSize: 25165824,
        mimeType: "video/mp4",
        duration: 30,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
      additional: [
        {
          filename: "wireframe_view.jpg",
          url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
          description: "Wireframe topology view"
        }
      ]
    },
    status: "approved",
    evaluation: {
      scores: {
        creativity: 7.8,
        technical: 9.2,
        storytelling: 7.0,
        overall: 8.0
      },
      feedback: "Impressive technical skills for a freshman! Clean topology and excellent rigging work. Keep developing your creative storytelling.",
      evaluatedBy: "668f1a2b3c4d5e6f7a8b9c0e",
      evaluatedAt: "2025-06-26T13:20:00.000Z"
    },
    timestamps: {
      submittedAt: "2025-06-24T19:45:00.000Z",
      updatedAt: "2025-06-26T13:20:00.000Z",
      deadline: "2025-07-15T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.105",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d24",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f", // Annual Animation Festival 2025
    userId: "668f1a2b3c4d5e6f7a8b9c0k",
    participant: {
      name: "Grace Lee",
      email: "grace.lee@university.edu",
      studentId: "2023089",
      major: "Visual Arts",
      year: "Junior"
    },
    submission: {
      title: "Nature Documentary Style Animation",
      description: "A realistic 3D animation depicting wildlife behavior with detailed environmental storytelling.",
      category: "3d_animation",
      duration: 240,
      techniques: ["3d_animation", "environment_modeling", "creature_animation"],
      software: ["Maya", "Houdini", "Arnold Renderer"]
    },
    files: {
      primary: {
        filename: "nature_documentary.mp4",
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
        fileSize: 67108864,
        mimeType: "video/mp4",
        duration: 240,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=80",
      additional: []
    },
    status: "under-review",
    evaluation: {
      scores: {
        creativity: 8.2,
        technical: 9.1,
        storytelling: 8.8,
        overall: null
      },
      feedback: "Excellent technical execution with realistic lighting and textures. Very engaging environmental storytelling.",
      evaluatedBy: "668f1a2b3c4d5e6f7a8b9c0e",
      evaluatedAt: "2025-06-30T11:00:00.000Z"
    },
    timestamps: {
      submittedAt: "2025-06-26T13:45:00.000Z",
      updatedAt: "2025-06-30T11:00:00.000Z",
      deadline: "2025-07-30T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.106",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d25",
    eventId: "668f1c2d3e4f5a6b7c8d9e1b", // Stop Motion Animation Contest
    userId: "668f1a2b3c4d5e6f7a8b9c0l",
    participant: {
      name: "Henry Park",
      email: "henry.park@university.edu",
      studentId: "2024145",
      major: "Fine Arts",
      year: "Sophomore"
    },
    submission: {
      title: "Paper Craft Adventure",
      description: "A charming stop motion animation using paper cutouts to tell a story about friendship and adventure.",
      category: "stop_motion",
      duration: 105,
      techniques: ["stop_motion", "paper_animation", "cutout_animation"],
      software: ["Dragonframe", "Photoshop"]
    },
    files: {
      primary: {
        filename: "paper_craft_adventure.mp4",
        url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80",
        fileSize: 35651584,
        mimeType: "video/mp4",
        duration: 105,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80",
      additional: [
        {
          filename: "paper_characters.jpg",
          url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
          description: "Character design sheets"
        }
      ]
    },
    status: "pending",
    evaluation: {
      scores: {
        creativity: null,
        technical: null,
        storytelling: null,
        overall: null
      },
      feedback: null,
      evaluatedBy: null,
      evaluatedAt: null
    },
    timestamps: {
      submittedAt: "2025-06-29T20:30:00.000Z",
      updatedAt: "2025-06-29T20:30:00.000Z",
      deadline: "2025-05-25T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.107",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d26",
    eventId: "668f1c2d3e4f5a6b7c8d9e0f", // Annual Animation Festival 2025
    userId: "668f1a2b3c4d5e6f7a8b9c0m",
    participant: {
      name: "Ivy Chen",
      email: "ivy.chen@university.edu",
      studentId: "2022178",
      major: "Interactive Media",
      year: "Senior"
    },
    submission: {
      title: "Mixed Media Storytelling",
      description: "An innovative animation combining 2D hand-drawn elements with digital effects and live-action footage.",
      category: "experimental",
      duration: 165,
      techniques: ["mixed_media", "rotoscoping", "compositing", "hand_drawn"],
      software: ["TVPaint", "After Effects", "Premiere Pro"]
    },
    files: {
      primary: {
        filename: "mixed_media_storytelling.mp4",
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
        fileSize: 58720256,
        mimeType: "video/mp4",
        duration: 165,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
      additional: [
        {
          filename: "reference_footage.mp4",
          url: "https://example.com/submissions/reference_footage.mp4",
          description: "Original live-action reference material"
        }
      ]
    },
    status: "approved",
    evaluation: {
      scores: {
        creativity: 9.8,
        technical: 8.5,
        storytelling: 9.2,
        overall: 9.2
      },
      feedback: "Outstanding creative vision! The seamless integration of different media creates a unique and compelling narrative experience.",
      evaluatedBy: "668f1a2b3c4d5e6f7a8b9c0e",
      evaluatedAt: "2025-06-27T15:30:00.000Z"
    },
    timestamps: {
      submittedAt: "2025-06-25T10:15:00.000Z",
      updatedAt: "2025-06-27T15:30:00.000Z",
      deadline: "2025-07-30T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.108",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  },
  {
    _id: "668f2b3c4d5e6f7a8b9c0d27",
    eventId: "668f1c2d3e4f5a6b7c8d9e1a", // 3D Modeling Workshop
    userId: "668f1a2b3c4d5e6f7a8b9c0n",
    participant: {
      name: "Jack Williams",
      email: "jack.williams@university.edu",
      studentId: "2023201",
      major: "Architecture",
      year: "Junior"
    },
    submission: {
      title: "Architectural Visualization",
      description: "A detailed 3D architectural walkthrough showcasing modern building design with realistic materials and lighting.",
      category: "3d_modeling",
      duration: 90,
      techniques: ["architectural_modeling", "lighting", "materials", "camera_animation"],
      software: ["3ds Max", "V-Ray", "Photoshop"]
    },
    files: {
      primary: {
        filename: "architectural_walkthrough.mp4",
        url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
        fileSize: 42991616,
        mimeType: "video/mp4",
        duration: 90,
        resolution: "1920x1080"
      },
      thumbnail: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80",
      additional: [
        {
          filename: "floor_plans.pdf",
          url: "https://example.com/submissions/floor_plans.pdf",
          description: "Detailed architectural drawings"
        }
      ]
    },
    status: "rejected",
    evaluation: {
      scores: {
        creativity: 6.5,
        technical: 7.8,
        storytelling: 5.2,
        overall: 6.5
      },
      feedback: "Good technical skills but lacks creative storytelling elements. Consider adding more narrative context to architectural presentations.",
      evaluatedBy: "668f1a2b3c4d5e6f7a8b9c0e",
      evaluatedAt: "2025-06-28T09:45:00.000Z"
    },
    timestamps: {
      submittedAt: "2025-06-23T14:20:00.000Z",
      updatedAt: "2025-06-28T09:45:00.000Z",
      deadline: "2025-07-15T23:59:59.000Z"
    },
    metadata: {
      ipAddress: "192.168.1.109",
      userAgent: "Mozilla/5.0...",
      submissionCount: 1
    }
  }
];
