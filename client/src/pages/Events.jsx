import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';
import Tilt from 'react-parallax-tilt';

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
                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-red-500 transition-colors text-sm font-medium"
              >
                Submit Work
              </Link>
            );
          }
          

          
          return (
            <Link
              to={`/events/${event._id}/register`}
              className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Register to Submit
            </Link>
          );
        }
        
        return (
          <Link
            to={`/events/${event._id}/submit`}
            className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
          >
            Submit Work
          </Link>
        );
      } else {
        return (
          <span className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium">Ongoing</span>
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
          className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-green-400 transition-colors text-sm font-medium"
        >
          Register Now
        </Link>
      );
    }

    return (
      <Link
        to={`/events/${event._id}`}
        className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-colors text-sm font-medium"
      >
        View Details
      </Link>
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-24 overflow-hidden">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="text-center mb-12">
      <h1 className="text-2xl sm:text-4xl font-bold text-emerald-400 mb-4">Club Events</h1>
      <p className="text-sm sm:text-lg text-[#d1d5db] max-w-2xl mx-auto">
        Explore our exciting events, competitions, and workshops designed to enhance your animation skills.
      </p>
    </div>

    {/* Filters */}
    <div className="bg-[#0a1a1a] rounded-lg shadow-[0_0_20px_#10b981] p-6 mb-8 border border-emerald-600/30">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-[#94a3b8] mb-2">Filter by Status</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-[#0a1a1a] border text-sm sm:text-[0.9rem] border-[#06d6a0]/40 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#06d6a0]"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex-1">
          <label className="block text-sm font-medium  text-[#94a3b8] mb-2">Filter by Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-[#0a1a1a] border border-[#06d6a0]/40 text-white text-sm sm:text-[0.9rem] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#06d6a0]"
          >
            <option value="all">All Types</option>
            <option value="competition">Competition</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
          </select>
        </div>
      </div>
    </div>

<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
  {loading ? (
    [...Array(6)].map((_, index) => (
      <div key={index} className="bg-emerald-900 rounded-lg shadow-lg overflow-hidden animate-pulse">
        <div className="w-full h-48 bg-emerald-800"></div>
        <div className="p-6">
          <div className="h-4 bg-emerald-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-emerald-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-emerald-700 rounded w-1/2 mb-4"></div>
          <div className="h-6 bg-emerald-700 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-emerald-700 rounded w-1/3"></div>
        </div>
      </div>
    ))
  ) : filteredEvents.map((event) => (
    <Tilt
      key={event._id}
      tiltMaxAngleX={10}
      tiltMaxAngleY={10}
      scale={1.03}
      transitionSpeed={400}
      className="rounded-lg"
    >
      <div className="bg-white/10 border border-emerald-400/30 rounded-xl shadow-[0_0_20px_#00ffcc33] hover:shadow-[0_0_30px_#00ffcce6] transition duration-500 ease-in-out transform max-w-sm w-full mx-auto h-[550px] flex flex-col justify-between overflow-hidden">
        
        {/* Image */}
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover"
        />

        {/* Body */}
        <div className="flex flex-col justify-between flex-grow p-4 sm:p-6">
          
          {/* Tags */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-2 py-1 bg-[#1e293b] text-emerald-300 border border-emerald-400 rounded text-xs">
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            <span className="px-2 py-1 bg-[#1e293b] text-emerald-300 border border-emerald-400 rounded text-xs">
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{event.title}</h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-4 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {event.description}
          </p>

          {/* Info */}
          <div className="text-sm text-emerald-300 space-y-2 mb-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date: {new Date(event.date).toLocaleDateString()}
            </div>

            {event.registrationRequired && event.registrationDeadline && event.status === 'upcoming' && (
              <div className="flex items-center text-red-400">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Registration Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-emerald-500/20">
            <Link
              to={`/events/${event._id}`}
              className="text-emerald-400 hover:text-emerald-300 font-medium text-sm whitespace-nowrap"
            >
              View Details →
            </Link>
            {getActionButton(event)}
          </div>
        </div>
      </div>
    </Tilt>
  ))}
</div>


    {/* No Events Message */}
    {!loading && filteredEvents.length === 0 && (
      <div className="text-center py-12">
        <div className="text-[#94a3b8] text-6xl mb-4">📅</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {error ? 'Unable to load events' : events.length === 0 ? 'No events available' : 'No events match your filters'}
        </h3>
        <p className="text-[#94a3b8]">
          {error ? 'Please try refreshing the page or check your connection.' :
            events.length === 0 ? 'Check back soon for exciting new events!' :
            'Try adjusting your filters to see more events.'}
        </p>
        {error && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#06d6a0] text-black px-4 py-2 rounded-md hover:bg-[#05c392] transition-colors"
          >
            Refresh Page
          </button>
        )}
      </div>
    )}

    {/* Call to Action */}
<div className="text-center mt-16 bg-[#064e3b] rounded-lg shadow-[0_0_20px_#10b981] p-10 border border-emerald-400/30 transition-all duration-300">
  <h2 className="text-2xl font-bold text-white mb-4">Want to suggest an event?</h2>
  <p className="text-[#94a3b8] mb-6">
    Have an idea for a workshop, competition, or seminar? We'd love to hear from you!
  </p>
  <Link
    to="/contact"
    className="inline-block bg-emerald-400 text-black px-6 py-3 rounded-md hover:bg-emerald-300 transition-colors font-semibold shadow-lg hover:shadow-[0_0_15px_#10b981]"
  >
    Contact Us
  </Link>
</div>
  </div>

  <ScrollToTop />
</div>

  );
};

export default Events;
