import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';

const Opportunities = () => {
  const { 
    fetchEvents, 
    events: contextEvents, 
    isAuthenticated, 
    isRegisteredForEvent, 
    fetchUserRegistrations,
    opportunities,
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

  

  const filteredOpportunities = opportunities.filter(opportunity => {
    
    const statusMatch = filter === 'all' || opportunity.status === filter;
    return statusMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDynamicUpdateStatus = (date) => {
    const createdDate = new Date(date);
    const now = new Date();
    const diffInMs = now - createdDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 30) {
      return `Updated on ${createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}`;
    }

    if (diffInMinutes < 60) {
      return "Updated moments ago";
    } else if (diffInHours < 24) {
      return `Last modified ${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      return `Updated ${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Freelancing Opportunities
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting freelancing gigs in animation, design, and storytelling curated just for our club members. Gain real-world experience, build your portfolio, and earn while you create!
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
                <option value="all">All Opportunities</option>
                <option value="open">Open Opportunities</option>
                <option value="closed">Closed Opportunities</option>
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
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-8 bg-gray-300 rounded w-24">
                  </div>
                  </div>
                </div>
              </div>
            ))
          ) : filteredOpportunities.map((event) => (
            <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                {/* Status and Type Badges */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-block text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
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
                    Compensation: {event.compensation}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    { `Listed on ${new Date(event.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}`}
                  </div>
                  
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <Link
                    to={`/contact`}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors text-sm font-medium"
                  >
                    Contact Us
                  </Link>
                  <div className="flex items-center text-sm text-gray-500">
                    {getDynamicUpdateStatus(event.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>



        {/* No Opportunities Message */}
        {!loading && filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error ? 'Unable to load opportunities' : 
               events.length === 0 ? 'No opportunities available' : 
               'No opportunities match your filters'}
            </h3>
            <p className="text-gray-500">
              {error ? 'Please try refreshing the page or check your connection.' :
               events.length === 0 ? 'Check back soon for exciting new Opportunities!' :
               'Try adjusting your filters to see more opportunities.'}
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
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Opportunities;
