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
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p className="text-emerald-300">Loading event...</p>
      </div>
    </div>
  );
}

if (error || !event) {
  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          {error ? 'Error Loading Event' : 'Event Not Found'}
        </h1>
        <p className="text-slate-400 mb-8">
          {error || "The event you're looking for doesn't exist."}
        </p>
        <Link
          to="/events"
          className="bg-emerald-500 text-black px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-600/40"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}

if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-emerald-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Login Required</h1>
        <p className="text-slate-400 mb-6">You need to be logged in to submit to events.</p>
        <Link
          to="/login"
          state={{ from: { pathname: `/events/${id}/submit` } }}
          className="bg-emerald-500 text-black px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-600/40"
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
  const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
  const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  isDeadlinePassed = currentDateOnly > deadlineDateOnly;
}
const userIsRegistered = isRegisteredForEvent(id);

if (isDeadlinePassed) {
  return (
    <div className="min-h-screen bg-emerald-950 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#052e26] rounded-xl shadow-lg shadow-emerald-500/20 p-8 text-center border border-emerald-400/10">
          <div className="text-emerald-400 text-6xl mb-4">⏰</div>
          <h1 className="text-3xl font-bold text-white mb-4">Submission Deadline Passed</h1>
          <p className="text-slate-400 mb-6">
            The submission deadline for this event has already passed.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/profile"
              className="bg-emerald-500 text-black px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors shadow shadow-emerald-500/40"
            >
              View Profile
            </Link>
            <Link
              to={`/events/${event._id}`}
              className="bg-slate-700 text-white px-6 py-3 rounded-md hover:bg-slate-600 transition-colors"
            >
              Back to Event
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

if (event.registrationRequired && event.submissionRequired && !userIsRegistered) {
  return (
    <div className="min-h-screen bg-emerald-950 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#052e26] rounded-xl shadow-lg shadow-emerald-500/20 p-8 text-center border border-emerald-400/10">
          <div className="text-yellow-400 text-6xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-white mb-4">Registration Required</h1>
          <p className="text-slate-400 mb-6">
            You must be registered for this event before you can submit your work.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to={`/events/${event._id}/register`}
              className="bg-emerald-500 text-black px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors shadow shadow-emerald-500/40"
            >
              Register for Event
            </Link>
            <Link
              to={`/events/${event._id}`}
              className="bg-slate-700 text-white px-6 py-3 rounded-md hover:bg-slate-600 transition-colors"
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
<div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-24 overflow-hidden">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-[#06d6a0] drop-shadow-[0_0_10px_#06d6a0] mb-4">
        Submit to: {event.title}
      </h1>
      <p className="text-lg text-[#94a3b8]">Share your work through links only. No file uploads required.</p>
    </div>

    {/* Event Info */}
    <div className="bg-emerald-950 border border-[#06d6a0]/20 rounded-lg shadow-[0_0_12px_#06d6a0]  p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#112d2a] p-3 rounded border border-[#06d6a0]/20">
          <p className="text-[#06d6a0] font-medium">Event Date</p>
          <p className="text-[#cbd5e1]">{new Date(event.date).toLocaleDateString()}</p>
        </div>
        {event.submissionDeadline && (
          <div className="bg-[#112d2a] p-3 rounded border border-[#06d6a0]/20">
            <p className="text-[#06d6a0] font-medium">Submission Deadline</p>
            <p className="text-[#cbd5e1]">{new Date(event.submissionDeadline).toLocaleDateString()}</p>
          </div>
        )}
        <div className="bg-[#112d2a] p-3 rounded border border-[#06d6a0]/20">
          <p className="text-[#06d6a0] font-medium">Event Type</p>
          <p className="text-[#cbd5e1]">{event.type}</p>
        </div>
      </div>
    </div>

    {/* Submission Form */}
    <div className="bg-emerald-950 border border-[#06d6a0]/20 rounded-lg shadow-[0_0_12px_#06d6a0]  p-8">
      {event.submissionRequired && !event.registrationRequired && (
        <div className="bg-[#0a1a17] border border-[#06d6a0]/20 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-[#06d6a0]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-[#94a3b8]">
                <strong>Note:</strong> You will be automatically registered for this event when you submit your work.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Title */}
        <div>
          <h3 className="text-lg font-semibold text-[#06d6a0] mb-6">Submit Your Work</h3>
          <div className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Submission Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#06d6a0]/30 bg-[#0a1a17] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#06d6a0] shadow-inner"
                placeholder="Enter your submission title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-[#06d6a0]/30 bg-[#0a1a17] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#06d6a0] shadow-inner"
                placeholder="Describe your submission..."
              />
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-[#94a3b8] mb-2">Drive Link *</label>
              <input
                type="url"
                name="mainFileUrl"
                value={formData.mainFileUrl}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-[#06d6a0]/30 bg-[#0a1a17] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#06d6a0] shadow-inner"
                placeholder="https://drive.google.com/... (or YouTube/Vimeo link)"
              />
              <p className="text-sm text-[#64748b] mt-1">
                Share a link to your animation file (Google Drive, YouTube, Vimeo, etc.)
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-[#06d6a0]/20">
          <Link
            to={`/events/${event._id}`}
            className="px-6 py-3 border border-[#06d6a0]/40 text-[#06d6a0] rounded-md hover:bg-[#0a1a17] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#06d6a0] text-emerald-950 rounded-md hover:bg-[#05c392] focus:outline-none focus:ring-2 focus:ring-[#06d6a0] transition-colors disabled:bg-[#047c6a] disabled:cursor-not-allowed shadow-md shadow-[#06d6a0]/50"
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
