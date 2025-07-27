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

    const getRoleColor = (role) => {
        const roleColors = {
            'secretary': 'bg-green-800 text-green-200',
            'joint-secretary': 'bg-teal-800 text-teal-200',
            'core-member': 'bg-orange-800 text-orange-200',
        };
        return roleColors[role] || 'bg-gray-800 text-gray-200';
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

                        <div className="flex items-start space-x-6">
                            {/* Fixed Profile Image Container */}
                            <div className="flex-shrink-0">
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
                                        className="w-full h-full bg-green-700 flex items-center justify-center text-2xl font-bold text-white"
                                        style={{ display: member.profile?.profileImage ? 'none' : 'flex' }}
                                    >
                                        {member.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-bold text-teal-300 truncate">{member.name}</h1>
                                    {isLeadershipRole && <Award className="w-6 h-6 text-yellow-300 flex-shrink-0" />}
                                    {isExecutiveRole && <Star className="w-6 h-6 text-blue-400 flex-shrink-0" />}
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`px-2 py-1 bg-[#1e293b] text-emerald-300 rounded border border-emerald-400 text-xs`}>
                                        {member.currentPosition?.title || member.currentPosition?.role?.replace('-', ' ')}
                                    </span>
                                    <span className={`px-2 py-1 bg-[#1e293b] text-emerald-300 rounded border border-emerald-400 text-xs`}>
                                        {member.currentPosition?.department}
                                    </span>
                                    <span className={`px-2 py-1 bg-[#1e293b] text-emerald-300 rounded border border-emerald-400 text-xs`}>
                                        {member.membershipType}
                                    </span>
                                </div>
                                


                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-sm text-green-400">
                                    <div className="flex items-center space-x-1">
                                        <Mail className="w-4 h-4 flex-shrink-0" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4 flex-shrink-0" />
                                        <span>Since {formatDate(member.joinDate || member.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                {member.profile?.bio && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-teal-300 mb-3">About</h2>
                                        <div className="bg-[#111] rounded-lg p-4">
                                            <p className="text-green-300 leading-relaxed">{member.profile.bio}</p>
                                        </div>
                                    </div>
                                )}

                                {member.currentPosition && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-teal-300 mb-3">Current Position</h2>
                                        <div className="bg-[#111] border border-teal-800 rounded-lg p-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h3 className="font-medium text-green-400 mb-1">Position</h3>
                                                    <p>{member.currentPosition.title}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-green-400 mb-1">Department</h3>
                                                    <p className="capitalize">{member.currentPosition.department}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-green-400 mb-1">Start Date</h3>
                                                    <p>{formatDate(member.currentPosition.startDate)}</p>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-green-400 mb-1">Academic Period</h3>
                                                    <p>{member.currentPosition.period}</p>
                                                </div>
                                            </div>
                                            {member.currentPosition.responsibilities?.length > 0 && (
                                                <div className="mt-4">
                                                    <h3 className="font-medium text-green-400 mb-2">Responsibilities</h3>
                                                    <ul className="list-disc list-inside space-y-1">
                                                        {member.currentPosition.responsibilities.map((responsibility, index) => (
                                                            <li key={index}>{responsibility}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {member.positionHistory?.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-teal-300 mb-3">Position History</h2>
                                        <div className="space-y-3">
                                            {member.positionHistory.map((position, index) => (
                                                <div key={index} className="bg-[#111] border border-teal-800 rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-medium text-green-200">{position.title}</h3>
                                                            <p className="text-sm text-green-400 capitalize">{position.department}</p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getRoleColor(position.role)}`}>
                                                            {position.role?.replace('-', ' ')}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center text-sm text-green-500 mb-2 gap-2">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            <span>
                                                                {formatDate(position.startDate)} - {formatDate(position.endDate)}
                                                            </span>
                                                        </div>
                                                        <span className="hidden sm:inline">•</span>
                                                        <span>{position.period}</span>
                                                    </div>
                                                    {position.responsibilities?.length > 0 && (
                                                        <div className="mt-2">
                                                            <p className="text-sm font-medium text-green-300 mb-1">Key Responsibilities:</p>
                                                            <ul className="list-disc list-inside text-sm text-green-400">
                                                                {position.responsibilities.slice(0, 3).map((resp, idx) => (
                                                                    <li key={idx}>{resp}</li>
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

                            <div className="space-y-6">
                                <div className="bg-[#111] border border-teal-800 rounded-lg p-4">
                                    <h3 className="font-semibold text-teal-300 mb-3">Member Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-green-400">Total Positions</span>
                                            <span className="font-medium">{(member.positionHistory?.length || 0) + 1}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-green-400">Member Since</span>
                                            <span className="font-medium">{new Date(member.joinDate || member.createdAt).getFullYear()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-green-400">Status</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                member.status === 'active' ? 'bg-green-800 text-green-200' : 'bg-gray-800 text-gray-200'
                                            }`}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {member.profile?.skills?.length > 0 && (
                                    <div className="bg-[#111] border border-teal-800 rounded-lg p-4">
                                        <h3 className="font-semibold text-teal-300 mb-3">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {member.profile.skills.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-green-800 text-green-200 rounded-full text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {member.profile?.experience?.level && (
                                    <div className="bg-[#111] border border-teal-800 rounded-lg p-4">
                                        <h3 className="font-semibold text-teal-300 mb-3">Experience</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-green-400">Level</span>
                                                <span className="font-medium capitalize">{member.profile.experience.level}</span>
                                            </div>
                                            {member.profile.experience.yearsInAnimation && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-green-400">Years in Animation</span>
                                                    <span className="font-medium">{member.profile.experience.yearsInAnimation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {member.visibility?.contactAllowed && (
                                    <div className="bg-[#111] border border-teal-800 rounded-lg p-4">
                                        <h3 className="font-semibold text-teal-300 mb-3">Contact</h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Mail className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                <a href={`mailto:${member.email}`} className="text-green-300 hover:text-green-100 truncate">
                                                    {member.email}
                                                </a>
                                            </div>
                                            {member.profile?.portfolio?.url && (
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Briefcase className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    <a
                                                        href={member.profile.portfolio.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-green-300 hover:text-green-100 truncate"
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
