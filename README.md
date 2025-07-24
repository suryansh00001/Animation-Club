# 🎬 Animation Club Website

A modern, full-featured website for the Animation Club. Members can connect, share work, and stay updated with events and achievements. Admins manage everything securely and efficiently.

## ✨ Features

### For Members
- Create and manage your profile
- Register for workshops and events
- Submit artwork and view the gallery
- Browse club achievements and awards
- Secure authentication with strong password requirements

### For Admins & Managers
- Role-based access for admins and event managers
- Manage member registrations and profiles
- Create, organize, and moderate events
- Review and approve member artwork
- Manage gallery photos
- Track club achievements
- Lazy loading and code splitting for fast admin panel

### Security & Performance
- JWT authentication with HttpOnly cookies
- Rate limiting and brute-force protection (configurable via `.env`)
- Password strength validation
- Input validation and error handling
- HTTPS-ready, secure headers recommended
- Optimized frontend with React.lazy and Suspense


## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB
- **Authentication:** JWT tokens

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
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middleware (rate limiting, validation, etc.)
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── scripts/           # Utility scripts (sample data, admin creation)
│   ├── package.json
│   └── server.js          # Main server file
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Quick Setup
1. **Clone the repo:**
   ```bash
   git clone <your-repo-url>
   cd Animation-Club
   ```
2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```
3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```
4. **Configure environment variables:**
   - In `server/.env`:
     ```env
     MONGODB_URI=your-mongodb-connection
     JWT_SECRET=your-secret-key
     PORT=5000
     CLIENT_URL=http://localhost:4000
     NODE_ENV=development #production
     SESSION_TIMEOUT=30
     MAX_LOGIN_ATTEMPTS=5
     PASSWORD_MIN_LENGTH=6
     AUTH_RATE_LIMIT_WINDOW_MS=900000         # 15 minutes
     AUTH_RATE_LIMIT_MAX=20                  # 20 auth attempts per 15 minutes
     AUTH_RATE_LIMIT_MESSAGE=Too many authentication attempts, please try again later.
     API_RATE_LIMIT_WINDOW_MS=60000          # 1 minute
     API_RATE_LIMIT_MAX=50                   # 100 API calls per minute
     API_RATE_LIMIT_MESSAGE=API rate limit exceeded, please try again later.
     ```
   - In `client/.env`:
     ```env
     VITE_BACKEND_URL=http://localhost:4000
     ```
5. **Run the backend:**
   ```bash
   cd server
   npm run server
   ```
6. **Run the frontend:**
   ```bash
   cd client
   npm run dev
   ```

Visit [http://localhost:5173](http://localhost:5173) to view the site.

## 🎯 Key Features

- Member registration, login, and profile management
- Event creation, registration, and moderation
- Artwork submission and approval
- Gallery management with categories and featured images
- Achievements tracking
- Admin and event manager roles with restricted access
- Secure authentication and rate limiting
- Lazy loading for fast admin experience
- Sample data scripts for quick setup

## �️ Security Highlights

- Password strength validation (min 8 chars, uppercase, lowercase, number, special char)
- Rate limiting and brute-force protection on all sensitive endpoints
- JWT authentication with HttpOnly cookies
- Input validation and error handling
- Environment-based configuration for all limits

## 👥 Contributors

- **Owner:** [nikunjagarwal17](https://github.com/nikunjagarwal17)
- **Contributor:** [SahithiKokkula](https://github.com/SahithiKokkula);

## 🚀 Deployment

1. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```
2. **Set up production environment variables**
3. **Deploy to your preferred platform:**
   - **Frontend:** Vercel, Netlify
   - **Backend:** Heroku, Railway
   - **Database:** MongoDB Atlas

