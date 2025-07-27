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
      className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${getPriorityColor(currentAnnouncement.priority)} text-white p-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getPriorityIcon(currentAnnouncement.priority)}</span>
              <h3 className="text-lg font-bold">Announcement</h3>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-3">
            {currentAnnouncement.title}
          </h4>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {currentAnnouncement.message}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Posted on {new Date(currentAnnouncement.date).toLocaleDateString()}
          </p>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
            >
              Got it!
            </button>
            {currentAnnouncement.type === 'event' && (
              <button
                onClick={() => {
                  handleClose();
                  window.location.href = '/events';
                }}
                className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors"
              >
                View Events
              </button>
            )}
            {currentAnnouncement.type === 'workshop' && (
              <button
                onClick={() => {
                  handleClose();
                  window.location.href = '/events';
                }}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                View Workshops
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPopup;
