// Template for Gallery Images Data
// Replace the galleryImages array in assets.js with your own data following this structure

export const galleryImages = [
  {
    _id: "unique-id-1", // Any unique identifier
    title: "Your Image Title",
    description: "Description of your image",
    image: "https://your-image-url.com/image.jpg", // This will be used for both thumbnail and modal
    category: "event", // One of: event, workshop, achievement, social
    tags: ["tag1", "tag2"], // Optional tags
    metadata: {
      photographer: "Photographer Name", // Optional
      location: "Location Name", // Optional
      // Add any other metadata you want
    },
    timestamps: {
      takenAt: "2024-12-01T10:30:00.000Z", // ISO string format (not Date object)
      uploadedAt: "2024-12-02T09:15:00.000Z", // ISO string format
      updatedAt: "2024-12-02T09:15:00.000Z" // ISO string format
    },
    isPublic: true,
    featured: false // Optional: whether to highlight this image
  },
  {
    _id: "unique-id-2",
    title: "Another Image",
    description: "Another description",
    image: "https://your-image-url.com/image2.jpg",
    category: "workshop",
    tags: ["workshop", "learning"],
    metadata: {
      photographer: "Another Photographer",
      location: "Workshop Room"
    },
    timestamps: {
      takenAt: "2024-11-15T14:22:00.000Z",
      uploadedAt: "2024-11-16T08:30:00.000Z",
      updatedAt: "2024-11-16T08:30:00.000Z"
    },
    isPublic: true,
    featured: true
  }
  // Add more images following the same structure
];

/*
IMPORTANT NOTES:
1. Use the same URL for 'image' field - it will be used for both thumbnails and modal view
2. Use ISO string format for dates (not new Date() objects) to avoid "Invalid Date" errors
3. Category must be one of: 'event', 'workshop', 'achievement', 'social'
4. The _id field should be unique for each image
5. If an image fails to load, it will automatically fall back to a colored placeholder based on category
*/
