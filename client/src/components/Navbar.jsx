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
    { name: 'Opportunities', path: '/freelancing-opportunities' },
    { name: 'Artworks', path: '/artworks' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-md border-b-[0.5px] border-emerald-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center  h-16">

          
          {/* Logo */}
<Link to="/" className="flex items-center space-x-3">
  {settings.logo ? (
    <img 
      src={settings.logo} 
      alt={settings.siteInfo.name || 'Animation Club'} 
      className="w-9 h-9 rounded-md object-cover shadow-glow"
    />
  ) : (
    <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-md flex items-center justify-center shadow-glow">
      <span className="text-black font-bold text-sm">AC</span>
    </div>
  )}
  <span className="text-emerald-400 font-extrabold  text-[1.3rem]  leading-none glow-neon tracking-wide flex items-center">
    {settings.siteInfo.name || 'Animation Club'}
  </span>
</Link>


          {/* Desktop Links */}
          <div className="hidden lg:flex space-x-1 items-center ml-auto whitespace-nowrap">
  {navLinks.map((link) => (
    <Link
      key={link.name}
      to={link.path}
      className={`text-xs font-semibold tracking-wide px-3 py-2 rounded-md transition-all duration-300 whitespace-nowrap ${
        isActive(link.path)
          ? 'text-emerald-300 border-b-2 border-emerald-400'
          : 'text-white hover:text-emerald-300'
      }`}
    >
      {link.name}
    </Link>
  ))}
  <div className="ml-10"></div>
  <UserNav />
</div>


          {/* Mobile Menu Button */}
          <div className="lg:hidden ml-auto flex items-center h-full">
  <button
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    className="text-emerald-300 focus:outline-none hover:text-white"
    aria-label="Toggle menu"
  >
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Mobile Nav */}
      {isMenuOpen && (
  <div className="lg:hidden bg-[#0b0f11] border-t border-emerald-600 px-3 py-2 space-y-1">
    {navLinks.map((link) => (
      <Link
        key={link.name}
        to={link.path}
        onClick={() => setIsMenuOpen(false)}
        className={`block text-sm font-medium rounded px-2 py-1 transition ${
          isActive(link.path)
            ? 'text-emerald-300 bg-emerald-900/30'
            : 'text-white hover:text-emerald-300'
        }`}
      >
        {link.name}
      </Link>
    ))}
    <div className="pt-1 border-t border-emerald-500">
      <UserNav />
    </div>
  </div>
)}

    </nav>
  );
};

export default Navbar;

