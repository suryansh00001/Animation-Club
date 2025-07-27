import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';
import MemberProfileModal from '../components/MemberProfileModal';

// Member Card Component
const MemberCard = ({ member, onViewProfile }) => {
  const getPositionTitle = (member) => {
    return member.currentPosition?.title || 
           member.currentPosition?.role?.replace('-', ' ') || 
           'Member';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="h-64 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
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
          className="text-white text-6xl font-bold"
          style={{ display: member.profile?.profileImage ? 'none' : 'flex' }}
        >
          {member.name?.charAt(0).toUpperCase()}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xl font-bold text-gray-800">{member.name}</h4>
          <button
            onClick={() => onViewProfile(member)}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
          >
            View Profile →
          </button>
        </div>
        <p className="text-purple-600 font-semibold mb-3">
          {getPositionTitle(member)}
        </p>
        {member.profile?.bio && (
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
            {member.profile.bio}
          </p>
        )}
        <div className="space-y-2 text-sm text-gray-500">
          {member.email && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {member.email}
            </div>
          )}
          {member.currentPosition?.department && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h1a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {member.currentPosition.department.charAt(0).toUpperCase() + 
               member.currentPosition.department.slice(1)}
            </div>
          )}
          {member.currentPosition?.startDate && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Since {new Date(member.currentPosition.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short'
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
      const response = await axios.get('/api/v1/admin/members');
      if (response.data.success) {
        const allMembers = response.data.members;
        console.log('📊 All members fetched:', allMembers.length);
        console.log('📊 Sample member:', allMembers[0]);
        
        // Simple separation: active members vs alumni
        const active = allMembers.filter(member => 
          member.status === 'active' && member.membershipType === 'core'
        );
        const alumni = allMembers.filter(member => 
          member.status === 'alumni' || member.membershipType === 'alumni'
        );
        
        console.log('👥 Active members found:', active.length);
        console.log('📚 Alumni members found:', alumni.length);
        
        setCurrentMembers(active);
        setPreviousMembers(alumni);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      // Fallback: try the public endpoint
      try {
        const response = await axios.get('/api/v1/admin/members/public');
        if (response.data.success) {
          const allMembers = response.data.members;
          console.log('📊 Fallback: All members fetched:', allMembers.length);
          const active = allMembers.filter(member => member.status === 'active');
          const alumni = allMembers.filter(member => member.status === 'alumni');
          console.log('👥 Fallback: Active members found:', active.length);
          console.log('📚 Fallback: Alumni members found:', alumni.length);
          setCurrentMembers(active);
          setPreviousMembers(alumni);
        }
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Simple grouping - just by current role for active members
  const secretary = currentMembers.find(member => member.currentPosition?.role === 'secretary');
  const jointSecretaries = currentMembers.filter(member => member.currentPosition?.role === 'joint-secretary');
  const coreMembers = currentMembers.filter(member => member.currentPosition?.role === 'core-member');

  console.log('🔍 Current member breakdown:');
  console.log('  Secretary:', secretary?.name || 'None');
  console.log('  Joint Secretaries:', jointSecretaries.map(m => m.name));
  console.log('  Core Members:', coreMembers.map(m => m.name));

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

  console.log('🔍 Legacy member breakdown:');
  console.log('  Periods found:', sortedPeriods);
  sortedPeriods.forEach(period => {
    console.log(`  ${period}:`, legacyMembersByPeriod[period].map(m => `${m.name} (${m.historicalRole})`));
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            About Our Club
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn about our mission, vision, and the passionate individuals who make our club a thriving community.
          </p>
        </div>

        {/* Club Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{settings.siteInfo.name || 'University Animation Club'}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-2">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">{settings.siteInfo.mission || 'To provide learning opportunities, industry connections, and creative platforms for students interested in animation and visual storytelling.'}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-2">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">{settings.siteInfo.vision || 'To foster creativity, innovation, and excellence in animation while building a supportive community of aspiring animators.'}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-600 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{settings.siteInfo.description || 'A creative community dedicated to the art and craft of animation, bringing together students passionate about storytelling through motion.'}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Established {settings.siteInfo.established || '2020'}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80"
                alt="Club activities"
                className="rounded-lg shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80"
                alt="Animation workspace"
                className="rounded-lg shadow-md mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80"
                alt="Creative collaboration"
                className="rounded-lg shadow-md -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&q=80"
                alt="Team meeting"
                className="rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Current Leadership */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Current Leadership Team
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <>
              {/* Secretary */}
              {secretary && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold text-purple-600 mb-6 text-center">
                    Secretary
                  </h3>
                  <div className="max-w-md mx-auto">
                    <MemberCard member={secretary} onViewProfile={handleViewProfile} />
                  </div>
                </div>
              )}

              {/* Joint Secretaries */}
              {jointSecretaries.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold text-purple-600 mb-6 text-center">
                    {jointSecretaries.length > 1 ? 'Joint Secretaries' : 'Joint Secretary'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {jointSecretaries.map((member) => (
                      <MemberCard key={member._id} member={member} onViewProfile={handleViewProfile} />
                    ))}
                  </div>
                </div>
              )}

              {/* Core Members */}
              {coreMembers.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold text-purple-600 mb-6 text-center">
                    Core Team
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coreMembers.map((member) => (
                      <MemberCard key={member._id} member={member} onViewProfile={handleViewProfile} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Previous Leadership */}
        {sortedPeriods.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              Previous Leadership
            </h2>
            <div className="space-y-8">
              {sortedPeriods.map((period) => {
                const periodMembers = legacyMembersByPeriod[period];
                const secretaries = periodMembers.filter(m => m.historicalRole === 'secretary');
                const jointSecretaries = periodMembers.filter(m => m.historicalRole === 'joint-secretary');
                
                return (
                  <div key={period} className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4 text-center">
                      {period}
                    </h3>
                    
                    {/* Summary */}
                    <div className="text-center mb-6">
                      <p className="text-gray-600">
                        {secretaries.length > 0 && `${secretaries.length} Secretary${secretaries.length > 1 ? 's' : ''}`}
                        {secretaries.length > 0 && jointSecretaries.length > 0 && ' and '}
                        {jointSecretaries.length > 0 && `${jointSecretaries.length} Joint Secretary${jointSecretaries.length > 1 ? 's' : ''}`}
                      </p>
                    </div>

                    {/* Display all members for this period */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {periodMembers.map((member, index) => (
                        <div key={`${member._id}-${index}`} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                          <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
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
                              className="text-white text-xl font-bold"
                              style={{ display: member.profile?.profileImage ? 'none' : 'flex' }}
                            >
                              {member.name?.charAt(0).toUpperCase()}
                            </div>
                          </div>
                          <h5 className="text-base font-bold text-gray-800 mb-1">{member.name}</h5>
                          <p className="text-purple-600 font-medium text-sm capitalize mb-2">
                            {member.historicalTitle}
                          </p>
                          <button
                            onClick={() => handleViewProfile(member)}
                            className="text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                          >
                            View Profile →
                          </button>
                        </div>
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
