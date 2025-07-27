import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';

const AnnouncementPopup = () => {
  const { settings } = useAppContext();
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Only proceed if settings have been loaded
    if (!settings.loaded) return;

    // Delay the initialization to prevent jumping
    const timer = setTimeout(() => {
      // Get active announcements from settings
      const announcements = settings.announcements || [];
      const activeAnnouncements = announcements.filter(ann => ann.active);
      
      if (activeAnnouncements.length > 0) {
        // Show the highest priority announcement
        const sortedAnnouncements = activeAnnouncements.sort((a, b) => {
          const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        
        // Check if user has already seen this announcement today
        const today = new Date().toDateString();
        const lastSeen = localStorage.getItem('lastAnnouncementSeen');
        const lastSeenId = localStorage.getItem('lastAnnouncementId');
        
        if (lastSeen !== today || lastSeenId !== sortedAnnouncements[0]._id.toString()) {
          setCurrentAnnouncement(sortedAnnouncements[0]);
          setIsVisible(true);
        }
      }
      setHasInitialized(true);
    }, 100); // Small delay to prevent jumping

    return () => clearTimeout(timer);
  }, [settings.loaded, settings.announcements]);

  const handleClose = () => {
    setIsVisible(false);
    // Remember that user has seen this announcement today
    localStorage.setItem('lastAnnouncementSeen', new Date().toDateString());
    localStorage.setItem('lastAnnouncementId', currentAnnouncement._id.toString());
  };

  const handleBackdropClick = (e) => {
    // Close when clicking the backdrop
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'from-red-500 to-red-600';
      case 'high':
        return 'from-orange-500 to-orange-600';
      case 'medium':
        return 'from-blue-500 to-blue-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  if (!hasInitialized || !isVisible || !currentAnnouncement) return null;

  return (
<div 
  className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
  onClick={handleBackdropClick}
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="relative w-full max-w-md bg-[#0a1a17] text-white rounded-xl p-6 border border-emerald-500/30 shadow-[0_0_30px_#10b98188] animate-fadeInSciFi"
  >
    {/* Decorative glowing corners */}
    <div className="absolute -top-1 -left-1 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981] animate-pulse"></div>
    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981] animate-pulse"></div>
    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981] animate-pulse"></div>
    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981] animate-pulse"></div>

    {/* Header */}
    <div className="border-b border-emerald-700 pb-3 mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-2xl text-emerald-400">{getPriorityIcon(currentAnnouncement.priority)}</span>
        <h3 className="text-lg font-bold text-emerald-300 tracking-wider uppercase">Announcement</h3>
      </div>
      <button
        onClick={handleClose}
        className="text-emerald-400 hover:text-white text-xl font-bold transition"
      >
        ×
      </button>
    </div>

    {/* Content */}
    <div>
      <h4 className="text-xl font-bold text-white mb-2">{currentAnnouncement.title}</h4>
      <p className="text-gray-300 mb-3 leading-relaxed">{currentAnnouncement.message}</p>
      <p className="text-sm text-gray-500 mb-4">Posted on {new Date(currentAnnouncement.date).toLocaleDateString()}</p>

      {/* Actions */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleClose}
          className="flex-1 border border-emerald-500 text-emerald-400 hover:bg-emerald-600 hover:text-black py-2 px-4 rounded transition font-semibold"
        >
          Got it!
        </button>
        {['event', 'workshop'].includes(currentAnnouncement.type) && (
          <button
            onClick={() => {
              handleClose();
              window.location.href = '/events';
            }}
            className="flex-1 border border-emerald-500 text-emerald-400 hover:bg-emerald-600 hover:text-black py-2 px-4 rounded transition font-semibold"
          >
            View {currentAnnouncement.type === 'event' ? 'Events' : 'Workshops'}
          </button>
        )}
      </div>
    </div>
  </div>
</div>

  );
};

export default AnnouncementPopup;
