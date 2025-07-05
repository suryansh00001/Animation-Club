import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/appContext';

const SEOUpdater = () => {
  const { settings } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    // Generate page title based on current route
    const getPageTitle = () => {
      const siteName = settings.siteInfo?.name || 'Animation Club';
      const path = location.pathname;
      
      if (path === '/') return siteName;
      
      const pageName = path.substring(1).split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      
      return `${pageName} | ${siteName}`;
    };

    // Update page title
    document.title = getPageTitle();

    // Update favicon
    if (settings.favicon) {
      // Remove existing favicons
      const existingFavicons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]');
      existingFavicons.forEach(favicon => favicon.remove());

      // Add new favicon
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.type = 'image/x-icon';
      newFavicon.href = settings.favicon;
      document.head.appendChild(newFavicon);

      // Also add as shortcut icon for better browser support
      const shortcutFavicon = document.createElement('link');
      shortcutFavicon.rel = 'shortcut icon';
      shortcutFavicon.type = 'image/x-icon';
      shortcutFavicon.href = settings.favicon;
      document.head.appendChild(shortcutFavicon);
    }

    // Update meta description
    if (settings.siteInfo?.description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = settings.siteInfo.description;
    }

    // Update meta keywords if available
    if (settings.siteInfo?.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = settings.siteInfo.keywords;
    }
  }, [settings, location]);

  return null; // This component doesn't render anything
};

export default SEOUpdater;
