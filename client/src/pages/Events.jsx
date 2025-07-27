import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';

const Events = () => {
  const { 
    fetchEvents, 
    events: contextEvents, 
    isAuthenticated, 
    isRegisteredForEvent, 
    fetchUserRegistrations 
  } = useAppContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    
    const loadEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch events from API
        const fetchedEvents = await fetchEvents();
        
        console.log('Events fetched:', fetchedEvents?.length || 0);
        console.log('Sample event data:', fetchedEvents?.[0]);
        console.log('Event IDs:', fetchedEvents?.map(e => ({ id: e._id, title: e.title })));
        
        if (isMounted) {
          setEvents(fetchedEvents || []);
        }
      } catch (error) {
        console.error('Error loading events:', error);
        
        if (isMounted) {
          setError(error.message);
          // Fallback to context events if available
          if (contextEvents && contextEvents.length > 0) {
            setEvents(contextEvents);
          } else {
            setEvents([]);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEvents();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Remove dependencies to prevent infinite re-renders

  // Fetch user registrations when component loads or when user authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserRegistrations();
    }
  }, [isAuthenticated, fetchUserRegistrations]);

  // Also refresh registrations when the page becomes visible (user returns from registration)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        fetchUserRegistrations();
      }
    };
    
    const handleFocus = () => {
      if (isAuthenticated) {
        fetchUserRegistrations();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, fetchUserRegistrations]);

  // Force refresh when component mounts (covers navigation back from registration page)
  useEffect(() => {
    if (isAuthenticated) {
      // Small delay to ensure the registration is processed
      const timeoutId = setTimeout(() => {
        fetchUserRegistrations();
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const filteredEvents = events.filter(event => {
    // Only show active events
    if (!event.isActive) return false;
    
    const statusMatch = filter === 'all' || event.status === filter;
    const typeMatch = typeFilter === 'all' || event.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'competition':
        return 'bg-purple-100 text-purple-800';
      case 'workshop':
        return 'bg-orange-100 text-orange-800';
      case 'seminar':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = (event) => {
    if (event.status === 'completed') {
      return (
        <span className="text-gray-500 text-sm">Event Completed</span>
      );
    }

    if (event.status === 'ongoing') {
      if (event.submissionRequired) {
        // Check if registration is required and if user is registered
        if (event.registrationRequired) {
          // Check if registration deadline has passed for ongoing events
          const hasDeadline = event.registrationDeadline;
          let isDeadlinePassed = false;
          
          if (hasDeadline) {
            const deadlineDate = new Date(event.registrationDeadline);
            const currentDate = new Date();
            
            // Create date objects at start of day for comparison (timezone safe)
            const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
            const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            
            // Registration is closed only if current date is AFTER deadline date
            isDeadlinePassed = currentDateOnly > deadlineDateOnly;
          }
          
          if (isDeadlinePassed) {
            return (
              <span className="text-red-500 text-sm">Registration Closed</span>
            );
          }
          
          // Check if user is registered (only if authenticated)
          if (isAuthenticated && isRegisteredForEvent(event._id)) {
  
            return (
              <Link
                to={`/events/${event._id}/submit`}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
              >
                Submit Work
              </Link>
            );
          }
          

          
          return (
            <Link
              to={`/events/${event._id}/register`}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Register to Submit
            </Link>
          );
        }
        
        return (
          <Link
            to={`/events/${event._id}/submit`}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Submit Work
          </Link>
        );
      } else {
        return (
          <span className="text-green-600 text-sm font-medium">Ongoing</span>
        );
      }
    }

    // Upcoming events
    if (event.registrationRequired) {
      // Check if there's a registration deadline and if it has passed
      const hasDeadline = event.registrationDeadline;
      let isDeadlinePassed = false;
      
      if (hasDeadline) {
        const deadlineDate = new Date(event.registrationDeadline);
        const currentDate = new Date();
        
        // Create date objects at start of day for comparison
        const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        
        // Registration is open if current date is less than or equal to deadline date
        isDeadlinePassed = currentDateOnly > deadlineDateOnly;
        

      }
      
      if (isDeadlinePassed) {
        return (
          <span className="text-red-500 text-sm">Registration Closed</span>
        );
      }
      
      return (
        <Link
          to={`/events/${event._id}/register`}
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors text-sm font-medium"
        >
          Register Now
        </Link>
      );
    }

    return (
      <Link
        to={`/events/${event._id}`}
        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
      >
        View Details
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Club Events
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our exciting events, competitions, and workshops designed to enhance your animation skills.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="competition">Competition</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Loading skeleton
            [...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-8 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredEvents.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                {/* Status and Type Badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${getTypeColor(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>

                {/* Event Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date: {new Date(event.date).toLocaleDateString()}
                  </div>
                  
                  {event.registrationRequired && event.registrationDeadline && event.status === 'upcoming' && (
                    <div className="flex items-center text-sm text-red-500">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Registration Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/events/${event._id}`}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                  {getActionButton(event)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Events Message */}
        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error ? 'Unable to load events' : 
               events.length === 0 ? 'No events available' : 
               'No events match your filters'}
            </h3>
            <p className="text-gray-500">
              {error ? 'Please try refreshing the page or check your connection.' :
               events.length === 0 ? 'Check back soon for exciting new events!' :
               'Try adjusting your filters to see more events.'}
            </p>
            {error && (
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
              >
                Refresh Page
              </button>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Want to suggest an event?
          </h2>
          <p className="text-gray-600 mb-6">
            Have an idea for a workshop, competition, or seminar? We'd love to hear from you!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Events;
