import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAdminContext } from '../context/adminContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { adminUser, adminLogout ,eventManagerUser} = useAdminContext();
  const userMenuRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const isActive = (path) => location.pathname === path;

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Events', path: '/admin/events', icon: '📅' },
    { name: 'Members', path: '/admin/members', icon: '👥' },
    { name: 'Achievements', path: '/admin/achievements', icon: '🏆' },
    { name: 'Gallery', path: '/admin/gallery', icon: '🖼️' },
    { name: 'Artworks', path: '/admin/artworks', icon: '🎨' },
    { name: 'Submissions', path: '/admin/submissions', icon: '📝' },
    { name: 'Registrations', path: '/admin/registrations', icon: '📋' },
    { name: 'Contacts', path: '/admin/contacts', icon: '💬' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' }
  ];
  

  useEffect(()=>{
    if(adminUser){
      setUserData(adminUser);
    }
    else if(eventManagerUser){
      setUserData(eventManagerUser);
    }
  },[adminUser,eventManagerUser])
  const handleLogout = () => {
    adminLogout();
    setShowUserMenu(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div
            className="fixed inset-0 bg-[rgba(75,85,99,0.75)]"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent navigation={navigation} isActive={isActive} />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarContent navigation={navigation} isActive={isActive} />
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Animation Club Admin
              </h1>
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  View Website
                </Link>
                
                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                      {userData ? 
                        <img
                          src={userData.avatar}
                          alt={userData.name.charAt(0)}
                          className="w-8 h-8 rounded-full object-cover"
                        /> 
                        : 
                        <span className="text-white text-sm font-medium">
                          {(userData && userData.name ? userData.name.charAt(0) : 'A')}
                        </span>
                      }
                    </div>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <p className="font-medium">{(userData && userData.name) ? userData.name : 'Admin User'}{` | ${userData.role == 'admin'?'admin':'Manager'}`}</p>
                        <p className="text-xs text-gray-500">{(userData && userData.email) ? userData.email : 'admin@animation-club.com'}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarContent = ({ navigation, isActive }) => (
  <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">AC</span>
          </div>
          <span className="font-bold text-xl text-gray-800">Admin Panel</span>
        </div>
      </div>
      <nav className="mt-8 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive(item.path)
                ? 'bg-purple-100 text-purple-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  </div>
);

export default AdminLayout;
