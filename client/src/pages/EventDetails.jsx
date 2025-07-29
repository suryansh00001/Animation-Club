import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Tilt from 'react-parallax-tilt';


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
    <div className="min-h-screen bg-[#0a0f0c] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06d6a0] mx-auto mb-4"></div>
        <p className="text-[#06d6a0]">Loading event details...</p>
      </div>
    </div>
  );
}


  if (error || !event) {
  return (
    <div className="min-h-screen bg-[#0a1a1a] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6 bg-emerald-800 rounded-lg shadow-md border border-[#06d6a0]">
        <div className="text-[#06d6a0] text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-4">Event Not Found</h2>
        <p className="text-[#94a3b8] mb-6">
          {error || 'The event you are looking for does not exist or has been removed.'}
        </p>
        <Link
          to="/events"
          className="bg-emerald-300  text-[#0f172a] px-6 py-3 rounded-md hover:bg-[#05c391] transition-colors font-medium shadow-md"
        >
          Back to Events
        </Link>
      </div>
    </div>
  );
}



  



  const getActionButton = () => {
  if (!event) return null;

  if (event.status === 'completed') return null;

  if (event.status === 'ongoing') {
    if (event.submissionRequired) {
      if (!isAuthenticated) {
        return (
          <Link
            to="/login"
            state={{ from: { pathname: `/events/${event._id}/submit` } }}
            className="bg-[#06d6a0] text-[#0f172a] px-8 py-3 rounded-md hover:bg-[#05c391] transition-colors font-medium"
          >
            Login to Submit
          </Link>
        );
      }

      if (hasSubmitted) {
        return (
          <span className="text-[#06d6a0] font-medium text-xl md:text-xl">✓ Submission Completed</span>
        );
      }

      const hasDeadline = event.registrationDeadline;
      let isDeadlinePassed = false;

      if (hasDeadline) {
        const deadlineDate = new Date(event.registrationDeadline);
        const currentDate = new Date();

        const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
        const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        isDeadlinePassed = currentDateOnly > deadlineDateOnly;
      }

      if (!event.registrationRequired || isRegistered) {
        return (
          <Link
            to={`/events/${event._id}/submit`}
            className="bg-[#06d6a0] text-[#0f172a] px-8 py-3 rounded-md hover:bg-[#05c391] transition-colors font-medium"
          >
            Submit Your Work
          </Link>
        );
      }

      if (isDeadlinePassed) {
        return (
          <span className="text-[#ef4444] font-medium text-xl md:text-xl">Registration Closed</span>
        );
      }

      return (
        <Link
          to={`/events/${event._id}/register`}
          className="bg-[#f97316] text-white px-8 py-3 rounded-md hover:bg-[#ea700c] transition-colors font-medium"
        >
          Register to Submit
        </Link>
      );
    } else {
      return (
        <span className="text-[#06d6a0] font-medium text-xl md:text-xl">Event is Currently Ongoing</span>
      );
    }
  }


   // Upcoming events
  if (event.registrationRequired) {
    const hasDeadline = event.registrationDeadline;
    let isDeadlinePassed = false;

    if (hasDeadline) {
      const deadlineDate = new Date(event.registrationDeadline);
      const currentDate = new Date();
      const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
      const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      isDeadlinePassed = currentDateOnly > deadlineDateOnly;
    }

    if (isDeadlinePassed) {
      return (
        <span className="text-red-500 font-medium text-xl md:text-xl">Registration Deadline Passed</span>
      );
    }

    if (!isAuthenticated) {
      return (
        <Link
          to="/login"
          state={{ from: { pathname: `/events/${event._id}/register` } }}
          className="bg-[#06d6a0]  text-[#0f172a] px-8 py-3 rounded-md hover:bg-[#05c391] transition-colors font-medium text-xs md:text-xl"
        >
          Login to Register
        </Link>
      );
    }

    if (isRegistered) {
      return (
        <span className="text-[#06d6a0] font-medium text-base md:text-xl">✓ You are registered for this event</span>
      );
    }

    return (
      <Link
        to={`/events/${event._id}/register`}
        className="bg-[#06d6a0]  text-[#0f172a] px-8 py-3 rounded-md hover:bg-[#05c391] transition-colors font-medium text-xs md:text-xl"
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
          className="bg-[#06d6a0] text-[#0f172a] px-8 py-3 rounded-md hover:bg-[#05c391] transition-colors font-medium text-xl md:text-xl"
        >
          Login to Submit
        </Link>
      );
    }

    if (hasSubmitted) {
      return (
        <span className="text-[#06d6a0] font-medium text-xl md:text-xl">✓ Submission Completed</span>
      );
    }

    if (event.submissionDeadline) {
      const deadlineDate = new Date(event.submissionDeadline);
      const currentDate = new Date();
      const deadlineDateOnly = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate());
      const currentDateOnly = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

      if (currentDateOnly > deadlineDateOnly) {
        return (
          <span className="text-red-500 font-medium text-xl md:text-xl">Submission Deadline Passed</span>
        );
      }
    }

    return (
      <Link
        to={`/events/${event._id}/submit`}
        className="bg-[#06d6a0] text-[#0f172a] px-8 py-3 rounded-md hover:bg-[#05c391] transition-colors font-medium text-xl md:text-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] py-8">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 lg:px-8">
    {/* Back Button */}
    <div className="mb-6">
      <Link
        to="/events"
        className="inline-flex items-center text-xs sm:text-base text-[#06d6a0] hover:text-[#05c391] font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Events
      </Link>
    </div>

    {/* Main Content */}
    <div className="bg-[#0a1a1a] rounded-lg shadow-[0_0_20px_#10b981] overflow-hidden border border-[#06d6a0]/20">
      {/* Hero Image */}
      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-64 md:h-80 object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div className="w-full h-64 md:h-80 bg-gradient-to-r from-[#06d6a0] to-[#2dd4bf] flex items-center justify-center">
          <div className="text-[#0f172a] text-center">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold">{event.title}</h2>
          </div>
        </div>
      )}

      <div className="p-8 text-[#94a3b8]">
        {/* Badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-3">
            <span className={`px-2 py-1  bg-emerald-900/50 text-emerald-300 rounded border border-emerald-400 text-xs`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
            <span className={`px-2 py-1  bg-emerald-900/50 text-emerald-300 rounded border border-emerald-400 text-xs`}>
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-xl  font-bold text-white mb-6">{event.title}</h1>

        {/* Description */}
        <p className="text-sm md:text-base mb-8 leading-relaxed">{event.description}</p>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl md:text-xl font-semibold text-white mb-2">Event Date</h3>
              <p className="text-sm md:text-base">{event.date ? new Date(event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Date TBA'}</p>
            </div>

            {event.registrationDeadline && event.registrationRequired && (
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-white mb-2">Registration Deadline</h3>
                <p className="text-red-500 text-sm md:text-base font-medium">
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
                <h3 className="text-xl md:text-xl font-semibold text-white mb-2">Submission Deadline</h3>
                <p className="text-orange-400 text-sm md:text-base font-medium">
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
                <h3 className="text-xl md:text-xl font-semibold text-white mb-2">Instructor</h3>
                <p className="text-sm md:text-base">{event.instructor}</p>
              </div>
            )}

            {event.duration && (
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-white mb-2">Duration</h3>
                <p className="text-sm md:text-base">{event.duration}</p>
              </div>
            )}

            <div>
              <h3 className="text-xl md:text-xl font-semibold text-white mb-2">Location</h3>
              <p className="text-sm md:text-base">
                {event.venue && event.location
                  ? `${event.venue}, ${event.location}`
                  : event.venue || event.location || 'Location TBA'}
              </p>
            </div>

            {event.price > 0 && (
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-white mb-2">Price</h3>
                <p className="text-green-400 text-sm md:text-base font-semibold">${event.price}</p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {event.prizes?.length > 0 && (
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-white mb-3">Prizes</h3>
                <ul className="space-y-3">
                  {event.prizes.map((prize, index) => (
                    <li key={index} className="flex items-center">
                      <span className="inline-flex items-center justify-center w-2 h-2 bg-emerald-500 rounded-full mr-3 shadow-md"></span>
                      <span className='text-sm md:text-base'><span className="font-semibold  text-white">{prize.position}:</span> {prize.prize}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.requirements?.length > 0 && (
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-white mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-[#06d6a0] text-sm md:text-base rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-sm md:text-base">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {event.winners?.length > 0 && (
              <div>
                <h3 className="text-xl md:text-xl font-semibold text-white mb-3">Winners</h3>
                <ul className="space-y-2">
                  {event.winners.map((winner, index) => (
                    <li key={index} className="flex items-center">
                      <span className="inline-block w-6 h-6 text-yellow-300 text-center text-xs mr-3">🏆</span>
                      <span>
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
        <div className="text-center border-t border-[#06d6a0]/20 pt-8">
          {getActionButton()}
        </div>
      </div>
    </div>

    {/* Related Events */}
    {relatedEvents?.length > 0 && (
<div className="mt-12">
  <h2 className="text-2xl sm:text-4xl mb-10 font-bold text-center text-emerald-400">Other Events You Might Like</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {relatedEvents.map((relatedEvent) => (
      <Tilt
        glareEnable={true}
        glareMaxOpacity={0.2}
        scale={1.03}
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        transitionSpeed={1200}
        key={relatedEvent._id}
        className="bg-[#0c1d17] rounded-xl overflow-hidden shadow-[0_0_16px_#06d6a0] hover:shadow-[0_0_24px_#06d6a0]/80 transition-all border border-emerald-500/30"
      >
        <Link to={`/events/${relatedEvent._id}`} className="block">
          {relatedEvent.image ? (
            <img
              src={relatedEvent.image}
              alt={relatedEvent.title}
              className="w-full h-40 object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-40 bg-gradient-to-r from-[#06d6a0] to-[#2dd4bf] flex items-center justify-center">
              <span className="text-[#0f172a] text-3xl">🎬</span>
            </div>
          )}
          <div className="p-4">
            <h3 className="text-xl md:text-xl font-semibold text-white mb-2">{relatedEvent.title}</h3>
            <p className="text-[#94a3b8] text-sm md:text-base line-clamp-2">{relatedEvent.description}</p>
            <p className="text-[#06d6a0] text-[.7rem] sm:text-xs font-medium mt-3">
              {relatedEvent.date ? new Date(relatedEvent.date).toLocaleDateString() : 'Date TBA'}
            </p>
          </div>
        </Link>
      </Tilt>
    ))}
  </div>
</div>
    )}
  </div>
</div>

  );
};

export default EventDetails;
