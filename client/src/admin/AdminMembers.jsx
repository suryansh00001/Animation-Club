import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../context/adminContext';
import { Plus, Edit, Trash2, Eye, UserPlus, User, Crown, Users, Calendar, Award } from 'lucide-react';

const AdminMembers = () => {
    const { 
        members, 
        loading, 
        getMembers, 
        createMember, 
        updateMember, 
        updateMemberProfile,
        deleteMember,
        updateMemberPosition
    } = useAdminContext();

    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    
    // Filtering and search states
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [membershipFilter, setMembershipFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        membershipType: 'core',
        currentPosition: {
            role: 'core-member',
            department: 'general',
            responsibilities: []
        },
        profile: {
            bio: '',
            mobile: '',
            profileImage: '',
            skills: []
        },
        dept : '',
        status: 'active'
    });

    const [promotionData, setPromotionData] = useState({
        role: 'core-member',
        department: 'general',
        responsibilities: [],
        reason: ''
    });

    const [profileData, setProfileData] = useState({
        bio: '',
        mobile: '',
        profileImage: '',
        skills: []
    });

    // State for legacy member import
    const [showLegacyForm, setShowLegacyForm] = useState(false);
    const [legacyMemberData, setLegacyMemberData] = useState({
        name: '',
        email: '',
        membershipType: 'alumni',
        previousPositions: [{
            title : '',
            role: 'secretary',
            department: 'leadership',
            startDate: '',
            endDate: '',
            period: '',
            responsibilities: []
        }],
        dept : '',
        profile: {
            bio: '',
            mobile: '',
            profileImage: '',
            skills: []
        },
        status: 'alumni'
    });

    // Academic year calculation helper
    const getCurrentAcademicYear = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        if (month >= 6) { // July onwards
            return `${year}-${year + 1}`;
        } else { // January to June
            return `${year - 1}-${year}`;
        }
    };

    const currentAcademicYear = getCurrentAcademicYear();

    // Position role options with only allowed roles
    const positionRoles = [
        { value: 'secretary', label: 'Secretary', type: 'leadership', department: 'leadership' },
        { value: 'joint-secretary', label: 'Joint Secretary', type: 'leadership', department: 'leadership' },
        { value: 'core-member', label: 'Core Team Member', type: 'core', department: 'general' }
    ];

    const departments = [
        { value: 'leadership', label: 'Leadership' },
        { value: 'general', label: 'General' }
    ];


    useEffect(() => {
        getMembers();
    }, []);

    // Filter members based on search and filter criteria
    const filteredMembers = members.filter(member => {
        const matchesSearch = searchTerm === '' || 
            member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.currentPosition?.title?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || member.currentPosition?.role === roleFilter;
        const matchesMembership = membershipFilter === 'all' || member.membershipType === membershipFilter;
        const matchesDepartment = departmentFilter === 'all' || member.currentPosition?.department === departmentFilter;
        
        return matchesSearch && matchesRole && matchesMembership && matchesDepartment;
    });

    const handleCreateMember = async (e) => {
        e.preventDefault();
        try {
            await createMember(formData);
            setShowForm(false);
            setFormData({
                name: '',
                email: '',
                membershipType: 'core',
                currentPosition: {
                    role: 'core-member',
                    department: 'general',
                    responsibilities: []
                },
                profile: {
                    bio: '',
                    mobile: '',
                    profileImage: '',
                    skills: []
                },
                status: 'active',
                dept : '',
            });
        } catch (error) {
            console.error('Error creating member:', error);
        }
    };

    const handleUpdateMember = async (e) => {
        e.preventDefault();
        try {
            await updateMember(editingMember._id, formData);
            setEditingMember(null);
            setFormData({
                name: '',
                email: '',
                membershipType: 'core',
                currentPosition: {
                    role: 'core-member',
                    department: 'general',
                    responsibilities: []
                },
                profile: {
                    bio: '',
                    mobile: '',
                    profileImage: '',
                    skills: []
                },
                status: 'active',
                dept : '',
            });
        } catch (error) {
            console.error('Error updating member:', error);
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (window.confirm('Are you sure you want to remove this member? This action cannot be undone.')) {
            try {
                await deleteMember(memberId);
            } catch (error) {
                console.error('Error deleting member:', error);
            }
        }
    };

    const handleUpdatePosition = async (memberId, positionData) => {
        try {
            await updateMemberPosition(memberId, positionData);
            setShowPromotionModal(false);
            setEditingMember(null);
        } catch (error) {
            console.error('Error updating position:', error);
        }
    };


    // Handle profile editing
    const handleEditProfile = (member) => {
        setEditingProfile(member);
        setProfileData({
            bio: member.profile?.bio || '',
            mobile: member.profile?.mobile || '',
            profileImage: member.profile?.profileImage || '',
            skills: member.profile?.skills || [],
            dept : member?.dept || '',
        });
        setShowProfileModal(true);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        if (!editingProfile) return;

        try {
            await updateMemberProfile(editingProfile._id, profileData);
            setShowProfileModal(false);
            setEditingProfile(null);
            setProfileData({
                bio: '',
                mobile: '',
                profileImage: '',
                skills: [],
                dept : '',
            });
            // Refresh members list
            getMembers();
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleAddSkill = () => {
        setProfileData(prev => ({
            ...prev,
            skills: [...prev.skills, '']
        }));
    };

    const handleUpdateSkill = (index, value) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.map((skill, i) => i === index ? value : skill)
        }));
    };

    const handleRemoveSkill = (index) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const getRoleColor = (role) => {
        const roleColors = {
            'secretary': 'bg-green-100 text-green-800',
            'joint-secretary': 'bg-teal-100 text-teal-800',
            'core-member': 'bg-orange-100 text-orange-800'
        };
        return roleColors[role] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Helper function to get proper title from role
    const getRoleTitle = (role) => {
        const roleTitleMap = {
            'secretary': 'Secretary',
            'joint-secretary': 'Joint Secretary',
            'core-member': 'Core Team Member'
        };
        return roleTitleMap[role] || role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    

    // Update the handleAddLegacyMember function
    const handleAddLegacyMember = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!legacyMemberData.name || !legacyMemberData.email) {
            alert('Name and email are required');
            return;
        }
        
        // Validate at least one position with role and period
        const validPositions = legacyMemberData.previousPositions.filter(pos => 
            pos.role && pos.period && pos.role !== '' && pos.period !== ''
        );
        
        if (validPositions.length === 0) {
            alert('At least one position with role and period is required for legacy members');
            return;
        }
        
        
        
        try {
            // Process previous positions into position history
            const positionHistory = legacyMemberData.previousPositions
                .filter(pos => pos.role && pos.period) // Only include positions with role and period
                .map(pos => ({
                    title: getRoleTitle(pos.role), // Always derive title from role
                    role: pos.role,
                    department: pos.department || 'leadership',
                    responsibilities: Array.isArray(pos.responsibilities) ? pos.responsibilities : [],
                    startDate: pos.startDate ? new Date(pos.startDate) : null,
                    endDate: pos.endDate ? new Date(pos.endDate) : null,
                    period: pos.period,
                    achievements: []
                }));

            // Create legacy member with no current position (alumni)
            const memberData = {
                name: legacyMemberData.name,
                email: legacyMemberData.email,
                membershipType: 'alumni',
                currentPosition: {
                    title: 'Alumni',
                    role: 'core-member',
                    department: 'general',
                    responsibilities: [],
                    isActive: false
                },
                positionHistory: positionHistory,
                profile: {
                    bio: legacyMemberData.profile?.bio || '',
                    mobile: legacyMemberData.profile?.mobile || '',
                    profileImage: legacyMemberData.profile?.profileImage || '',
                    skills: legacyMemberData.profile?.skills || []
                },
                status: 'alumni'
            };
            await createMember(memberData);
            
            // Reset form
            setLegacyMemberData({
                name: '',
                email: '',
                membershipType: 'alumni',
                previousPositions: [{
                    role: 'secretary',
                    department: 'leadership',
                    startDate: '',
                    endDate: '',
                    period: '',
                    responsibilities: []
                }],
                profile: {
                    bio: '',
                    mobile: '',
                    profileImage: '',
                    skills: []
                },
                status: 'alumni',
                dept : '',
            });
            setShowLegacyForm(false);
        } catch (error) {
            console.error('Failed to add legacy member:', error);
        }
    };

    // Add position to legacy member
    const addLegacyPosition = () => {
        setLegacyMemberData(prev => ({
            ...prev,
            previousPositions: [...prev.previousPositions, {
                role: 'secretary',
                department: 'leadership',
                startDate: '',
                endDate: '',
                period: '',
                responsibilities: [],
                dept : ''
            }]
        }));
    };

    // Remove position from legacy member
    const removeLegacyPosition = (index) => {
        setLegacyMemberData(prev => ({
            ...prev,
            previousPositions: prev.previousPositions.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Members Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage club members, positions, and organizational structure
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => {
                                // Reset form data for new member
                                setFormData({
                                    name: '',
                                    email: '',
                                    membershipType: 'core',
                                    currentPosition: {
                                        role: 'core-member',
                                        department: 'general',
                                        responsibilities: []
                                    },
                                    profile: {
                                        bio: '',
                                        mobile: '',
                                        profileImage: '',
                                        skills: []
                                    },
                                    status: 'active',
                                    dept : '',
                                });
                                setEditingMember(null);
                                setShowForm(true);
                            }}
                            className="block rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500"
                        >
                            <Plus className="h-4 w-4 inline mr-2" />
                            Add Member
                        </button>
                        <button
                            onClick={() => setShowLegacyForm(true)}
                            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                            <Users className="h-4 w-4 inline mr-2" />
                            Add Legacy Member
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-8 bg-white shadow rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5a7 7 0 100 14 7 7 0 000-14zm0 0V3m0 18v-2m8-6h2M3 12h2" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    {/* Role Filter */}
                    <div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="all">All Roles</option>
                            <option value="secretary">Secretary</option>
                            <option value="joint-secretary">Joint Secretary</option>
                            <option value="core-member">Core Team Member</option>
                        </select>
                    </div>

                    {/* Department Filter */}
                    <div>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="all">All Departments</option>
                            <option value="leadership">Leadership</option>
                            <option value="general">General</option>
                        </select>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center">
                        <span className="text-sm text-gray-500">
                            {filteredMembers.length} of {members.length} members
                        </span>
                    </div>
                </div>
            </div>

            {/* Members List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : filteredMembers.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {members.length === 0 ? 'Get started by adding a new member.' : 'Try adjusting your search or filters.'}
                        </p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {filteredMembers.map((member) => (
                            <li key={member._id} className="px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                {member.profile?.profileImage ? (
                                                    <img
                                                        src={member.profile.profileImage}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                        onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    ) : (<User className="h-6 w-6 text-purple-600" />)}
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {member.name}
                                                </p>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.currentPosition?.role)}`}>
                                                    {member.currentPosition?.role?.replace('-', ' ') || 'Member'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 mt-1">
                                                <p className="text-sm text-gray-500">{member.email}</p>
                                                <p className="text-sm text-gray-500">
                                                    {member?.dept?.charAt(0).toUpperCase() + member?.dept?.slice(1) || 'Not Found'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {member.currentPosition?.department?.charAt(0).toUpperCase() + member.currentPosition?.department?.slice(1) || 'General'}
                                                </p>
                                                {member.currentPosition?.startDate && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        Since {formatDate(member.currentPosition.startDate)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingMember(member);
                                                setShowPromotionModal(true);
                                            }}
                                            className="text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded-md"
                                            title="Update Position"
                                        >
                                            <Crown className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingMember(member);
                                                // Set complete form data for editing
                                                setFormData({
                                                    name: member.name || '',
                                                    email: member.email || '',
                                                    membershipType: member.membershipType || 'core',
                                                    currentPosition: {
                                                        role: member.currentPosition?.role || 'core-member',
                                                        department: member.currentPosition?.department || 'general',
                                                        responsibilities: member.currentPosition?.responsibilities || []
                                                    },
                                                    profile: {
                                                        bio: member.profile?.bio || '',
                                                        mobile: member.profile?.mobile || '',
                                                        profileImage: member.profile?.profileImage || '',
                                                        skills: member.profile?.skills || []
                                                    },
                                                    status: member.status || 'active'
                                                });
                                                setShowForm(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-900 p-2 hover:bg-indigo-50 rounded-md"
                                            title="Edit Member"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteMember(member._id)}
                                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-md"
                                            title="Delete Member"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Position History */}
                                {member.positionHistory && member.positionHistory.length > 0 && (
                                    <div className="mt-3 pl-14">
                                        <p className="text-xs font-medium text-gray-500 mb-2">Position History:</p>
                                        <div className="space-y-1">
                                            {member.positionHistory.slice(-3).map((position, index) => (
                                                <div key={index} className="flex items-center space-x-2 text-xs text-gray-500">
                                                    <span className="font-medium">{position.role?.replace('-', ' ')}</span>
                                                    <span>•</span>
                                                    <span>{position.period}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Create Member Modal */}
            {showForm && (
                <MemberForm
                    onSubmit={handleCreateMember}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingMember(null);
                    }}
                    title="Add New Member"
                    formData={formData}
                    setFormData={setFormData}
                />
            )}

            {/* Edit Member Modal */}
            {editingMember && !showPromotionModal && (
                <MemberForm
                    member={editingMember}
                    onSubmit={handleUpdateMember}
                    onCancel={() => {
                        setEditingMember(null);
                        setShowForm(false);
                    }}
                    title="Edit Member"
                    formData={formData}
                    setFormData={setFormData}
                />
            )}

            {/* Position Update Modal */}
            {showPromotionModal && editingMember && (
                <PositionForm
                    member={editingMember}
                    onSubmit={(data) => handleUpdatePosition(editingMember._id, data)}
                    onCancel={() => {
                        setShowPromotionModal(false);
                        setEditingMember(null);
                    }}
                    promotionData={promotionData}
                    setPromotionData={setPromotionData}
                />
            )}

            {/* Legacy Member Import Form */}
            {showLegacyForm && (
                <LegacyMemberForm 
                    onSubmit={handleAddLegacyMember}
                    onCancel={() => setShowLegacyForm(false)}
                    formData={legacyMemberData}
                    setFormData={setLegacyMemberData}
                    positionRoles={positionRoles}
                    departments={departments}
                    addLegacyPosition={addLegacyPosition}
                    removeLegacyPosition={removeLegacyPosition}
                />
            )}

            {/* Edit Profile Modal */}
            {showProfileModal && editingProfile && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Edit Profile - {editingProfile.name}</h3>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Bio
                                </label>
                                <textarea
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    rows="4"
                                    placeholder="Tell us about this member..."
                                />
                            </div>
                            
                            {/* Mobile */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    value={profileData.mobile}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, mobile: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Phone number"
                                />
                            </div>
                            
                            {/* Profile Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Profile Image URL
                                </label>
                                <input
                                    type="url"
                                    value={profileData.profileImage}
                                    onChange={(e) => setProfileData(prev => ({ ...prev, profileImage: e.target.value }))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="https://example.com/profile-image.jpg"
                                />
                                {profileData.profileImage && (
                                    <div className="mt-2">
                                        <img 
                                            src={profileData.profileImage} 
                                            alt="Profile preview" 
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            
                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Skills
                                </label>
                                <div className="space-y-2">
                                    {profileData.skills.map((skill, index) => (
                                        <div key={index} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => handleUpdateSkill(index, e.target.value)}
                                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                                placeholder="Enter skill"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-500 hover:text-purple-500 transition-colors"
                                    >
                                        + Add Skill
                                    </button>
                                </div>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowProfileModal(false);
                                        setEditingProfile(null);
                                    }}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Member Form Component
// Fix the MemberForm component to include profile image and other profile fields
// Update the MemberForm component to include profile image URL
const MemberForm = ({ member, onSubmit, onCancel, title, formData, setFormData }) => {
    // Initialize form data when member prop changes (for editing)
    useEffect(() => {
        if (member) {
            setFormData({
                name: member.name || '',
                email: member.email || '',
                membershipType: member.membershipType || 'core',
                currentPosition: {
                    role: member.currentPosition?.role || 'core-member',
                    department: member.currentPosition?.department || 'general',
                    responsibilities: member.currentPosition?.responsibilities || []
                },
                profile: {
                    bio: member.profile?.bio || '',
                    mobile: member.profile?.mobile || '',
                    profileImage: member.profile?.profileImage || '',
                    skills: member.profile?.skills || []
                },
                dept : member?.dept || '',
                status: member.status || 'active'
            });
        }
    }, [member, setFormData]);

    return (
        <div className="fixed inset-0 bg-[rgba(75,85,99,0.5)] overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <input
                                type="dept"
                                required
                                value={formData.dept}
                                onChange={(e) => setFormData(prev => ({ ...prev, dept: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        {/* Profile Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                            <input
                                type="url"
                                value={formData.profile?.profileImage || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    profile: { ...prev.profile, profileImage: e.target.value }
                                }))}
                                placeholder="https://example.com/profile-image.jpg"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                            {formData.profile?.profileImage && (
                                <div className="mt-2">
                                    <img 
                                        src={formData.profile.profileImage} 
                                        alt="Profile preview" 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                value={formData.profile?.bio || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    profile: { ...prev.profile, bio: e.target.value }
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                rows="3"
                                placeholder="Tell us about this member..."
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                            <input
                                type="tel"
                                value={formData.profile?.mobile || ''}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    profile: { ...prev.profile, mobile: e.target.value }
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                placeholder="Phone number"
                            />
                        </div>

                        {/* Membership Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Membership Type</label>
                            <select
                                value={formData.membershipType}
                                onChange={(e) => setFormData(prev => ({ ...prev, membershipType: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="core">Core</option>
                                <option value="alumni">Alumni</option>
                            </select>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={formData.currentPosition.role}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    currentPosition: { ...prev.currentPosition, role: e.target.value }
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="core-member">Core Team Member</option>
                                <option value="joint-secretary">Joint Secretary</option>
                                <option value="secretary">Secretary</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Work Department</label>
                            <select
                                value={formData.currentPosition.department}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    currentPosition: { ...prev.currentPosition, department: e.target.value }
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="general">General</option>
                                <option value="leadership">Leadership</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="alumni">Alumni</option>
                                <option value="graduated">Graduated</option>
                            </select>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                            >
                                {member ? 'Update' : 'Create'} Member
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Position Form Component
const PositionForm = ({ member, onSubmit, onCancel, promotionData, setPromotionData }) => {
    return (
        <div className="fixed inset-0 bg-[rgba(75,85,99,0.5)] overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Update Position for {member.name}
                    </h3>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Position Title</label>
                            <input
                                type="text"
                                required
                                value={promotionData.title}
                                onChange={(e) => setPromotionData(prev => ({
                                    ...prev,
                                    title: e.target.value
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={promotionData.role}
                                onChange={(e) => setPromotionData(prev => ({
                                    ...prev,
                                    role: e.target.value
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="core-member">Core Team Member</option>
                                <option value="joint-secretary">Joint Secretary</option>
                                <option value="secretary">Secretary</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Department</label>
                            <select
                                value={promotionData.department}
                                onChange={(e) => setPromotionData(prev => ({
                                    ...prev,
                                    department: e.target.value
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                                <option value="general">General</option>
                                <option value="leadership">Leadership</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                            <textarea
                                value={promotionData.responsibilities.join(', ')}
                                onChange={(e) => setPromotionData(prev => ({
                                    ...prev,
                                    responsibilities: e.target.value.split(',').map(item => item.trim())
                                }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Reason for Promotion</label>
                            <textarea
                                value={promotionData.reason}
                                onChange={(e) => setPromotionData(prev => ({ ...prev, reason: e.target.value }))}
                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                            >
                                Update Position
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Legacy Member Form Component
const LegacyMemberForm = ({ onSubmit, onCancel, formData, setFormData, positionRoles, departments, addLegacyPosition, removeLegacyPosition }) => {
    return (
        <div className="fixed inset-0 bg-[rgba(75,85,99,0.5)] overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Add Previous/Legacy Member</h3>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                                <input
                                    type="url"
                                    value={formData.profile?.profileImage || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        profile: { ...prev.profile, profileImage: e.target.value }
                                    }))}
                                    placeholder="https://example.com/profile-image.jpg"
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                                {formData.profile?.profileImage && (
                                    <div className="mt-2">
                                        <img 
                                            src={formData.profile.profileImage} 
                                            alt="Profile preview" 
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Department</label>
                                <input
                                    type="dept"
                                    required
                                    value={formData.dept}
                                    onChange={(e) => setFormData(prev => ({ ...prev, dept: e.target.value }))}
                                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Previous Positions */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-md font-medium text-gray-900">Previous Positions</h4>
                                <button
                                    type="button"
                                    onClick={addLegacyPosition}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                >
                                    Add Position
                                </button>
                            </div>

                            {formData.previousPositions.map((position, index) => (
                                <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <h5 className="font-medium text-gray-700">Position {index + 1}</h5>
                                        {formData.previousPositions.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeLegacyPosition(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Position Title</label>
                                            <input
                                                type="text"
                                                value={position.title}
                                                onChange={(e) => {
                                                    const newPositions = [...formData.previousPositions];
                                                    newPositions[index].title = e.target.value;
                                                    setFormData(prev => ({ ...prev, previousPositions: newPositions }));
                                                }}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Role</label>
                                            <select
                                                value={position.role}
                                                onChange={(e) => {
                                                    const newPositions = [...formData.previousPositions];
                                                    newPositions[index].role = e.target.value;
                                                    setFormData(prev => ({ ...prev, previousPositions: newPositions }));
                                                }}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            >
                                                {positionRoles.map(role => (
                                                    <option key={role.value} value={role.value}>{role.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <select
                                                value={position.department}
                                                onChange={(e) => {
                                                    const newPositions = [...formData.previousPositions];
                                                    newPositions[index].department = e.target.value;
                                                    setFormData(prev => ({ ...prev, previousPositions: newPositions }));
                                                }}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            >
                                                {departments.map(dept => (
                                                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Period (e.g., 2020-2021)</label>
                                            <input
                                                type="text"
                                                value={position.period}
                                                placeholder="2020-2021"
                                                onChange={(e) => {
                                                    const newPositions = [...formData.previousPositions];
                                                    newPositions[index].period = e.target.value;
                                                    setFormData(prev => ({ ...prev, previousPositions: newPositions }));
                                                }}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                            <input
                                                type="date"
                                                value={position.startDate}
                                                onChange={(e) => {
                                                    const newPositions = [...formData.previousPositions];
                                                    newPositions[index].startDate = e.target.value;
                                                    setFormData(prev => ({ ...prev, previousPositions: newPositions }));
                                                }}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                                            <input
                                                type="date"
                                                value={position.endDate}
                                                onChange={(e) => {
                                                    const newPositions = [...formData.previousPositions];
                                                    newPositions[index].endDate = e.target.value;
                                                    setFormData(prev => ({ ...prev, previousPositions: newPositions }));
                                                }}
                                                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                            >
                                Add Legacy Member
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminMembers;
