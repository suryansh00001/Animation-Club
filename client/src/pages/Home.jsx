import React, { useState,useRef, useEffect } from 'react';
import RippleGrid from './RippleGrid';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';
import TiltText from '../components/TiltText';
import NoEventsCard from '../components/NoEventsCard'; // Adjust the path if needed
import Tilt from 'react-parallax-tilt';
import CountUp from 'react-countup';


function useResponsiveSlice() {
  const getCount = () => {
    const width = window.innerWidth;
    if (width < 640) return 2; // mobile
    if (width < 1024) return 4; // tablet
    return 3; // laptop/desktop
  };
  const [count, setCount] = useState(getCount());
  useEffect(() => {
    const handleResize = () => setCount(getCount());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return count;
}




const Home = () => {
  const { fetchUpcomingEvents, events, settings, fetchAchievements } = useAppContext();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const sliceCount = useResponsiveSlice();

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
          setUpcomingEvents( upcoming && upcoming.length > 0 ? upcoming.slice(0, sliceCount) : []);
; // Show only first 3
          setRecentAchievements(achievementsData ? achievementsData.slice(0, 3) : []); // Show only first 3
        }
      } catch (error) {
        console.error('Error loading home data:', error);
        
        if (isMounted) {
          // Fallback to events from context or empty array
          const fallbackEvents = (events || []).filter(event => event.status === 'upcoming').slice(0, sliceCount);
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
  }, [sliceCount]); 

  return (
    <div className="min-h-screen">
    
      {/* Hero Section */}

<section className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-36 overflow-hidden">
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15 sm:py-24 md:py-18 lg:py-24 text-center">
    {/* RippleGrid background only for hero section */}
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
      <RippleGrid
        enableRainbow={false}
        gridColor="#10b981"
        rippleIntensity={0.08}
        gridSize={10.0}
        gridThickness={15.0}
        fadeDistance={1.5}
        vignetteStrength={2.0}
        glowIntensity={0.12}
        opacity={0.7}
        gridRotation={0}
        mouseInteraction={true}
        mouseInteractionRadius={1.2}
      />
    </div>

    {/* Content on top of RippleGrid, allow pointer events to pass through except for interactive elements */}
    <div className="relative z-10 pointer-events-none">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 leading-tight">
        <div>Welcome to the</div>
        <TiltText>
          <span className="drop-shadow-[0_0_5px_rgba(110,231,183,0.8)_0_0_15px_rgba(16,185,129,0.6)]">
            IIT BHU ANIMATION CLUB
          </span>
        </TiltText>
      </h1>

      <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
        {settings.siteInfo.description || 'Too Cool to stay still'}
      </p>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center px-4">
        <Link
          to="/events"
          className="pointer-events-auto px-4 py-2 text-sm sm:px-8 sm:py-3 sm:text-base bg-emerald-400 text-black rounded-full font-semibold hover:scale-105 transition-transform shadow-lg text-center"
        >
          EXPLORE EVENTS →
        </Link>
        <Link
          to="/register"
          className="pointer-events-auto px-4 py-2 text-sm sm:px-8 sm:py-3 sm:text-base border-2 border-emerald-400 text-emerald-300 rounded-full font-semibold hover:bg-emerald-400 hover:text-black transition-transform shadow-lg text-center"
        >
          JOIN US NOW
        </Link>
      </div>

    {/* RippleGrid ends here, content ends here */}
    </div>
  </div>

        




  

{/* Upcoming Events Section */}
<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-15  md:mt-24">
  <div className="text-center mb-12">
    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-emerald-400 drop-shadow-lg tracking-wide">
      Upcoming Events
    </h2>
    <p className="text-sm md:text-lg text-[#d1d5db] max-w-2xl mx-auto mt-4">
      Don’t miss out on exciting opportunities to learn, create, and connect with fellow animators.
    </p>
  </div>


    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loading ? (
        [...Array(sliceCount)].map((_, index) => (
          <div
            key={index}
            className="rounded-xl bg-[#0e1b1b] border border-green-800 animate-pulse p-6 shadow-neon"
          >
            <div className="h-48 bg-gray-800 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        ))
      ) : upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => (
<Tilt 
  key={event._id}
  glareEnable={true}
  glareMaxOpacity={0}
  glareColor="#00ffcc"
  glarePosition="all"
  scale={1.05}
  transitionSpeed={1000}
  tiltMaxAngleX={12}
  tiltMaxAngleY={12}
  className="rounded-xl"
>
  <div className="w-full h-full bg-white/10 border border-emerald-400/30 rounded-xl 
                  p-6 md:p-4 backdrop-blur-lg 
                  shadow-[0_0_20px_#00ffcc33] hover:shadow-[0_0_30px_#00ffcce6] 
                  transition duration-500 ease-in-out transform flex flex-col">
    
    {/* Image */}
    <img
      src={event.image || '/api/placeholder/400/200'}
      alt={event.title}
      className="w-full h-48 md:h-36 object-cover rounded-lg mb-4 shadow-inner shadow-emerald-700/30"
    />

    {/* Event type and date */}
    <div className="flex items-center justify-between mb-2 text-sm md:text-xs text-emerald-400">
      <span className="uppercase font-semibold">{event.type}</span>
      <span>{new Date(event.date).toLocaleDateString()}</span>
    </div>

    {/* Title */}
    <h3 className="text-xl md:text-lg font-bold text-white mb-2">
      {event.title}
    </h3>

    {/* Description */}
    <p className="text-gray-300 text-sm md:text-xs mb-4 line-clamp-3">
      {event.description}
    </p>

    {/* Location & Button */}
    <div className="mt-auto flex items-center justify-between gap-3 text-sm w-full">
      <span className="text-red-400 flex gap-1 text-sm md:text-xs leading-snug">
        <span>📍</span>
        <span className="overflow-hidden text-ellipsis [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
          {event.venue && event.location
            ? `${event.venue}, ${event.location}`
            : event.venue || event.location || 'Location TBA'}
        </span>
      </span>

      <Link
  to={`/events/${event._id}`}
  className="bg-emerald-400 hover:bg-emerald-300 text-black 
             px-3 py-2 rounded-lg shadow-md 
             w-[100px] h-[50px] flex items-center justify-between"
>
  <div className="flex flex-col justify-center text-left font-semibold leading-tight text-sm">
    <span>Learn</span>
    <span>More</span>
  </div>

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
</Link>


    </div>
  </div>
</Tilt>


        ))
      ) : (
<div className="col-span-full flex justify-center">
  <NoEventsCard />
</div>

      )}
    </div>

    <div className="text-center mt-12 z-10">
      <Link
        to="/events"
        className="inline-block bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold px-8 py-3 rounded-full shadow-xl hover:from-emerald-600 hover:to-emerald-400 hover:scale-105 transition-transform"
      >
        View All Events
      </Link>
    </div>
  </div>



      {/* About Section */}
  

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Side – Text Card */}
      <div className="p-10 rounded-2xl border border-emerald-400 bg-[#071b1a]/60 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-transform transform hover:scale-105 hover:rotate-[0.3deg] duration-500">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-8">
        About Our Club
      </h2>
        <p className="text-sm sm:text-base mb-6 text-gray-400 leading-relaxed">
          To foster creativity, innovation, and excellence in animation while building
          a supportive community of aspiring animators.
        </p>
        <p className="text-sm sm:text-base mb-6 text-gray-400 leading-relaxed">
          To provide learning opportunities, industry connections, and creative
          platforms for students interested in animation and visual storytelling.
        </p>
        <div className="flex flex-wrap justify-center md:gap-x-8 gap-y-4 mt-6 mb-8">
    <div className="text-center w-24">
  <div className="text-xl sm:text-3xl font-bold text-emerald-300 drop-shadow-[0_0_5px_#10b981]">
    <CountUp end={5} duration={5} />+
  </div>
  <div className="text-xs sm:text-sm text-gray-400">Years Active</div>
</div>

<div className="text-center w-24">
  <div className="text-xl sm:text-3xl font-bold text-emerald-300 drop-shadow-[0_0_5px_#10b981]">
    <CountUp end={200} duration={5} />+
  </div>
  <div className="text-xs sm:text-sm text-gray-400">Members</div>
</div>

<div className="text-center w-24">
  <div className="text-xl sm:text-3xl font-bold text-emerald-300 drop-shadow-[0_0_5px_#10b981]">
    <CountUp end={50} duration={5} />+
  </div>
  <div className="text-xs sm:text-sm text-gray-400">Events</div>
</div>

  </div>
  <div className="flex justify-center">
  <Link
    to="/about"
    className="inline-block bg-emerald-400 text-black px-6 py-3 rounded-md font-semibold shadow-lg hover:bg-emerald-300 hover:scale-105 transition-all duration-300"
  >
    Learn More
  </Link>
</div>

        
</div>
        

      {/* Right Side – Floating Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 transform-gpu transition-all duration-500">
      {[

  "https://i.ibb.co/wFJGT951/image.png",
  "https://i.ibb.co/fdG5JgQ5/image.png",
  "https://i.ibb.co/xqGWmLQF/image.png",
  "https://i.ibb.co/21YbHSd4/image.png"
]
.map((src, i) => (
        <div
          key={i}
          className={`rounded-xl overflow-hidden border border-[#34d399] shadow-[0_0_15px_#10b98155] hover:shadow-[0_0_30px_#10b981aa] transition duration-500 transform hover:scale-105 backdrop-blur-sm ${
            i % 2 === 0 ? 'translate-y-2' : 'translate-y-6'
          }`}
        >
          <img
            src={src}
            alt={`Club ${i}`}
            className="object-cover w-full h-full hover:scale-110 transition-transform duration-700"
          />
        </div>
      ))}
    </div>
    </div>
  </div>


      {/* Recent Achievements */}

<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
  <div className="text-center mb-12">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-4">
      Recent Achievements
    </h2>
    <p className="text-sm md:text-lg text-[#d1d5db] max-w-2xl mx-auto">
      Celebrating our members' outstanding accomplishments and milestones.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">

    {recentAchievements.map((achievement) => (
      <Tilt
        key={achievement._id}
        glareEnable={true}
        glareMaxOpacity={0}
        glareColor="#10b981"
        glarePosition="all"
        scale={1.02}
        transitionSpeed={1000}
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        className="rounded-xl allign-center justify-center flex items-center p-4"
      >
<div className="w-[250px] h-[300px] bg-white/5 backdrop-blur-md border border-[#10b981]/30 rounded-xl shadow-lg p-4 text-center hover:shadow-[0_0_25px_#10b98180] transition duration-300 flex flex-col justify-between">
  <img
    src={achievement?.image || 'https://placehold.co/400x200/e5e7eb/6b7280?text=Achievement'}
    alt={achievement.title}
    className="w-full h-32 object-cover rounded-lg mb-3"
    onError={(e) => {
      e.target.src = 'https://placehold.co/400x200/e5e7eb/6b7280?text=Achievement';
    }}
  />
  <div className="flex-1 overflow-hidden">
    <h3 className="text-lg font-bold text-[#f9fafb] mb-1 truncate">
      {achievement.title}
    </h3>
    <p className="text-xs text-[#9ca3af] mb-2 line-clamp-3">
      {achievement.description}
    </p>
  </div>
  <p className="text-sm text-[#34d399] font-medium">
    {achievement?.date
      ? new Date(achievement.date).toLocaleDateString()
      : 'Date not available'}
  </p>
</div>

      </Tilt>
    ))}
  </div>



 {/* View All Achievements Button */}
<div className="text-center mt-12 px-4">
  <Link
    to="/achievements"
    className="inline-block bg-gradient-to-r from-emerald-400 to-emerald-600 text-black font-semibold px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg hover:from-emerald-600 hover:to-emerald-400 hover:scale-105 transition-transform text-sm sm:text-base"
  >
    View All Achievements
  </Link>
</div>
</div>

{/* Call to Action Section */}
<div className="relative z-10 mt-20 py-10 px-4 bg-gradient-to-br from-emerald-800 to-teal-700 text-gray-200 shadow-[0_0_40px_#10b98155]">
  <div className="max-w-7xl mx-auto text-center">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
      Ready to Start Your Animation Journey?
    </h2>
    <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
      Join our vibrant community of animators and bring your creative visions to life.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <Link
        to="/register"
        className="w-full sm:w-auto text-center bg-[#10b981] text-black px-5 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-[#34d399] transition-transform duration-300 hover:scale-105 shadow-md"
      >
        Register Now
      </Link>
      <Link
        to="/contact"
        className="w-full sm:w-auto text-center bg-[#10b981] text-black px-5 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-[#34d399] transition-transform duration-300 hover:scale-105 shadow-md"
      >
        Contact Us
      </Link>
    </div>
  </div>
</div>

      </section>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
