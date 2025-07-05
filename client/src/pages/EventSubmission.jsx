import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import toast from 'react-hot-toast';

const EventSubmission = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    fetchEventById, 
    submitToEvent, 
    loading, 
    isRegisteredForEvent,
    fetchUserRegistrations
  } = useAppContext();
  
  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mainFileUrl: ''
  });

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setEventLoading(true);
        setError(null);
        
        const eventData = await fetchEventById(id);
        setEvent(eventData);
        
        // Fetch user registrations to ensure registration check works
        if (isAuthenticated) {
          await fetchUserRegistrations();
        }
      } catch (error) {
        console.error('Error loading event:', error);
        setError(error.message);
      } finally {
        setEventLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id, fetchEventById, isAuthenticated, fetchUserRegistrations]);

  // Fetch user registrations when component loads
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRegistrations();
    }
  }, [isAuthenticated, fetchUserRegistrations]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.mainFileUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!validateUrl(formData.mainFileUrl)) {
      toast.error('Please provide a valid URL for your drive link');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const submissionData = {
        title: formData.title,
        description: formData.description,
        mainFileUrl: formData.mainFileUrl
      };
      
      await submitToEvent(id, submissionData);
      toast.success('Submission successful!');
      navigate('/profile');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (eventLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {error ? 'Error Loading Event' : 'Event Not Found'}
          </h1>
          <p className="text-gray-600 mb-8">
            {error || "The event you're looking for doesn't exist."}
          </p>
          <Link to="/events" className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Login Required</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to submit to events.</p>
          <Link
            to="/login"
            state={{ from: { pathname: `/events/${id}/submit` } }}
            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
          >
            Login to Submit
          </Link>
        </div>
      </div>
    );
  }

  let isDeadlinePassed = false;
  if (event.submissionDeadline) {
    const deadlineDate = new Date(event.submissionDeadline);
    const currentDate = new Date();
    
    // Create date objects at start of day for comparison (timezone safe)
    const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    // Submission is closed only if current date is AFTER deadline date
    isDeadlinePassed = currentDateOnly > deadlineDateOnly;
  }
  const userIsRegistered = isRegisteredForEvent(id);

  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⏰</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Submission Deadline Passed</h1>
            <p className="text-gray-600 mb-6">
              The submission deadline for this event has already passed.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/profile"
                className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
              >
                View Profile
              </Link>
              <Link
                to={`/events/${event._id}`}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Event
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if user is registered for this event (only if both registration AND submission are required)
  if (event.registrationRequired && event.submissionRequired && !userIsRegistered) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-yellow-500 text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Required</h1>
            <p className="text-gray-600 mb-6">
              You must be registered for this event before you can submit your work.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to={`/events/${event._id}/register`}
                className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
              >
                Register for Event
              </Link>
              <Link
                to={`/events/${event._id}`}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Event
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Submit to: {event.title}
          </h1>
          <p className="text-lg text-gray-600">
            Share your work through links only. No file uploads required.
          </p>
        </div>

        {/* Event Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-purple-700 font-medium">Event Date</p>
              <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
            </div>
            {event.submissionDeadline && (
              <div className="bg-red-50 p-3 rounded">
                <p className="text-red-700 font-medium">Submission Deadline</p>
                <p className="text-gray-600">{new Date(event.submissionDeadline).toLocaleDateString()}</p>
              </div>
            )}
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-blue-700 font-medium">Event Type</p>
              <p className="text-gray-600">{event.type}</p>
            </div>
          </div>
        </div>

        {/* Submission Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Auto-registration notice for submission-only events */}
          {event.submissionRequired && !event.registrationRequired && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Note:</strong> You will be automatically registered for this event when you submit your work. No separate registration is required.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Submit Your Work</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Submission Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your submission title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Describe your submission..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drive Link *
                  </label>
                  <input
                    type="url"
                    name="mainFileUrl"
                    value={formData.mainFileUrl}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://drive.google.com/... (or YouTube/Vimeo link)"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Share a link to your animation file (Google Drive, YouTube, Vimeo, etc.)
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to={`/events/${event._id}`}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Work'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventSubmission;
