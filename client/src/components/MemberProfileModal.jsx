import React from 'react';
import { X, Calendar, Award, Users, Mail, MapPin, Star, Briefcase } from 'lucide-react';
import Tilt from 'react-parallax-tilt';


const MemberProfileModal = ({ member, onClose }) => {
    if (!member) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const isLeadershipRole = ['president', 'vice-president', 'secretary', 'joint-secretary', 'treasurer'].includes(member.currentPosition?.role);
    const isExecutiveRole = ['technical-head', 'creative-head', 'events-head', 'marketing-head', 'operations-head'].includes(member.currentPosition?.role);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <Tilt
    glareEnable={true}
    glareMaxOpacity={0}
    scale={1.02}
    transitionSpeed={400}
    className="w-full max-w-5xl"
  >
            <div className="w-full max-w-5xl transform hover:scale-[1.02] transition-transform duration-300">
                <div className="bg-[#0d0d0d] text-green-200 rounded-xl shadow-xl border border-teal-500 overflow-y-auto max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-[#0f3f3c] to-[#04211e] text-green-200 p-6">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-green-800/40 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Fixed Profile Image Container */}
                        <div className="flex-shrink-0 self-center sm:self-start">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-green-900/30 border-2 border-teal-500/50">
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
                              className="w-full h-full bg-green-700 flex items-center justify-center text-xl sm:text-2xl font-bold text-white"
                              style={{ display: member.profile?.profileImage ? 'none' : 'flex' }}
                            >
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </div>

                        {/* Member Details */}
                        <div className="flex-1 min-w-0">
                          {/* Name and Icons */}
                          <div className="flex items-center flex-wrap gap-2 mb-2">
                            <h1 className="text-lg sm:text-3xl font-bold text-emerald-200 break-words">{member.name}</h1>
                            {isLeadershipRole && <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />}
                            {isExecutiveRole && <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />}
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {member.currentPosition?.title || member.currentPosition?.role ? (
                              <span className="px-2 py-1 bg-emerald-900/50 text-emerald-300 border border-emerald-400 rounded text-xs sm:text-sm">
                                {member.currentPosition?.title || member.currentPosition?.role?.replace('-', ' ')}
                              </span>
                            ) : null}
                            {member.currentPosition?.department && (
                              <span className="px-2 py-1 bg-emerald-900/50 text-emerald-300 border border-emerald-400 rounded text-xs sm:text-sm">
                                {member.currentPosition.department}
                              </span>
                            )}
                            {member.membershipType && (
                              <span className="px-2 py-1 bg-emerald-900/50 text-emerald-300 border border-emerald-400 rounded text-xs sm:text-sm">
                                {member.membershipType}
                              </span>
                            )}
                          </div>

                          {/* Contact Info */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs sm:text-sm text-emerald-400">
                            <div className="flex items-center space-x-1">
                              <Mail className="w-4 h-4" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Since {formatDate(member.joinDate || member.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                          {member.profile?.bio && (
                            <div className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                              <h2 className="text-lg sm:text-xl font-semibold text-emerald-200 mb-2">About</h2>
                              <div className="space-y-2 text-sm">
                                <p className="text-emerald-300 text-sm sm:text-base leading-relaxed">{member.profile.bio}</p>
                              </div>
                            </div>
                          )}

                          {member.currentPosition && (
                            <div className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                              <h2 className="text-lg sm:text-xl font-semibold text-emerald-200 mb-2">Current Position</h2>
                              <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <h3 className="text-emerald-400 font-medium text-sm mb-1">Position</h3>
                                    <p className="text-sm">{member.currentPosition.title}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-emerald-400 font-medium text-sm mb-1">Department</h3>
                                    <p className="text-sm capitalize">{member.currentPosition.department}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-emerald-400 font-medium text-sm mb-1">Start Date</h3>
                                    <p className="text-sm">{formatDate(member.currentPosition.startDate)}</p>
                                  </div>
                                  <div>
                                    <h3 className="text-emerald-400 font-medium text-sm mb-1">Academic Period</h3>
                                    <p className="text-sm">{member.currentPosition.period}</p>
                                  </div>
                                </div>
                                {member.currentPosition.responsibilities?.length > 0 && (
                                  <div className="mt-3">
                                    <h3 className="text-emerald-400 font-medium text-sm mb-2">Responsibilities</h3>
                                    <ul className="list-disc list-inside text-emerald-300 text-sm space-y-1">
                                      {member.currentPosition.responsibilities.map((r, i) => (
                                        <li key={i}>{r}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {member.positionHistory?.length > 0 && (
                            <div className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                              <h2 className="text-lg sm:text-xl font-semibold text-emerald-200 mb-2">Position History</h2>
                              <div className="space-y-3">
                                {member.positionHistory.map((pos, i) => (
                                  <div key={i} className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <div className="flex-1">
                                        <h3 className="text-emerald-200 font-medium text-sm">{pos.title}</h3>
                                        <p className="text-emerald-400 text-xs capitalize">{pos.department}</p>
                                      </div>
                                      <span
                                        className={`px-2 py-1 bg-emerald-900/50 text-emerald-300 rounded border border-emerald-400 text-xs`}

                                      >
                                        {pos.role?.replace('-', ' ')}
                                      </span>
                                    </div>
                                    <div className="flex flex-wrap text-xs text-emerald-500 mb-2 gap-2">
                                      <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1" />
                                        <span>{formatDate(pos.startDate)} - {formatDate(pos.endDate)}</span>
                                      </div>
                                      <span className="hidden sm:inline">•</span>
                                      <span>{pos.period}</span>
                                    </div>
                                    {pos.responsibilities?.length > 0 && (
                                      <div>
                                        <p className="text-emerald-300 text-xs font-medium mb-1">Key Responsibilities:</p>
                                        <ul className="list-disc list-inside text-emerald-400 text-sm space-y-1">
                                          {pos.responsibilities.slice(0, 3).map((r, j) => (
                                            <li key={j}>{r}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Sidebar */}
                        <div className="space-y-4 lg:space-y-6">
                          <div className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                            <h3 className="text-emerald-200 font-semibold text-base sm:text-lg mb-2">Member Stats</h3>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-emerald-400">Total Positions</span>
                                <span>{(member.positionHistory?.length || 0) + 1}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-emerald-400">Member Since</span>
                                <span>{new Date(member.joinDate || member.createdAt).getFullYear()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-emerald-400">Status</span>
                                <span
                                  className={`px-2 py-1 bg-emerald-900/50 text-emerald-300 rounded border border-emerald-400 text-xs`}

                                >
                                  {member.status}
                                </span>
                                  
                              </div>
                            </div>
                          </div>

                          {member.profile?.skills?.length > 0 && (
                            <div className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                              <h3 className="text-emerald-200 font-semibold text-base sm:text-lg mb-2">Skills</h3>
                              <div className="flex flex-wrap gap-2">
                                {member.profile.skills.map((skill, i) => (
                                  <span key={i} className="bg-emerald-800 text-emerald-200 px-2 py-1 text-xs rounded-full">{skill}</span>
                                ))}
                              </div>
                            </div>
                          )}

                          {member.profile?.experience?.level && (
                            <div className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                              <h3 className="text-emerald-200 font-semibold text-base sm:text-lg mb-2">Experience</h3>
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-emerald-400">Level</span>
                                  <span className="capitalize">{member.profile.experience.level}</span>
                                </div>
                                {member.profile.experience.yearsInAnimation && (
                                  <div className="flex justify-between">
                                    <span className="text-emerald-400">Years in Animation</span>
                                    <span>{member.profile.experience.yearsInAnimation}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {member.visibility?.contactAllowed && (
                            <div className="bg-[#111] border border-teal-800 rounded-lg p-3 sm:p-4">
                              <h3 className="text-emerald-200 font-semibold text-base sm:text-lg mb-2">Contact</h3>
                              <div className="text-sm space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Mail className="w-4 h-4 text-emerald-500" />
                                  <a href={`mailto:${member.email}`} className="text-emerald-300 hover:text-emerald-100 truncate">
                                    {member.email}
                                  </a>
                                </div>
                                {member.profile?.portfolio?.url && (
                                  <div className="flex items-center space-x-2">
                                    <Briefcase className="w-4 h-4 text-emerald-500" />
                                    <a
                                      href={member.profile.portfolio.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-emerald-300 hover:text-emerald-100 truncate"
                                    >
                                      View Portfolio
                                    </a>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </Tilt>
            
        </div>
    );
};

export default MemberProfileModal;
