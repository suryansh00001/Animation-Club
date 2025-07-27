import React from 'react';
import { X, Calendar, Award, Users, Mail, MapPin, Star, Briefcase } from 'lucide-react';

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
            'secretary': 'bg-green-100 text-green-800',
            'joint-secretary': 'bg-teal-100 text-teal-800',
            'core-member': 'bg-orange-100 text-orange-800',
        };
        return roleColors[role] || 'bg-gray-100 text-gray-800';
    };

    const isLeadershipRole = ['president', 'vice-president', 'secretary', 'joint-secretary', 'treasurer'].includes(member.currentPosition?.role);
    const isExecutiveRole = ['technical-head', 'creative-head', 'events-head', 'marketing-head', 'operations-head'].includes(member.currentPosition?.role);

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2  hover:bg-[rgba(255,255,255,0.2)] rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="flex items-start space-x-6">
                        <div className="w-24 h-24 bg-[rgba(255,255,255,0.2)] rounded-full flex items-center justify-center">
                            {member.profile?.profileImage ? (
                                <img
                                    src={member.profile.profileImage}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div 
                                className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                                style={{ display: member.profile?.profileImage ? 'none' : 'flex' }}
                            >
                                {member.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-3xl font-bold">{member.name}</h1>
                                {isLeadershipRole && <Award className="w-6 h-6 text-yellow-300" />}
                                {isExecutiveRole && <Star className="w-6 h-6 text-blue-300" />}
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.currentPosition?.role)}`}>
                                    {member.currentPosition?.title || member.currentPosition?.role?.replace('-', ' ')}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm bg-[rgba(255,255,255,0.2)] text-white">
                                    {member.currentPosition?.department}
                                </span>
                                <span className="px-3 py-1 rounded-full text-sm bg-[rgba(255,255,255,0.2)] text-white">
                                    {member.membershipType}
                                </span>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-purple-100">
                                <div className="flex items-center space-x-1">
                                    <Mail className="w-4 h-4" />
                                    <span>{member.email}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>Since {formatDate(member.joinDate || member.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Bio */}
                            {member.profile?.bio && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3">About</h2>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-700 leading-relaxed">{member.profile.bio}</p>
                                    </div>
                                </div>
                            )}

                            {/* Current Position Details */}
                            {member.currentPosition && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Current Position</h2>
                                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-1">Position</h3>
                                                <p className="text-gray-900">{member.currentPosition.title}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-1">Department</h3>
                                                <p className="text-gray-900 capitalize">{member.currentPosition.department}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-1">Start Date</h3>
                                                <p className="text-gray-900">{formatDate(member.currentPosition.startDate)}</p>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-700 mb-1">Academic Period</h3>
                                                <p className="text-gray-900">{member.currentPosition.period}</p>
                                            </div>
                                        </div>
                                        
                                        {member.currentPosition.responsibilities && member.currentPosition.responsibilities.length > 0 && (
                                            <div className="mt-4">
                                                <h3 className="font-medium text-gray-700 mb-2">Responsibilities</h3>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {member.currentPosition.responsibilities.map((responsibility, index) => (
                                                        <li key={index} className="text-gray-700">{responsibility}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Position History */}
                            {member.positionHistory && member.positionHistory.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-3">Position History</h2>
                                    <div className="space-y-3">
                                        {member.positionHistory.map((position, index) => (
                                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{position.title}</h3>
                                                        <p className="text-sm text-gray-600 capitalize">{position.department}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(position.role)}`}>
                                                        {position.role?.replace('-', ' ')}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <Calendar className="w-4 h-4 mr-1" />
                                                    <span>
                                                        {formatDate(position.startDate)} - {formatDate(position.endDate)}
                                                    </span>
                                                    <span className="mx-2">•</span>
                                                    <span>{position.period}</span>
                                                </div>
                                                
                                                {position.responsibilities && position.responsibilities.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-sm font-medium text-gray-700 mb-1">Key Responsibilities:</p>
                                                        <ul className="list-disc list-inside text-sm text-gray-600">
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

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Member Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Total Positions</span>
                                        <span className="font-medium text-gray-900">
                                            {(member.positionHistory?.length || 0) + 1}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Member Since</span>
                                        <span className="font-medium text-gray-900">
                                            {new Date(member.joinDate || member.createdAt).getFullYear()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Status</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {member.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            {member.profile?.skills && member.profile.skills.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {member.profile.skills.map((skill, index) => (
                                            <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Experience Level */}
                            {member.profile?.experience?.level && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Experience</h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Level</span>
                                            <span className="font-medium text-gray-900 capitalize">
                                                {member.profile.experience.level}
                                            </span>
                                        </div>
                                        {member.profile.experience.yearsInAnimation && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Years in Animation</span>
                                                <span className="font-medium text-gray-900">
                                                    {member.profile.experience.yearsInAnimation}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Contact Info */}
                            {member.visibility?.contactAllowed && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            <a href={`mailto:${member.email}`} className="text-purple-600 hover:text-purple-800">
                                                {member.email}
                                            </a>
                                        </div>
                                        {member.profile?.portfolio?.url && (
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                <a 
                                                    href={member.profile.portfolio.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-purple-600 hover:text-purple-800"
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
    );
};

export default MemberProfileModal;
