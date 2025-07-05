import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const EventDetails = () => {
  const { id } = useParams();
  const { 
    isAuthenticated, 
    isRegisteredForEvent, 
    hasSubmittedForEvent, 
    fetchEventById, 
    fetchEvents,
    fetchUserRegistrations 
  } = useAppContext();
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationChecked, setRegistrationChecked] = useState(false);
  
  // We'll determine these values after data is loaded - with safety checks
  const isRegistered = isAuthenticated && registrationChecked && isRegisteredForEvent ? isRegisteredForEvent(id) : false;
  const hasSubmitted = isAuthenticated && registrationChecked && hasSubmittedForEvent ? hasSubmittedForEvent(id) : false;

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the event first
        const fetchedEvent = await fetchEventById(id);
        if (!fetchedEvent) {
          setError('Event not found');
          setRegistrationChecked(true);
          return;
        }
        setEvent(fetchedEvent);
        
        // Then fetch all events for related events
        try {
          const allEvents = await fetchEvents();
          // Get related events of the same type
          const related = allEvents
            .filter(e => e._id !== id && e.type === fetchedEvent.type)
            .slice(0, 2);
          setRelatedEvents(related);
        } catch (eventsError) {
          console.warn('Could not load related events:', eventsError);
          // Continue without related events
        }
        
        // Fetch user registrations if authenticated
        if (isAuthenticated) {
          try {
            await fetchUserRegistrations();
            setRegistrationChecked(true);
          } catch (regError) {
            console.warn('Could not load user registrations:', regError);
            setRegistrationChecked(true);
          }
        } else {
          setRegistrationChecked(true);
        }
      } catch (error) {
        console.error('Error loading event:', error);
        if (error.response?.status === 404) {
          setError('Event not found');
        } else {
          setError('Failed to load event details. The event may not exist or there may be a connection issue.');
        }
        setRegistrationChecked(true);
      } finally {
        setLoading(false);
      }
    };

    // Reset state when ID changes
    setRegistrationChecked(false);
    setError(null);
    setEvent(null);
    setRelatedEvents([]);
    
    if (id) {
      loadEvent();
    }
  }, [id, fetchEventById, fetchEvents, isAuthenticated, fetchUserRegistrations]);

  if (loading) {
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
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The event you are looking for does not exist or has been removed.'}
          </p>
          <Link
            to="/events"
            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

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

  const getActionButton = () => {
    if (!event) return null;
    
    if (event.status === 'completed') {
      return null;
    }

    if (event.status === 'ongoing') {
      if (event.submissionRequired) {
        if (!isAuthenticated) {
          return (
            <Link
              to="/login"
              state={{ from: { pathname: `/events/${event._id}/submit` } }}
              className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
            >
              Login to Submit
            </Link>
          );
        }
        
        if (hasSubmitted) {
          return (
            <span className="text-green-600 font-medium text-lg">✓ Submission Completed</span>
          );
        }
        
        // For submission-only events (no registration required), allow direct submission
        if (!event.registrationRequired) {
          return (
            <Link
              to={`/events/${event._id}/submit`}
              className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
            >
              Submit Your Work
            </Link>
          );
        }
        
        if (isRegistered) {
          return (
            <Link
              to={`/events/${event._id}/submit`}
              className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-medium"
            >
              Submit Your Work
            </Link>
          );
        }
        
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
            <span className="text-red-500 font-medium text-lg">Registration Closed</span>
          );
        }
        
        return (
          <Link
            to={`/events/${event._id}/register`}
            className="bg-orange-500 text-white px-8 py-3 rounded-md hover:bg-orange-600 transition-colors font-medium"
          >
            Register to Submit
          </Link>
        );
      } else {
        return (
          <span className="text-green-600 font-medium text-lg">Event is Currently Ongoing</span>
        );
      }
    }

    // Upcoming events
    if (event.registrationRequired) {
      // Check if registration deadline has passed
      const hasDeadline = event.registrationDeadline;
      let isDeadlinePassed = false;
      
      if (hasDeadline) {
        const deadlineDate = new Date(event.registrationDeadline);
        const currentDate = new Date();
        
        // Create date objects at start of day for comparison (timezone safe)
        const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        
        // Registration is closed only if current date is AFTER deadline date
        isDeadlinePassed = currentDateOnly > deadlineDateOnly;;
      }
      
      if (isDeadlinePassed) {
        return (
          <span className="text-red-500 font-medium text-lg">Registration Deadline Passed</span>
        );
      }
      
      if (!isAuthenticated) {
        return (
          <Link
            to="/login"
            state={{ from: { pathname: `/events/${event._id}/register` } }}
            className="bg-purple-500 text-white px-8 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium text-lg"
          >
            Login to Register
          </Link>
        );
      }
      
      if (isRegistered) {
        return (
          <span className="text-green-600 font-medium text-lg">✓ You are registered for this event</span>
        );
      }
      
      return (
        <Link
          to={`/events/${event._id}/register`}
          className="bg-purple-500 text-white px-8 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium text-lg"
        >
          Register Now
        </Link>
      );
    }

    // Submission-only events (no registration required)
    if (event.submissionRequired && !event.registrationRequired) {
      if (!isAuthenticated) {
        return (
          <Link
            to="/login"
            state={{ from: { pathname: `/events/${event._id}/submit` } }}
            className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-medium text-lg"
          >
            Login to Submit
          </Link>
        );
      }
      
      if (hasSubmitted) {
        return (
          <span className="text-green-600 font-medium text-lg">✓ Submission Completed</span>
        );
      }
      
      // Check if submission deadline has passed
      if (event.submissionDeadline) {
        const deadlineDate = new Date(event.submissionDeadline);
        const currentDate = new Date();
        
        const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        
        if (currentDateOnly > deadlineDateOnly) {
          return (
            <span className="text-red-500 font-medium text-lg">Submission Deadline Passed</span>
          );
        }
      }
      
      return (
        <Link
          to={`/events/${event._id}/submit`}
          className="bg-green-500 text-white px-8 py-3 rounded-md hover:bg-green-600 transition-colors font-medium text-lg"
        >
          Submit Your Work
        </Link>
      );
    }

    return null;
  };

  // Additional safety check to ensure event exists before rendering
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-6">
            The event you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/events"
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/events"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </Link>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-64 md:h-80 object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-64 md:h-80 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🎬</div>
                <h2 className="text-2xl font-bold">{event.title}</h2>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Badges */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex space-x-3">
                <span className={`inline-block text-sm px-3 py-1 rounded-full font-semibold ${getStatusColor(event.status)}`}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </span>
                <span className={`inline-block text-sm px-3 py-1 rounded-full font-semibold ${getTypeColor(event.type)}`}>
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              {event.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {event.description}
            </p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Event Date</h3>
                  <p className="text-gray-600">
                    {event.date ? new Date(event.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Date TBA'}
                  </p>
                </div>

                {event.registrationDeadline && event.registrationRequired && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Registration Deadline</h3>
                    <p className="text-red-600 font-medium">
                      {new Date(event.registrationDeadline).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {event.submissionDeadline && event.submissionRequired && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Submission Deadline</h3>
                    <p className="text-orange-600 font-medium">
                      {new Date(event.submissionDeadline).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {event.instructor && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Instructor</h3>
                    <p className="text-gray-600">{event.instructor}</p>
                  </div>
                )}

                {event.duration && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Duration</h3>
                    <p className="text-gray-600">{event.duration}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
                  <p className="text-gray-600">
                    {event.venue && event.location 
                      ? `${event.venue}, ${event.location}`
                      : event.venue || event.location || 'Location TBA'
                    }
                  </p>
                </div>

                {event.price > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Price</h3>
                    <p className="text-green-600 font-semibold text-lg">${event.price}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {event.prizes && event.prizes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Prizes</h3>
                    <ul className="space-y-3">
                      {event.prizes.map((prize, index) => (
                        <li key={index} className="flex items-center">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full mr-3 shadow-md">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-gray-700">
                            <span className="font-semibold text-gray-800">{prize.position}:</span> {prize.prize}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {event.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-gray-600">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {event.winners && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Winners</h3>
                    <ul className="space-y-2">
                      {event.winners.map((winner, index) => (
                        <li key={index} className="flex items-center">
                          <span className="inline-block w-6 h-6 bg-gold text-yellow-800 rounded-full text-xs font-bold text-center leading-6 mr-3">
                            🏆
                          </span>
                          <span className="text-gray-600">
                            {typeof winner === 'string' ? winner : `${winner.participant} - ${winner.title} (${winner.prize})`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center border-t border-gray-200 pt-8">
              {getActionButton()}
            </div>
          </div>
        </div>

        {/* Related Events */}
        {relatedEvents && relatedEvents.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Other Events You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <Link
                  key={relatedEvent._id}
                  to={`/events/${relatedEvent._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {relatedEvent.image ? (
                    <img
                      src={relatedEvent.image}
                      alt={relatedEvent.title}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-2xl">🎬</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">{relatedEvent.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{relatedEvent.description}</p>
                    <p className="text-purple-600 text-sm font-medium mt-2">
                      {relatedEvent.date ? new Date(relatedEvent.date).toLocaleDateString() : 'Date TBA'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
