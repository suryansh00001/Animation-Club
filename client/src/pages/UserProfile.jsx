import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { 
    user, 
    updateProfile, 
    loading, 
    events,
    profileData,
    loadProfileData
  } = useAppContext();
  
  // Use centralized profile data from context with better safety
  const userRegistrations = profileData?.registrations || [];
  const userSubmissions = profileData?.submissions || [];

  // State for view/hide registrations/submissions
  const [showAllRegistrations, setShowAllRegistrations] = useState(false);
  const [showAllSubmissions, setShowAllSubmissions] = useState(false);
  const userActivity = profileData?.activity || [];
  const userStats = profileData?.stats || {};
  const dataLoaded = profileData?.loaded || false;
  const loadingData = profileData?.loading || false;
  
  // Ensure user data is clean and serializable
  const safeUser = React.useMemo(() => {
    if (!user || typeof user !== 'object') return null;
    
    return {
      _id: String(user._id || ''),
      name: String(user.name || ''),
      email: String(user.email || ''),
      phone: String(user.phone || ''),
      studentId: String(user.studentId || ''),
      year: String(user.year || ''),
      department: String(user.department || ''),
      institution: String(user.institution || ''),
      experience: String(user.experience || ''),
      avatar: String(user.avatar || ''),
      joinDate: user.joinDate
    };
  }, [user]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    department: '',
    institution: '',
    experience: '',
    avatar: ''
  });
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  // Update editData when user data changes
  useEffect(() => {
    if (safeUser) {
      setEditData({
        name: (safeUser.name && typeof safeUser.name === 'string') ? safeUser.name : '',
        phone: (safeUser.phone && typeof safeUser.phone === 'string') ? safeUser.phone : '',
        department: (safeUser.department && typeof safeUser.department === 'string') ? safeUser.department : '',
        institution: (safeUser.institution && typeof safeUser.institution === 'string') ? safeUser.institution : '',
        experience: (safeUser.experience && typeof safeUser.experience === 'string') ? safeUser.experience : 'Beginner',
        avatar: (safeUser.avatar && typeof safeUser.avatar === 'string') ? safeUser.avatar : ''
      });
      setAvatarUrl((safeUser.avatar && typeof safeUser.avatar === 'string') ? safeUser.avatar : '');
    }
  }, [safeUser]);

  // Load profile data if not already loaded
  useEffect(() => {
    if (user && user._id && !dataLoaded && !loadingData) {
      loadProfileData();
    }
  }, [user, dataLoaded, loadingData, loadProfileData]);

  // Function to refresh profile data manually
  const refreshProfileData = () => {
    loadProfileData(true); // Force reload
  };

  // Debug: Log the data to console (safely)
  React.useEffect(() => {
    if (safeUser) {
      console.log('User loaded:', {
        name: safeUser.name,
        email: safeUser.email,
        _id: safeUser._id
      });
    }
    console.log('Registrations count:', userRegistrations?.length || 0);
    console.log('Submissions count:', userSubmissions?.length || 0);
    console.log('Events count:', events?.length || 0);
  }, [safeUser, userRegistrations, userSubmissions, events]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      console.log('Saving profile with data:', editData);
      
      // Validate required fields
      if (!editData.name || editData.name.trim().length < 2) {
        toast.error('Name must be at least 2 characters long');
        return;
      }
      
      if (!editData.experience) {
        toast.error('Experience level is required');
        return;
      }
      
      // Clean the data before sending
      const cleanedData = {
        name: editData.name.trim(),
        phone: editData.phone.trim(),
        department: editData.department.trim(),
        institution: editData.institution.trim(),
        experience: editData.experience
      };
      
      await updateProfile(cleanedData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile save error:', error);
      // Error is handled in context
    }
  };

  const handleSaveAvatar = async () => {
    try {
      // Validate URL format if provided
      if (avatarUrl && avatarUrl.trim()) {
        try {
          new URL(avatarUrl.trim());
        } catch (error) {
          toast.error('Please enter a valid URL');
          return;
        }
      }

      const avatarData = {
        avatar: avatarUrl.trim()
      };

      await updateProfile(avatarData);
      setIsEditingAvatar(false);
      toast.success('Profile photo updated successfully!');
    } catch (error) {
      console.error('Avatar save error:', error);
      toast.error('Failed to update profile photo');
    }
  };

  const handleClearAvatar = async () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      try {
        setAvatarUrl('');
        const avatarData = {
          avatar: ''
        };
        await updateProfile(avatarData);
        setIsEditingAvatar(false);
        toast.success('Profile photo removed successfully!');
      } catch (error) {
        console.error('Avatar clear error:', error);
        toast.error('Failed to remove profile photo');
      }
    }
  };

  const getEventDetails = (eventIdOrEvent) => {
    // Handle null or undefined input
    if (!eventIdOrEvent) {
      return {
        _id: 'unknown',
        title: 'Event Not Available',
        status: 'unknown',
        date: new Date().toISOString(),
        description: 'Event information is not available.'
      };
    }

    // If eventIdOrEvent is already an object (populated from server), return it
    if (typeof eventIdOrEvent === 'object' && eventIdOrEvent !== null && eventIdOrEvent.title) {
      return eventIdOrEvent;
    }
    
    // Otherwise, look up the event by ID
    const eventId = typeof eventIdOrEvent === 'object' && eventIdOrEvent !== null ? eventIdOrEvent._id : eventIdOrEvent;
    
    // Handle case where eventId is still null/undefined
    if (!eventId) {
      return {
        _id: 'unknown',
        title: 'Event Not Available',
        status: 'unknown',
        date: new Date().toISOString(),
        description: 'Event information is not available.'
      };
    }
    
    if (!events || events.length === 0) {
      return {
        _id: eventId,
        title: 'Loading...',
        status: 'unknown',
        date: new Date().toISOString(),
        description: 'Event details are being loaded.'
      };
    }
    
    const event = events.find(event => event && event._id === eventId);
    return event || {
      _id: eventId,
      title: 'Event Not Found',
      status: 'unknown',
      date: new Date().toISOString(),
      description: 'This event may have been removed or is no longer available.'
    };
  };

  const getRegistrationStatus = (registration) => {
    if (!registration) return 'unavailable';
    
    const event = getEventDetails(registration?.eventId);
    if (!event || event.title === 'Event Not Found' || event.title === 'Event Not Available') return 'unavailable';
    
    if (event.status === 'completed') return 'completed';
    if (event.status === 'ongoing') return 'ongoing';
    return 'upcoming';
  };

  const getSubmissionStatus = (submission) => {
    if (!submission) return 'unavailable';
    
    // Use the actual status from the submission model
    const submissionStatus = submission.status;
    if (submissionStatus) {
      switch (submissionStatus) {
        case 'submitted':
          return 'Submitted';
        case 'under-review':
          return 'Under Review';
        case 'approved':
          return 'Approved';
        case 'rejected':
          return 'Rejected';
        case 'winner':
          return 'Winner';
        default:
          return submissionStatus.charAt(0).toUpperCase() + submissionStatus.slice(1);
      }
    }
    
    // Fallback to event-based status
    const event = getEventDetails(submission?.eventId);
    if (!event || event.title === 'Event Not Found' || event.title === 'Event Not Available') return 'Event Unavailable';
    
    if (event.status === 'completed') return 'Event Completed';
    return 'Submitted';
  };

  const getAwardInfo = (submission) => {
    if (!submission?.award || !submission.award.position || submission.award.position === 'none') {
      return null;
    }

    const position = submission.award.position;
    const getAwardIcon = (pos) => {
      switch (pos) {
        case 'first':
          return '🥇';
        case 'second':
          return '🥈';
        case 'third':
          return '🥉';
        case 'honorable-mention':
          return '🏅';
        case 'special-recognition':
          return '⭐';
        default:
          return '🏆';
      }
    };

    const getAwardColor = (pos) => {
      switch (pos) {
        case 'first':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'second':
          return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'third':
          return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'honorable-mention':
          return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'special-recognition':
          return 'bg-purple-100 text-purple-800 border-purple-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return {
      position,
      icon: getAwardIcon(position),
      color: getAwardColor(position),
      title: position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      prize: submission.award.prize,
      certificate: submission.award.certificate
    };
  };

  if (loading && !safeUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!safeUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
          <Link
            to="/login"
            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={safeUser.avatar || 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff'}
                alt={safeUser.name || 'User'}
                className="w-24 h-24 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff';
                }}
              />
              <div className="absolute -bottom-2 -right-2 flex space-x-1">
                <button
                  onClick={() => setIsEditingAvatar(true)}
                  className="bg-purple-500 text-white p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-colors"
                  title="Change profile photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                {safeUser.avatar && (
                  <button
                    onClick={handleClearAvatar}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    title="Remove profile photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {typeof safeUser.name === 'string' ? safeUser.name : 'Unknown User'}
              </h1>
              <p className="text-gray-600">
                {typeof safeUser.email === 'string' ? safeUser.email : 'No email provided'}
              </p>
              <p className="text-sm text-gray-500">
                Member since {safeUser.joinDate ? new Date(safeUser.joinDate).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {!loadingData && (
                <button
                  onClick={refreshProfileData}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                  title="Refresh profile data"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Avatar Editing Modal */}
        {isEditingAvatar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-lg mx-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Update Profile Photo</h3>
              
              <div className="space-y-4">
                {/* Current Avatar Preview */}
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={avatarUrl || safeUser.avatar || 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff'}
                      alt="Avatar Preview"
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff';
                      }}
                    />
                  </div>
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/your-photo.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a publicly accessible image URL. Recommended: JPG or PNG format.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSaveAvatar}
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Photo'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingAvatar(false);
                      setAvatarUrl(safeUser.avatar || '');
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading indicator for profile data */}
        {loadingData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mr-3"></div>
              <p className="text-gray-600">Loading profile data...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={editData.department}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={editData.institution}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      name="experience"
                      value={editData.experience}
                      onChange={handleEditChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors disabled:bg-purple-300"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">
                      {typeof safeUser.phone === 'string' ? safeUser.phone : 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Student ID</p>
                    <p className="text-gray-900">
                      {typeof safeUser.studentId === 'string' ? safeUser.studentId : 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Academic Year</p>
                    <p className="text-gray-900">
                      {typeof safeUser.year === 'string' ? safeUser.year : 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Department</p>
                    <p className="text-gray-900">
                      {typeof safeUser.department === 'string' ? safeUser.department : 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Institution</p>
                    <p className="text-gray-900">
                      {typeof safeUser.institution === 'string' ? safeUser.institution : 'Not provided'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Experience Level</p>
                    <p className="text-gray-900">
                      {typeof safeUser.experience === 'string' ? safeUser.experience : 'Not specified'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Events Registered</span>
                  <span className="font-semibold text-purple-600">
                    {userStats?.totalRegistrations || userRegistrations?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Submissions Made</span>
                  <span className="font-semibold text-purple-600">
                    {userStats?.totalSubmissions || userSubmissions?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Confirmed Events</span>
                  <span className="font-semibold text-green-600">
                    {userStats?.confirmedRegistrations || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved Submissions</span>
                  <span className="font-semibold text-green-600">
                    {userStats?.approvedSubmissions || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Awards Won</span>
                  <span className="font-semibold text-yellow-600">
                    {userSubmissions?.filter(submission => 
                      submission?.award?.position && submission.award.position !== 'none'
                    ).length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">
                    {safeUser.joinDate ? new Date(safeUser.joinDate).getFullYear() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Registrations and Submissions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Registered Events */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Event Registrations</h2>
              {userRegistrations && userRegistrations.length > 2 && (
                <div className="mb-4 text-right">
                  <button
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium underline"
                    onClick={() => setShowAllRegistrations(v => !v)}
                  >
                    {showAllRegistrations ? 'Hide All Registrations' : 'View All Registrations'}
                  </button>
                </div>
              )}
              {!userRegistrations || userRegistrations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't registered for any events yet.</p>
                  <Link
                    to="/events"
                    className="bg-purple-500 text-white px-6 py-2 rounded-md hover:bg-purple-600 transition-colors"
                  >
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(showAllRegistrations
                    ? userRegistrations
                    : userRegistrations.slice(0, 2)
                  )
                    .filter(registration => registration && registration._id)
                    .map((registration) => {
                      // Safely get event details with null check
                      const event = getEventDetails(registration?.eventId);
                      const status = getRegistrationStatus(registration);
                      return (
                        <div key={String(registration._id || Math.random())} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">
                                {event?.title || 'Unknown Event'}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Registered on {registration?.timestamps?.registeredAt || registration?.createdAt ? (() => {
                                  try {
                                    const date = registration.timestamps?.registeredAt || registration.createdAt;
                                    return new Date(date).toLocaleDateString();
                                  } catch (e) {
                                    return 'Registration date unavailable';
                                  }
                                })() : 'Registration date unavailable'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Event Date: {event?.date ? (() => {
                                  try {
                                    return new Date(event.date).toLocaleDateString();
                                  } catch (e) {
                                    return 'TBD';
                                  }
                                })() : 'TBD'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {status}
                              </span>
                              {event && (
                                <Link
                                  to={`/events/${event._id}`}
                                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                                >
                                  View Event
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Submissions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Submissions</h2>
                {userSubmissions && userSubmissions.length > 3 && (
                  <button
                    className="text-sm text-purple-600 hover:text-purple-800 font-medium underline"
                    onClick={() => setShowAllSubmissions(v => !v)}
                  >
                    {showAllSubmissions ? 'Hide All Submissions' : 'View All Submissions'}
                  </button>
                )}
                <Link 
                  to="/events" 
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium ml-2"
                >
                  Find Events to Submit →
                </Link>
              </div>
              {!userSubmissions || userSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎬</div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No submissions yet</h3>
                  <p className="text-gray-500 mb-6">
                    Submit your work to ongoing events and showcase your creativity!
                  </p>
                  <Link 
                    to="/events" 
                    className="inline-block bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium"
                  >
                    Browse Events
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {(showAllSubmissions
                    ? userSubmissions
                    : userSubmissions.slice(0, 3)
                  )
                    .filter(submission => submission && submission._id)
                    .map((submission) => {
                      const event = getEventDetails(submission?.eventId);
                      const status = getSubmissionStatus(submission);
                      const awardInfo = getAwardInfo(submission);
                      return (
                        <div key={String(submission._id || Math.random())} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900">
                                  {event?.title || 'Unknown Event'}
                                </h3>
                                {awardInfo && (
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${awardInfo.color}`}>
                                    <span className="mr-1">{awardInfo.icon}</span>
                                    {awardInfo.title}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {(() => {
                                  const title = submission?.submissionDetails?.title || submission?.title;
                                  return title || 'Untitled Submission';
                                })()}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">
                                {(() => {
                                  const description = submission.submissionDetails?.description || submission.description;
                                  return typeof description === 'string' ? description : 'No description available';
                                })()}
                              </p>
                              {/* Award Details */}
                              {awardInfo && (
                                <div className="mb-2 p-3 bg-gray-50 rounded-lg border">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        🎉 Congratulations! You won {awardInfo.title}
                                      </p>
                                      {awardInfo.prize && (
                                        <p className="text-xs text-gray-600">Prize: {awardInfo.prize}</p>
                                      )}
                                    </div>
                                    {awardInfo.certificate && (
                                      <a
                                        href={awardInfo.certificate}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-purple-600 hover:text-purple-800 font-medium underline"
                                      >
                                        View Certificate
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              <p className="text-sm text-gray-500">
                                Submitted on {submission.submissionTime ? (() => {
                                  try {
                                    return new Date(submission.submissionTime).toLocaleDateString();
                                  } catch (e) {
                                    return 'Submission date unavailable';
                                  }
                                })() : 'Submission date unavailable'}
                              </p>
                              {(submission.files?.mainFileUrl || submission.fileUrl || submission.mainFileUrl) && (
                                <div className="mt-2">
                                  <a
                                    href={submission.files?.mainFileUrl || submission.fileUrl || submission.mainFileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                                  >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View Submission
                                  </a>
                                </div>
                              )}
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              status === 'Approved' || status === 'Winner' ? 'bg-green-100 text-green-800' :
                              status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                              status === 'Rejected' ? 'bg-red-100 text-red-800' :
                              status === 'Submitted' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {status}
                            </span>
                          </div>
                          {/* Award Information */}
                          {awardInfo && (
                            <div className={`mt-2 p-2 rounded-md border ${awardInfo.color} flex items-center`}>
                              <span className="text-lg mr-2">
                                {awardInfo.icon}
                              </span>
                              <div className="text-sm">
                                <p className="font-medium text-gray-900">{awardInfo.title}</p>
                                {awardInfo.prize && (
                                  <p className="text-gray-700">{awardInfo.prize}</p>
                                )}
                                {awardInfo.certificate && (
                                  <p className="text-gray-700">Certificate: {awardInfo.certificate}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
