import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import toast from 'react-hot-toast';

const EventRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, registerForEvent, isRegisteredForEvent, loading, fetchEventById } = useAppContext();
  
  console.log('EventRegistration - Event ID from params:', { id, type: typeof id, length: id?.length });
  
  const [event, setEvent] = useState(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [error, setError] = useState(null);
  const isAlreadyRegistered = isRegisteredForEvent(id);
  
  const [formData, setFormData] = useState({
    experience: user?.experience || '',
    expectations: '',
    teamMembers: '',
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setEventLoading(true);
        const fetchedEvent = await fetchEventById(id);
        setEvent(fetchedEvent);
      } catch (error) {
        console.error('Error loading event:', error);
        setError('Failed to load event details');
      } finally {
        setEventLoading(false);
      }
    };

    if (id) {
      loadEvent();
    }
  }, [id, fetchEventById]);

if (eventLoading) {
  return (
    <div className="min-h-screen bg-[#0a1a1a] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p className="text-slate-400 font-orbitron">Loading event details...</p>
      </div>
    </div>
  );
}

if (error || !event) {
  return (
    <div className="min-h-screen bg-[#0a1a1a] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-emerald-400 mb-4 font-orbitron">
          {error ? 'Error Loading Event' : 'Event Not Found'}
        </h1>
        <p className="text-slate-400 mb-8 font-light">
          {error || "The event you're looking for doesn't exist."}
        </p>
        <Link
          to="/events"
          className="bg-emerald-500 text-[#0f172a] px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors font-semibold shadow-lg shadow-emerald-500/30"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}

if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-[#0a1a1a] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emerald-400 mb-4 font-orbitron">Login Required</h1>
        <p className="text-slate-400 mb-6 font-light">You need to be logged in to register for events.</p>
        <Link
          to="/login"
          state={{ from: { pathname: `/events/${id}/register` } }}
          className="bg-emerald-500 text-[#0f172a] px-6 py-3 rounded-md hover:bg-emerald-400 transition-colors font-semibold shadow-md shadow-emerald-500/20"
        >
          Login to Register
        </Link>
      </div>
    </div>
  );
}

