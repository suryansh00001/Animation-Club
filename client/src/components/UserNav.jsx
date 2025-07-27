import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const UserNav = () => {
  const { user, isAuthenticated, logout } = useAppContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/login"
          className="text-gray-600 hover:text-purple-600 transition-colors"
        >
          Login
        </Link>
        <Link
          to="/login?mode=signup"
          className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 text-gray-700 hover:text-purple-600 transition-colors"
      >
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="hidden md:block text-sm font-medium">{user.name}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
            
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsDropdownOpen(false)}
            >
              My Profile
            </Link>
            
            <Link
              to="/events"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setIsDropdownOpen(false)}
            >
              Browse Events
            </Link>
            
            <div className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserNav;
