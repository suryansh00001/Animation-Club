# ⚛️ Animation Club Frontend

The beautiful, user-friendly interface for our Animation Club website built with React.

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **Vite** - Super fast build tool
- **Tailwind CSS** - Beautiful, responsive styling
- **React Router** - Smooth page navigation

## 📁 What's Inside

```
client/
├── src/
│   ├── pages/          # Main pages (Home, About, Gallery, etc.)
│   ├── components/     # Reusable UI pieces (Navbar, Footer, etc.)
│   ├── admin/          # Admin panel components
│   ├── context/        # App state management
│   └── assets/         # Images and constants
├── public/             # Static files
└── package.json        # Dependencies and scripts
```

## 🚀 Getting Started

### Setup

1. **Install everything:**
```bash
npm install
```

2. **Add your environment file (`.env`):**
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=Animation Club
```

3. **Start the development server:**
```bash
npm run dev
```

Visit http://localhost:5173 and you're good to go!

### Build for Production
```bash
npm run build    # Creates optimized build
npm run preview  # Preview the production build
```

## 🎨 What Users See

### Public Pages
- **Home** - Welcome page with highlights
- **About** - Club info and team members  
- **Events** - Upcoming workshops and activities
- **Gallery** - Photo memories from events
- **Artworks** - Member creative showcases
- **Achievements** - Awards and accomplishments

### Member Features
- **Login/Register** - Join the club
- **Profile** - Manage your personal info
- **Submit Artwork** - Share your creations
- **Event Registration** - Sign up for events

### Admin Panel
- **Dashboard** - Overview of everything
- **Manage Members** - Add/edit member profiles
- **Create Events** - Plan workshops and activities
- **Review Artworks** - Approve member submissions
- **Upload Photos** - Add to gallery
- **Track Achievements** - Document club success

## 🎨 Design Features

- **Mobile-friendly** - Works great on phones and tablets
- **Fast loading** - Optimized for quick page loads
- **Beautiful UI** - Clean, modern design with purple theme
- **Easy navigation** - Intuitive menus and buttons
- **Image optimization** - Photos load quickly and look great

## � How It Works

### State Management
We use React Context to keep track of:
- **User info** - Who's logged in and their details
- **Admin data** - Dashboard info and management tools
- **App settings** - Site configuration and preferences

### Page Routing
```
/                    -> Home page
/about              -> About us
/events             -> Events list
/gallery            -> Photo gallery
/artworks           -> Member artworks
/achievements       -> Club achievements
/admin/dashboard    -> Admin panel
```

### Component Structure
- **Pages** - Full page components (Home, About, etc.)
- **Components** - Reusable pieces (Navbar, Footer, etc.)  
- **Admin** - Admin-only management interfaces
- **Context** - App state and user management

## 🚀 Performance

- **Code splitting** - Only load what's needed
- **Image optimization** - Fast-loading photos
- **Lazy loading** - Load content as you scroll
- **Minified builds** - Smaller file sizes

## � For Developers

### Adding New Components
```javascript
import React, { useState } from 'react';

const MyComponent = ({ title }) => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold">{title}</h2>
      <button 
        onClick={() => setCount(count + 1)}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded"
      >
        Count: {count}
      </button>
    </div>
  );
};

export default MyComponent;
```

### File Organization
- Use `PascalCase` for component files (`MyComponent.jsx`)
- Use `camelCase` for utility files (`apiHelpers.js`)
- Keep components small and focused on one thing
- Use Tailwind classes for styling

### Common Issues
- **Page won't load?** Check if the backend is running
- **Styling broken?** Make sure Tailwind CSS is imported
- **Images not showing?** Verify the image URLs are correct
- **API errors?** Check the browser console for error messages

## 🚀 Deployment

Ready to go live? Build the production version:

```bash
npm run build
```


