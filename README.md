# 🎬 Animation Club Website

A complete website for our animation club where members can connect, share their work, and stay updated with events and achievements.

## ✨ What You Can Do

### For Members
- Create your profile and showcase your skills
- Register for workshops and events
- Submit your artwork for everyone to see
- Browse the gallery of club memories
- Check out our achievements and awards

### For Admins
- Manage member registrations and profiles
- Create and organize events
- Review and approve member artwork
- Upload photos to the gallery
- Track club achievements

## 🛠️ Built With

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express + MongoDB  
**Authentication:** JWT tokens

## 📁 Project Structure

```
Animation Club/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── admin/         # Admin components
│   │   ├── assets/        # Static assets and constants
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js     # Vite configuration
│
├── server/                # Backend Node.js application
│   ├── configs/           # Configuration files
│   │   ├── db.js          # Database connection
│   │   └── multer.js      # File upload configuration
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   ├── package.json
│   └── server.js         # Main server file
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### What You Need
- Node.js (version 14 or newer)
- MongoDB (you can use a free MongoDB Atlas account)

### Quick Setup

1. **Download the project**
```bash
git clone <your-repo-url>
cd "Animation Club"
```

2. **Set up the backend**
```bash
cd server
npm install
```

3. **Set up the frontend**
```bash
cd ../client
npm install
```

4. **Configure your environment**

Create `.env` in the server folder:
```env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

Create `.env` in the client folder:
```env
VITE_BACKEND_URL=http://localhost:5000
```

### Running the Website

**Start the backend:**
```bash
cd server
npm run dev
```

**Start the frontend:**
```bash
cd client
npm run dev
```

Visit http://localhost:5173 to see your website!

## 🎯 Main Features

### 🏆 Achievements
Track and showcase club accomplishments, awards, and recognitions with photos and details.

### 🖼️ Gallery
Upload and organize club photos by categories like events, workshops, and general moments.

### 🎨 Artworks
Members can submit their creative work for review and showcase approved pieces to everyone.

### 👥 Member Management
Keep track of current members, alumni, and their roles within the club.

### 📅 Events
Create workshops, screenings, and other club activities with registration management.

## 🚀 For Developers

### Project Structure
```
Animation Club/
├── client/          # React frontend
├── server/          # Node.js backend
├── README.md        # You are here
└── .gitignore      # What to ignore in git
```

### Available Commands
```bash
# Backend
cd server
npm run dev         # Start development server
npm start          # Start production server

# Frontend  
cd client
npm run dev        # Start development server
npm run build      # Build for production
```

## 🚀 Deployment

When you're ready to put your website online:

1. **Build the frontend:**
```bash
cd client
npm run build
```

2. **Set up your production environment variables**

3. **Deploy to your preferred platform:**
   - **Frontend**: Vercel, Netlify
   - **Backend**: Heroku, Railway
   - **Database**: MongoDB Atlas

## � Contributing

Want to help improve the website? Great!

1. Fork this repository
2. Create a new branch for your feature
3. Make your changes
4. Test everything works
5. Submit a pull request

## 🆘 Need Help?

**Common Issues:**
- **Can't connect to database?** Check your MongoDB connection string
- **Website not loading?** Make sure both frontend and backend are running

## 📞 Contact

Got questions? Reach out to the development team or create an issue in this repository.

---

Made with ❤️ for our Animation Club community!
