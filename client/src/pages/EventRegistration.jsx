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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
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
          <p className="text-gray-600 mb-6">You need to be logged in to register for events.</p>
          <Link
            to="/login"
            state={{ from: { pathname: `/events/${id}/register` } }}
            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
          >
            Login to Register
          </Link>
        </div>
      </div>
    );
  }

  if (isAlreadyRegistered) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-green-500 text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Already Registered</h1>
            <p className="text-gray-600 mb-6">
              You are already registered for this event!
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Registration Closed</h1>
            <p className="text-gray-600 mb-6">
              {isDeadlinePassed && "The registration deadline has passed."}
              {event.status !== 'upcoming' && "Registration is not available for this event."}
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to={`/events/${event._id}`}
                className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
              >
                Back to Event
              </Link>
              <Link
                to="/events"
                className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/events/${event._id}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event Details
          </Link>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Register for Event</h1>
            <h2 className="text-xl text-purple-600 font-semibold mb-4">{event.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-purple-700 font-medium">Event Date</p>
                <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-red-700 font-medium">Registration Deadline</p>
                <p className="text-gray-600">{event.registrationDeadline ? new Date(event.registrationDeadline).toLocaleDateString() : 'No deadline set'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logged in user info display */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Registering as:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-purple-700 font-medium">Name</p>
                  <p className="text-purple-600">{user.name}</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Email</p>
                  <p className="text-purple-600">{user.email}</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Student ID</p>
                  <p className="text-purple-600">{user.studentId}</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Year</p>
                  <p className="text-purple-600">{user.year}</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Department</p>
                  <p className="text-purple-600">{user.department}</p>
                </div>
                <div>
                  <p className="text-purple-700 font-medium">Phone</p>
                  <p className="text-purple-600">{user.phone}</p>
                </div>
              </div>
            </div>

            {/* Event-Specific Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Event Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Animation Experience Level
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="Beginner">Beginner (0-1 years)</option>
                    <option value="Intermediate">Intermediate (1-3 years)</option>
                    <option value="Advanced">Advanced (3+ years)</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                
                {event.type === 'competition' && (
                  <div>
                    <label htmlFor="teamMembers" className="block text-sm font-medium text-gray-700 mb-2">
                      Team Members (if applicable)
                    </label>
                    <textarea
                      id="teamMembers"
                      name="teamMembers"
                      value={formData.teamMembers}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="List team member names and their roles (leave blank if participating individually)"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 mb-2">
                    What do you hope to gain from this event?
                  </label>
                  <textarea
                    id="expectations"
                    name="expectations"
                    value={formData.expectations}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Share your goals and expectations..."
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                  className="mt-1 mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                  I agree to the terms and conditions of the event. I understand that my participation is subject to the club's policies and guidelines. I consent to the use of my information for event-related communications. *
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                to={`/events/${event._id}`}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.agreeTerms}
                className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
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
