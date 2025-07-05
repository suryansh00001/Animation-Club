import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {
  const { fetchUpcomingEvents, events, settings, fetchAchievements } = useAppContext();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentAchievements, setRecentAchievements] = useState([]);

  useEffect(() => {
    let isMounted = true;
    
    const loadHomeData = async () => {
      try {
        setLoading(true);
        // Fetch upcoming events from API
        const upcoming = await fetchUpcomingEvents();
        
        // Fetch achievements from API
        const achievementsData = await fetchAchievements();
        
        if (isMounted) {
          setUpcomingEvents(upcoming ? upcoming.slice(0, 3) : []); // Show only first 3
          setRecentAchievements(achievementsData ? achievementsData.slice(0, 3) : []); // Show only first 3
        }
      } catch (error) {
        console.error('Error loading home data:', error);
        
        if (isMounted) {
          // Fallback to events from context or empty array
          const fallbackEvents = (events || []).filter(event => event.status === 'upcoming').slice(0, 3);
          setUpcomingEvents(fallbackEvents);
          setRecentAchievements([]); // Empty fallback for achievements
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadHomeData();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Remove events dependency to prevent re-renders

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to the
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                {settings.siteInfo.name || 'University Animation Club'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              {settings.siteInfo.description || 'A creative community dedicated to the art and craft of animation, bringing together students passionate about storytelling through motion.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explore Events
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Join Us Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-32 right-16 w-12 h-12 bg-pink-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-blue-400 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute bottom-32 right-1/3 w-20 h-20 bg-green-400 rounded-full opacity-15 animate-bounce delay-75"></div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Upcoming Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these exciting opportunities to learn, create, and connect with fellow animators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                      <div className="h-8 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <img
                    src={event.image || '/api/placeholder/400/200'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-semibold">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        📍 {event.venue && event.location 
                          ? `${event.venue}, ${event.location}`
                          : event.venue || event.location || 'Location TBA'
                        }
                      </span>
                      <Link
                        to={`/events/${event._id}`}
                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors text-sm font-medium"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No events message
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Upcoming Events</h3>
                <p className="text-gray-500">Check back soon for exciting new events!</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-block bg-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                About Our Club
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {settings.siteInfo.vision || 'To foster creativity, innovation, and excellence in animation while building a supportive community of aspiring animators.'}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {settings.siteInfo.mission || 'To provide learning opportunities, industry connections, and creative platforms for students interested in animation and visual storytelling.'}
              </p>
              <div className="flex items-center space-x-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">5+</div>
                  <div className="text-sm text-gray-500">Years Active</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">200+</div>
                  <div className="text-sm text-gray-500">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50+</div>
                  <div className="text-sm text-gray-500">Events</div>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-block bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80"
                alt="Club members working"
                className="rounded-lg shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80"
                alt="Animation workshop"
                className="rounded-lg shadow-md mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80"
                alt="Creative process"
                className="rounded-lg shadow-md -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&q=80"
                alt="Team collaboration"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Achievements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Recent Achievements
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Celebrating our members' outstanding accomplishments and milestones.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentAchievements.map((achievement) => (
              <div key={achievement._id} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <img
                  src={achievement?.image || 'https://placehold.co//400x200/e5e7eb/6b7280?text=Achievement'}
                  alt={achievement.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co//400x200/e5e7eb/6b7280?text=Achievement';
                  }}
                />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {achievement.description}
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  {achievement?.date ? new Date(achievement.date).toLocaleDateString() : 'Date not available'}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/achievements"
              className="inline-block bg-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              View All Achievements
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Animation Journey?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our vibrant community of animators and bring your creative visions to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Register Now
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
