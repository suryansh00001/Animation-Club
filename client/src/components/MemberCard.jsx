import React from 'react';

const MemberCard = ({ member, onViewProfile }) => {
  return (
    <div className="w-[300px] h-[300px] bg-emerald-900/10 border border-emerald-600 rounded-lg p-6 text-center shadow-[0_0_20px_#00ffcc33] hover:shadow-[0_0_30px_#00ffcce6] hover:bg-emerald-900/20 transition-colors flex flex-col justify-between">

      {/* Top: Profile Image */}
      <div>
        <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center overflow-hidden shadow-md">
          {member.profile?.profileImage ? (
            <img
              src={member.profile.profileImage}
              alt={member.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/fallback.jpg';
              }}
            />
          ) : (
            <div className="text-black text-xl font-bold">👤</div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-emerald-300 mb-1">{member.name}</h3>

        {/* Position */}
        <p className="text-white font-medium text-sm capitalize mb-2">{member.position || member.role}</p>

        {/* Email */}
        {member.email && (
          <p className="text-xs font-medium transition-colors text-gray-400 mb-1"> {member.email}</p>
        )}

        {/* Phone */}
        {member.profile?.mobile && (
          <p className="text-xs font-medium transition-colors text-gray-400">{member.profile.mobile}</p>
        )}
      </div>
        {/* Join Date */}
        {member.joinDate && (
      <div className="text-xs font-medium transition-colors text-gray-400">
        Joined on {new Date(member.joinDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
)}


      

      {/* View Profile Button */}
      <button
        onClick={() => onViewProfile(member)}
        className="text-xs text-emerald-100 hover:text-emerald-300 font-medium transition-colors"
      >
        View Profile →
      </button>
    </div>
  );
};

export default MemberCard;
