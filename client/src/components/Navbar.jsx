import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import UserNav from './UserNav';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useAppContext();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Artworks', path: '/artworks' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt={settings.siteInfo.name || 'Animation Club'} 
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AC</span>
                </div>
              )}
              <span className="font-bold text-xl text-gray-800">
                {settings.siteInfo.name || 'Animation Club'}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <div className="flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <UserNav />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200">
              <UserNav />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
