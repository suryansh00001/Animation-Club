import React from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAdminContext } from './context/adminContext'
import RestrictedAccess from './components/RestrictedAccess'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnnouncementPopup from './components/AnnouncementPopup'
import SEOUpdater from './components/SEOUpdater'
import AdminOpportunities from './admin/AdminOpportunities'
import GlowingCursor from './components/GlowingCursor'

// Pages
const Home = React.lazy(() => import('./pages/Home'));
const Events = React.lazy(() => import('./pages/Events'));
const EventDetails = React.lazy(() => import('./pages/EventDetails'));
const EventRegistration = React.lazy(() => import('./pages/EventRegistration'));
const EventSubmission = React.lazy(() => import('./pages/EventSubmission'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Achievements = React.lazy(() => import('./pages/Achievements'));
const About = React.lazy(() => import('./pages/About'));
const UserLogin = React.lazy(() => import('./pages/UserLogin'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Artworks = React.lazy(() => import('./pages/Artworks'));
const ArtworkSubmission = React.lazy(() => import('./pages/ArtworkSubmission'));
const ContactUs = React.lazy(()=> import('./pages/ContactUs'));
const Opportunities = React.lazy(()=> import('./pages/Opportunities'));
// Admin
const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const AdminEvents = React.lazy(() => import('./admin/AdminEvents'));
const AdminMembers = React.lazy(() => import('./admin/AdminMembers'));
const AdminAchievements = React.lazy(() => import('./admin/AdminAchievements'));
const AdminGallery = React.lazy(() => import('./admin/AdminGallery'));
const AdminArtworks = React.lazy(() => import('./admin/AdminArtworks'));
const AdminSubmissions = React.lazy(() => import('./admin/AdminSubmissions'));
const AdminRegistrations = React.lazy(() => import('./admin/AdminRegistrations'));
const AdminContacts = React.lazy(() => import('./admin/AdminContacts'));
const AdminSettings = React.lazy(() => import('./admin/AdminSettings'));
const AdminLogin = React.lazy(() => import('./admin/AdminLogin'));

// Protected Route Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated, isEventManager } = useAdminContext();
  if (!isAdminAuthenticated && !isEventManager) {
    return <AdminLogin />;
  }
  return children;
};

// Restrict admin pages for event manager
const AdminRouteGuard = ({ page, children }) => {
  const { isEventManager } = useAdminContext();
  // Only allow event manager to access events and submissions
  if (isEventManager && !['events', 'submissions'].includes(page)) {
    return <RestrictedAccess />;
  }
  return children;
};

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen font-orbitron bg-black flex flex-col">
      <Toaster position="top-right" />
      <GlowingCursor />
      <SEOUpdater />
      {!isAdminRoute && <AnnouncementPopup />}
      <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <Routes>
          {/* Admin Login Route (unprotected) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={
              <AdminRouteGuard page="dashboard">
                <AdminDashboard />
              </AdminRouteGuard>
            } />
            <Route path="events" element={
              <AdminRouteGuard page="events">
                <AdminEvents />
              </AdminRouteGuard>
            } />
            <Route path="freelancing-opportunities" element={
              <AdminRouteGuard page="freelancing-opportunities">
                <AdminOpportunities />
              </AdminRouteGuard>
            } />
            <Route path="members" element={
              <AdminRouteGuard page="members">
                <AdminMembers />
              </AdminRouteGuard>
            } />
            <Route path="achievements" element={
              <AdminRouteGuard page="achievements">
                <AdminAchievements />
              </AdminRouteGuard>
            } />
            <Route path="gallery" element={
              <AdminRouteGuard page="gallery">
                <AdminGallery />
              </AdminRouteGuard>
            } />
            <Route path="artworks" element={
              <AdminRouteGuard page="artworks">
                <AdminArtworks />
              </AdminRouteGuard>
            } />
            <Route path="submissions" element={
              <AdminRouteGuard page="submissions">
                <AdminSubmissions />
              </AdminRouteGuard>
            } />
            <Route path="registrations" element={
              <AdminRouteGuard page="registrations">
                <AdminRegistrations />
              </AdminRouteGuard>
            } />
            <Route path="contacts" element={
              <AdminRouteGuard page="contacts">
                <AdminContacts />
              </AdminRouteGuard>
            } />
            <Route path="settings" element={
              <AdminRouteGuard page="settings">
                <AdminSettings />
              </AdminRouteGuard>
            } />
          </Route>
          {/* Public Routes */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                <React.Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
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
                    <Route path="/login" element={<UserLogin />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/freelancing-opportunities" element={<Opportunities />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </React.Suspense>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </React.Suspense>
    </div>
  )
}

export default App