if (isAlreadyRegistered) {
  return (
    <div className="min-h-screen bg-[#0a1a1a] py-24 px-4">
  <div className="max-w-2xl mx-auto">
    <div className="bg-[#0a1a17] border border-emerald-700 rounded-xl shadow-[0_0_40px_#06d6a0aa] p-6 sm:p-8 text-center">
      <div className="text-4xl sm:text-6xl text-emerald-400 mb-3 sm:mb-4"> :) </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-300 mb-3 font-orbitron">Already Registered</h1>
      <p className="text-sm sm:text-base text-slate-400 mb-5 sm:mb-6">
        You are already registered for this event!
      </p>
      <div className="flex justify-center space-x-3 sm:space-x-4">
        <Link
          to="/profile"
          className="text-sm sm:text-base bg-emerald-500 text-[#0f172a] px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-emerald-400 transition-colors font-semibold"
        >
          View Profile
        </Link>
        <Link
          to={`/events/${event._id}`}
          className="text-sm sm:text-base bg-slate-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-slate-600 transition-colors font-semibold"
        >
          Back to Event
        </Link>
      </div>
    </div>
  </div>
</div>

  );
}


  // Check if registration is available
  let isDeadlinePassed = false;
  if (event.registrationDeadline) {
    const deadlineDate = new Date(event.registrationDeadline);
    const currentDate = new Date();
    
    // Create date objects at start of day for comparison (timezone safe)
    const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
    const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    
    // Registration is closed only if current date is AFTER deadline date
    isDeadlinePassed = currentDateOnly > deadlineDateOnly;
  }
  const isRegistrationClosed = event.status === 'completed' || 
                                (event.registrationRequired && isDeadlinePassed);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const registrationData = {
        ...formData,
        name: user.name,
        email: user.email,
        phone: user.phone,
        studentId: user.studentId,
        year: user.year,
        department: user.department
      };
      
      await registerForEvent(id, registrationData); // Use string ID directly, not parseInt
      navigate('/profile');
    } catch (error) {
      // Error is handled in context
    }
  };

 if (isRegistrationClosed) {
  return (
    <div className="min-h-screen py-8 bg-[#0a1a1a]">
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="rounded-lg shadow-xl p-6 sm:p-8 text-center border border-emerald-500" style={{ backgroundColor: '#111' }}>
      <div className="text-4xl sm:text-6xl text-red-500 mb-3 sm:mb-4">⚠️</div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Registration Closed</h1>
      <p className="text-sm sm:text-base text-gray-400 mb-5 sm:mb-6">
        {isDeadlinePassed && "The registration deadline has passed."}
        {!isDeadlinePassed && event.status !== 'upcoming' && "Registration is not available for this event."}
      </p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
        <Link
          to={`/events/${event._id}`}
          className="text-sm sm:text-base bg-gray-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-gray-600 transition-colors w-full sm:w-auto text-center"
        >
          Back to Event
        </Link>
        <Link
          to="/events"
          className="text-sm sm:text-base bg-emerald-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md hover:bg-emerald-500 transition-colors w-full sm:w-auto text-center"
        >
          View Other Events
        </Link>
      </div>
    </div>
  </div>
</div>

  );
}


  return (
    <div className="min-h-screen bg-[#0a1a1a] py-24 px-4 sm:px-6 lg:px-8">
  <div className="max-w-3xl mx-auto">
    
    {/* Header */}
    <div className="mb-8">
      <Link
        to={`/events/${event._id}`}
        className="inline-flex items-center text-emerald-400 hover:text-emerald-300 font-medium mb-4 transition-colors text-sm sm:text-base"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Event Details
      </Link>

      <div className="bg-[#0f2a2a] rounded-lg shadow-md shadow-emerald-500/20 p-5 sm:p-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-emerald-300 mb-2 font-orbitron">Register for Event</h1>
        <h2 className="text-lg sm:text-xl text-emerald-400 font-semibold mb-4">{event.title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-[#103232] p-3 rounded border border-emerald-700">
            <p className="text-emerald-500 font-medium">Event Date</p>
            <p className="text-emerald-300">{new Date(event.date).toLocaleDateString()}</p>
          </div>
          <div className="bg-[#103232] p-3 rounded border border-emerald-700">
            <p className="text-emerald-500 font-medium">Registration Deadline</p>
            <p className="text-emerald-300">
              {event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : 'No deadline set'}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Registration Form */}
    <div className="bg-[#0f2a2a] rounded-lg shadow-lg shadow-emerald-500/20 p-5 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Logged-in User Info */}
        <div className="bg-[#112f2f] border border-emerald-700 rounded-lg p-5 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-4 font-orbitron">Registering as:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ["Name", user.name],
              ["Email", user.email],
              ["Student ID", user.studentId],
              ["Year", user.year],
              ["Department", user.department],
              ["Phone", user.phone]
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-emerald-500 font-medium">{label}</p>
                <p className="text-emerald-300 break-words">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Event-Specific Fields */}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-emerald-400 mb-4 font-orbitron">Event Information</h3>
          <div className="space-y-4">
            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-emerald-500 mb-2">
                Animation Experience Level
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border border-emerald-700 bg-[#0a1a1a] text-emerald-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="">Select experience level</option>
                <option value="Beginner">Beginner (0–1 years)</option>
                <option value="Intermediate">Intermediate (1–3 years)</option>
                <option value="Advanced">Advanced (3+ years)</option>
                <option value="Professional">Professional</option>
              </select>
            </div>

            {/* Team Members */}
            {event.type === 'competition' && (
              <div>
                <label htmlFor="teamMembers" className="block text-sm font-medium text-emerald-500 mb-2">
                  Team Members (if applicable)
                </label>
                <textarea
                  id="teamMembers"
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-emerald-700 bg-[#0a1a1a] text-emerald-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="List team member names and their roles (leave blank if participating individually)"
                />
              </div>
            )}

            {/* Expectations */}
            <div>
              <label htmlFor="expectations" className="block text-sm font-medium text-emerald-500 mb-2">
                What do you hope to gain from this event?
              </label>
              <textarea
                id="expectations"
                name="expectations"
                value={formData.expectations}
                onChange={handleChange}
                rows={4}
                className="w-full border border-emerald-700 bg-[#0a1a1a] text-emerald-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                placeholder="Share your goals and expectations..."
              />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="border-t border-emerald-700 pt-5">
          <div className="flex items-start text-sm">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
              className="mt-1 mr-3 h-4 w-4 text-emerald-500 focus:ring-emerald-400 border-emerald-700 bg-[#0a1a1a]"
            />
            <label htmlFor="agreeTerms" className="text-emerald-300 text-[0.55rem] leading-snug">
              I agree to the terms and conditions of the event. I understand that my participation is subject to the club's policies and guidelines. I consent to the use of my information for event-related communications. *
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0">
          <Link
            to={`/events/${event._id}`}
            className="w-full sm:w-auto text-center px-5 py-2.5 border border-emerald-500 text-emerald-400 hover:bg-emerald-900 transition-colors rounded-md text-sm font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || !formData.agreeTerms}
            className="w-full sm:w-auto text-center px-5 py-2.5 bg-emerald-500 text-black font-semibold rounded-md hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-colors disabled:bg-emerald-300 disabled:cursor-not-allowed text-sm"
          >
            {loading ? 'Registering...' : 'Register for Event'}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>


  );
};

export default EventRegistration;
