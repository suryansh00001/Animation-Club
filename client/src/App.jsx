import React from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAdminContext } from './context/adminContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementPopup from './components/AnnouncementPopup'
import SEOUpdater from './components/SEOUpdater'

// Pages
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import EventRegistration from './pages/EventRegistration'
import EventSubmission from './pages/EventSubmission'
import Gallery from './pages/Gallery'
import Achievements from './pages/Achievements'
import About from './pages/About'
import Profile from './pages/Profile'
import UserLogin from './pages/UserLogin'
import UserProfile from './pages/UserProfile'
import Artworks from './pages/Artworks'
import ArtworkSubmission from './pages/ArtworkSubmission'

// Admin
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminEvents from './admin/AdminEvents'
import AdminMembers from './admin/AdminMembers'
import AdminAchievements from './admin/AdminAchievements'
import AdminGallery from './admin/AdminGallery'
import AdminArtworks from './admin/AdminArtworks'
import AdminSubmissions from './admin/AdminSubmissions'
import AdminRegistrations from './admin/AdminRegistrations'
import AdminContacts from './admin/AdminContacts'
import AdminSettings from './admin/AdminSettings'
import AdminLogin from './admin/AdminLogin'
import ContactUs from './pages/ContactUs'

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated } = useAdminContext()
  
  if (!isAdminAuthenticated) {
    return <AdminLogin />
  }
  
  return children
}

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" />
      <SEOUpdater />
      
      {!isAdminRoute && <AnnouncementPopup />}
      
      <Routes>
        {/* Admin Login Route (unprotected) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="members" element={<AdminMembers />} />
          <Route path="achievements" element={<AdminAchievements />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="artworks" element={<AdminArtworks />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/events/:id/register" element={<EventRegistration />} />
                <Route path="/events/:id/submit" element={<EventSubmission />} />
                <Route path="/register" element={<Navigate to="/events" replace />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/artworks" element={<Artworks />} />
                <Route path="/artworks/submit" element={<ArtworkSubmission />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
      </div>
  )
}

export default App
