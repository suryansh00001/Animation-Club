import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const Footer = () => {
  const { settings } = useAppContext();

  return (
    <footer className="bg-[#0f0f0f] text-[#d1d5db] border-t border-[#10b981]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Club Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.siteInfo.name || 'Animation Club'}
                  className="w-10 h-10 object-cover rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">AC</span>
                </div>
              )}
              <span className="text-xl font-bold text-emerald-400 tracking-wide">
                {settings.siteInfo.name || 'Animation Club'}
              </span>
            </div>
            <p className="text-[#9ca3af] mb-4 max-w-md text-sm leading-relaxed">
              {settings.siteInfo.description ||
            'Too Cool to stay still'}
            </p>
            <p className="text-sm text-[#6b7280]">
              Established {settings.siteInfo.established || '2020'} | Empowering animators.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[#10b981] mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {['Home', 'Events', 'Gallery', 'Achievements', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-[#d1d5db] hover:text-[#10b981] transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-[#10b981] mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#f472b6]"
                >
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              )}
              {settings.socialLinks?.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#ef4444]"
                >
                  <i className="fab fa-youtube text-xl"></i>
                </a>
              )}
              {settings.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#60a5fa]"
                >
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              )}
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#3b82f6]"
                >
                  <i className="fab fa-facebook text-xl"></i>
                </a>
              )}
            </div>

            {/* Email */}
            <div className="mt-4 text-sm">
              <a
                href={`mailto:${settings.socialLinks?.email || settings.contactInfo?.email || 'animation.fmcweekend@gmail.com'}`}
                className="text-[#d1d5db] hover:text-[#10b981] transition"
              >
                {settings.socialLinks?.email || settings.contactInfo?.email || 'animation.fmcweekend@gmail.com'}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1f2937] mt-12 pt-6 text-center">
          <p className="text-sm text-[#6b7280]">
            © {new Date().getFullYear()} {settings.siteInfo.name || 'Animation Club'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
