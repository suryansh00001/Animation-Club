import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';
import MemberProfileModal from '../components/MemberProfileModal';
import Tilt from 'react-parallax-tilt';
import MemberCard from '../components/MemberCard';
import CountUp from 'react-countup';





const About = () => {
  const { settings, axios } = useAppContext();
  const [currentMembers, setCurrentMembers] = useState([]);
  const [previousMembers, setPreviousMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMembers();
  }, []);

  const handleViewProfile = (member) => {
    setSelectedMember(member);
  };

  const handleCloseProfile = () => {
    setSelectedMember(null);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      
      // Just fetch all members and sort them on frontend
      const response = await axios.get('/api/v1/users/members');
      if (response.data.success) {
        const allMembers = response.data.members;
        
        // Simple separation: active members vs alumni
        const active = allMembers.filter(member => 
          member.status === 'active' && member.membershipType === 'core'
        );
        const alumni = allMembers.filter(member => 
          member.status === 'alumni' || member.membershipType === 'alumni'
        );
        
        setCurrentMembers(active);
        setPreviousMembers(alumni);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  // Simple grouping - just by current role for active members
  const secretary = currentMembers.find(member => member.currentPosition?.role === 'secretary');
  const jointSecretaries = currentMembers.filter(member => member.currentPosition?.role === 'joint-secretary');
  const coreMembers = currentMembers.filter(member => member.currentPosition?.role === 'core-member');


  // Simple legacy member grouping - group by academic period from position history
  const legacyMembersByPeriod = {};
  
  previousMembers.forEach(member => {
    // Check position history for secretary/joint-secretary roles
    if (member.positionHistory && member.positionHistory.length > 0) {
      member.positionHistory.forEach(position => {
        if (['secretary', 'joint-secretary'].includes(position.role)) {
          const period = position.period || 'Unknown Period';
          
          if (!legacyMembersByPeriod[period]) {
            legacyMembersByPeriod[period] = [];
          }
          
          legacyMembersByPeriod[period].push({
            ...member,
            historicalRole: position.role,
            historicalTitle: position.title || position.role.replace('-', ' ')
          });
        }
      });
    }
  });

  // Sort periods in descending order (most recent first)
  const sortedPeriods = Object.keys(legacyMembersByPeriod).sort((a, b) => b.localeCompare(a));

  return (
    <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-emerald-400 mb-4">
            About Our Club
          </h1>
          <p className="text-sm sm:text-lg text-[#d1d5db] max-w-2xl mx-auto">
            Learn about our mission, vision, and the passionate individuals who make our club a thriving community.
          </p>
        </div>

      {/* About Section */}
  {/* Floating Background Effects */}
  <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 opacity-10 blur-[120px] rounded-full pointer-events-none animate-float" />
  <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-500 opacity-10 blur-[100px] rounded-full pointer-events-none animate-pulse" />

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Left Side – Text Card */}
      <div className="p-6 sm:p-10 rounded-2xl border border-emerald-400 bg-[#071b1a]/60 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-transform transform hover:scale-105 hover:rotate-[0.3deg] duration-500 overflow-hidden">
  <h3 className="text-xl font-semibold text-emerald-500 mb-2 mt-1">Our Mission</h3>
  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
    {settings.siteInfo.mission || 'To provide learning opportunities, industry connections, and creative platforms for students interested in animation and visual storytelling.'}
  </p>

  <h3 className="text-xl font-semibold text-emerald-500 mb-2 mt-4">Our Vision</h3>
  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
    {settings.siteInfo.vision || 'To foster creativity, innovation, and excellence in animation while building a supportive community of aspiring animators.'}
  </p>

  <h3 className="text-xl font-semibold text-emerald-500 mb-2 mt-4">Description</h3>
  <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
    {settings.siteInfo.description || 'A creative community dedicated to the art and craft of animation, bringing together students passionate about storytelling through motion.'}
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

  <div className="flex items-center space-x-2 text-sm text-gray-400 flex-wrap">
    <span className="flex items-center">
      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      Established {settings.siteInfo.established || '2020'}
    </span>
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
          className={`rounded-xl overflow-hidden border border-emerald-500 shadow-[0_0_15px_#10b98155] hover:shadow-[0_0_30px_#10b981aa] transition duration-500 transform hover:scale-105 backdrop-blur-sm ${
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

{/* Current Leadership */}
<div className="mb-20 mt-16 px-4">
  <h2 className="text-3xl font-bold text-emerald-400 text-center mb-10 font-orbitron">
    Current Leadership Team
  </h2>

  {loading ? (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
    </div>
  ) : (
    <>
      {/* Secretary */}
      {secretary && (
        <div className="mb-14 text-center">
          <h3 className="text-2xl font-semibold text-white mb-6 font-orbitron">
            Secretary
          </h3>
          <div className="mx-auto flex justify-center ">
            <Tilt glareEnable={true} glareMaxOpacity={0} scale={1.05}>
              <MemberCard member={secretary} onViewProfile={handleViewProfile} />
            </Tilt>
          </div>
        </div>
      )}

      {/* Joint Secretaries */}
      {jointSecretaries.length > 0 && (
        <div className="mb-14 text-center">
          <h3 className="text-2xl font-semibold text-white mb-6 text-center font-orbitron">
            {jointSecretaries.length > 1 ? 'Joint Secretaries' : 'Joint Secretary'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-1 justify-items-center">
  
            {jointSecretaries.map((member) => (
              <Tilt
                key={member._id}
                glareEnable={true}
                glareMaxOpacity={0}
                scale={1.05}
                className='mt-5'
              >
                <MemberCard member={member} onViewProfile={handleViewProfile} />
              </Tilt>
            ))}
          </div>
        </div>
      )}

     {/* Core Members */}
{coreMembers.length > 0 && (
  <div className="mb-10">
    <h3 className="text-2xl font-semibold text-white mb-6 text-center font-orbitron">
      Core Team
    </h3>

    {/* Scrollable row */}
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-6 px-10 py-10 min-w-full w-fit">
        {coreMembers.map((member) => (
          <Tilt
            key={member._id}
            glareEnable={true}
            glareMaxOpacity={0}
            scale={1.05}
          >
            <MemberCard member={member} onViewProfile={handleViewProfile} />
          </Tilt>
        ))}
      </div>
    </div>
  </div>
)}


    </>
  )}
</div>


{/* Previous Leadership */}
{sortedPeriods.length > 0 && (
  <div className="bg-gradient-to-br from-black via-[#011b17] to-black rounded-lg shadow-[0_0_15px_#10b98155] hover:shadow-[0_0_30px_#10b981aa] p-8 mb-12 border border-[#0f3f3c]">
    <h2 className="text-3xl font-bold text-emerald-400 text-center mb-8">
      Previous Leadership
    </h2>
    <div className="space-y-8">
      {sortedPeriods.map((period) => {
        const periodMembers = legacyMembersByPeriod[period];

        return (
          <div key={period} className=" border-[#064742] last:border-b-0 pb-8 last:pb-0">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              {period}
            </h3>

            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {periodMembers.map((member, index) => (
                <Tilt key={`${member._id}-${index}`} glareEnable={true} glareMaxOpacity={0} scale={1.05}>
                  <div className="bg-[#0d0d0d] border border-[#0f3f3c] shadow-[0_0_15px_#10b98155] hover:shadow-[0_0_30px_#10b981aa] rounded-lg p-4 text-center transition-all">
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-green-500 to-cyan-400 flex items-center justify-center overflow-hidden">
                      {member.profile?.profileImage ? (
                        <img 
                          src={member.profile.profileImage} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="text-black text-xl font-bold"
                        style={{ display: member.profile?.profileImage ? 'none' : 'flex' }}
                      >
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h5 className="text-base font-bold text-emerald-300 mb-1">{member.name}</h5>
                    <p className="text-white font-medium text-sm capitalize mb-2">
                      {member.historicalTitle}
                    </p>
                    <button
                      onClick={() => handleViewProfile(member)}
                      className="text-xs text-emerald-100 hover:text-emerald-300 font-medium transition-colors"
                    >
                      View Profile →
                    </button>
                  </div>
                </Tilt>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

        {/* Club Statistics */}
        {/* <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Club Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">{currentMembers.length}</div>
              <div className="text-purple-100">Current Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Events Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-purple-100">Awards Won</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-purple-100">Years Active</div>
            </div>
          </div>
        </div> */}
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Member Profile Modal */}
      {selectedMember && (
        <MemberProfileModal 
          member={selectedMember} 
          onClose={handleCloseProfile} 
        />
      )}
    </div>
  );
};

export default About;
