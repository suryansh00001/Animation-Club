import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const Profile = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [member, setMember] = useState(null);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get('/api/v1/admin/members');
        if (response.data.success) {
          const members = response.data.members;
          setAllMembers(members);
          const foundMember = members.find(m => m._id === id);
          setMember(foundMember);
        }
      } catch (error) {
        console.error('Error fetching member:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id, axios]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-8">The profile you're looking for doesn't exist.</p>
          <Link
            to="/about"
            className="bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors"
          >
            Back to About Us
          </Link>
        </div>
      </div>
    );
  }

  const getPositionColor = (type) => {
    switch (type) {
      case 'secretary':
        return 'bg-purple-100 text-purple-800';
      case 'joint_secretary':
        return 'bg-blue-100 text-blue-800';
      case 'previous_secretary':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/about"
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to About Us
          </Link>
        </div>

        {/* {'profile card'} */}
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-white">
                <div className="flex flex-col md:flex-row items-center">
                <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg mb-6 md:mb-0 md:mr-8"
                />
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
                    <p className="text-xl text-purple-100 mb-4">{member.position}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    member.role === 'joint-secretary' ? 'bg-pink-500' : 
                    member.role === 'secretary' ? 'bg-purple-500' : 
                    'bg-gray-500'
                    }`}>
                    {member.position}
                    </span>
                </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
                {/* Description */}
                {member.description && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                    {member.description}
                    </p>
                </div>
                )}

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Contact Information */}
                {member.contactInfo && (
                    <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                        {member.contactInfo.phone && (
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="text-gray-800 font-medium">{member.contactInfo.phone}</p>
                            </div>
                        </div>
                        )}
                        
                        {member.contactInfo.email && (
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <a 
                                href={`mailto:${member.contactInfo.email}`}
                                className="text-purple-600 hover:text-purple-800 font-medium"
                            >
                                {member.contactInfo.email}
                            </a>
                            </div>
                        </div>
                        )}

                        {member.contactInfo.socialMedia && (
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                            </div>
                            <div>
                            <p className="text-sm text-gray-500">Social Media</p>
                            <div className="flex space-x-4">
                                {member.contactInfo.socialMedia.instagram && (
                                <a href={`https://instagram.com/${member.contactInfo.socialMedia.instagram.replace('@', '')}`} 
                                    className="text-purple-600 hover:text-purple-800 font-medium">
                                    Instagram
                                </a>
                                )}
                                {member.contactInfo.socialMedia.artstation && (
                                <a href={member.contactInfo.socialMedia.artstation.startsWith('http') ? member.contactInfo.socialMedia.artstation : `https://${member.contactInfo.socialMedia.artstation}`} 
                                    className="text-purple-600 hover:text-purple-800 font-medium">
                                    ArtStation
                                </a>
                                )}
                            </div>
                            </div>
                        </div>
                        )}
                    </div>
                    </div>
                )}

                {/* Professional Information */}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Details</h3>
                    <div className="space-y-3">
                    {member.specialization && member.specialization.length > 0 && (
                        <div className="flex items-start">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Specialization</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                            {member.specialization.map((item) => (
                                <span key={item} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {item}
                                </span>
                            ))}
                            </div>
                        </div>
                        </div>
                    )}
                    
                    {member.tenure && (
                        <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tenure</p>
                            <p className="text-gray-800 font-medium">
                            {member.tenure.period} (
                            {new Date(member.tenure.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - 
                            {new Date(member.tenure.endDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})})
                            </p>
                        </div>
                        </div>
                    )}
                    
                    {member.academic && (
                        <div className="flex items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Academic</p>
                            <p className="text-gray-800 font-medium">
                            {member.academic.year}, {member.academic.department}
                            {member.academic.gpa && ` (GPA: ${member.academic.gpa})`}
                            </p>
                        </div>
                        </div>
                    )}
                    </div>
                </div>
                </div>

                {/* Skills Section */}
                {member.skills && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills & Expertise</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {member.skills.software && member.skills.software.length > 0 && (
                        <div>
                        <h4 className="font-medium text-gray-700 mb-2">Software Proficiency</h4>
                        <div className="flex flex-wrap gap-2">
                            {member.skills.software.map((software) => (
                            <span key={software} className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                                {software}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                    {member.skills.techniques && member.skills.techniques.length > 0 && (
                        <div>
                        <h4 className="font-medium text-gray-700 mb-2">Techniques</h4>
                        <div className="flex flex-wrap gap-2">
                            {member.skills.techniques.map((tech) => (
                            <span key={tech} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                {tech}
                            </span>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                    {member.skills.proficiency && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {member.skills.proficiency.modeling && (
                        <div>
                            <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Modeling</span>
                            <span className="text-sm font-medium text-gray-700">{member.skills.proficiency.modeling}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{width: `${member.skills.proficiency.modeling}%`}}></div>
                            </div>
                        </div>
                        )}
                        {member.skills.proficiency.animation && (
                        <div>
                            <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Animation</span>
                            <span className="text-sm font-medium text-gray-700">{member.skills.proficiency.animation}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${member.skills.proficiency.animation}%`}}></div>
                            </div>
                        </div>
                        )}
                        {member.skills.proficiency.technical && (
                        <div>
                            <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Technical</span>
                            <span className="text-sm font-medium text-gray-700">{member.skills.proficiency.technical}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-pink-600 h-2.5 rounded-full" style={{width: `${member.skills.proficiency.technical}%`}}></div>
                            </div>
                        </div>
                        )}
                    </div>
                    )}
                </div>
                )}

                {/* Club History */}
                {member.clubHistory && member.clubHistory.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Club History</h3>
                    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                    {member.clubHistory.map((history, index) => (
                        <div key={index}>
                        <h4 className="font-medium text-gray-800">{history.position} ({history.period})</h4>
                        {history.achievements && history.achievements.length > 0 && (
                            <ul className="mt-2 space-y-1 pl-5 list-disc text-gray-600">
                            {history.achievements.map((achievement, i) => (
                                <li key={i}>{achievement}</li>
                            ))}
                            </ul>
                        )}
                        </div>
                    ))}
                    {member.timestamps?.joinedClub && (
                        <p className="text-sm text-gray-500">
                        Joined club on {new Date(member.timestamps.joinedClub).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}
                        </p>
                    )}
                    </div>
                </div>
                )}

                {/* Achievements */}
                {member.achievements && member.achievements.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {member.achievements.map((achievement, index) => (
                        <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-2 rounded-full mr-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            </div>
                            <span className="font-medium text-gray-800">{achievement}</span>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}

                {/* Contact Action */}
                {member.contactInfo?.email && (
                <div className="text-center bg-purple-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Need to get in touch?
                    </h3>
                    <p className="text-gray-600 mb-4">
                    Feel free to reach out for any club-related inquiries or collaboration opportunities.
                    </p>
                    <a
                    href={`mailto:${member.contactInfo.email}`}
                    className="inline-block bg-purple-500 text-white px-6 py-3 rounded-md hover:bg-purple-600 transition-colors font-medium"
                    >
                    Send Email
                    </a>
                </div>
                )}
            </div>
            </div>

        {/* Related Members */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Other Team Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {allMembers
              .filter(m => m._id !== member._id && m.status === 'active')
              .slice(0, 3)
              .map((relatedMember) => (
                <Link
                  key={relatedMember._id}
                  to={`/profile/${relatedMember._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={relatedMember.image}
                    alt={relatedMember.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1">{relatedMember.name}</h3>
                    <p className="text-purple-600 text-sm font-medium">{relatedMember.position}</p>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{relatedMember.specialization}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
