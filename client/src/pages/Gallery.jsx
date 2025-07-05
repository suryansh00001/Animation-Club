import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';

const Gallery = () => {
  const { fetchGallery } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const imagesData = await fetchGallery();
      setGalleryImages(imagesData || []);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setError('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (image, index = 0) => {
    if (image.images && image.images.length > 0) {
      return image.images[index] || image.images[0];
    }
    return '/api/placeholder/400/300';
  };

  const openModal = (gallery) => {
    setSelectedImage(gallery);
    setSelectedImageIndex(0);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedImage && selectedImage.images && selectedImage.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev < selectedImage.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedImage && selectedImage.images && selectedImage.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedImage.images.length - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Gallery</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Club Gallery
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of memorable moments, celebrations, and creative achievements from club events and activities.
          </p>
        </div>

        {/* Gallery Info */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            Showing {galleryImages.length} gallery albums
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {galleryImages.map((gallery) => (
            <div
              key={gallery._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => openModal(gallery)}
            >
              <div className="relative w-full h-48 overflow-hidden group bg-gray-200">
                <img
                  src={getImageSrc(gallery, 0)}
                  alt={gallery.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    console.error('❌ Image failed to load:', e.target.src);
                    e.target.src = '/api/placeholder/400/300';
                  }}
                />
                {/* Multiple images indicator */}
                {gallery.images && gallery.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-[rgba(0,0,0,0.)] text-white text-xs px-2 py-1 rounded-full">
                    {gallery.images.length} photos
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.1)] group-hover:bg-[rgba(0,0,0,0.3)] transition-all duration-300 flex items-center justify-center">
                  <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                    <svg 
                      className="w-8 h-8 mx-auto mb-2"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    <span className="text-sm font-medium">View Album</span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                  {gallery.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {gallery.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Gallery Album
                  </span>
                  <span className="text-xs text-purple-600 font-medium">
                    {gallery.images ? gallery.images.length : 0} images
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Images Message */}
        {galleryImages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No gallery albums found
            </h3>
            <p className="text-gray-500">
              No gallery albums are currently available.
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {galleryImages.reduce((total, gallery) => total + (gallery.images ? gallery.images.length : 0), 0)}
              </div>
              <div className="text-gray-600">Total Images</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {galleryImages.length}
              </div>
              <div className="text-gray-600">Gallery Albums</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {galleryImages.filter(g => g.status === 'approved').length}
              </div>
              <div className="text-gray-600">Approved Albums</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)] backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="relative bg-white rounded-xl max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-20 text-gray-600 hover:text-gray-800 bg-[rgba(255,255,255,0.9)] rounded-full p-2 shadow-lg transition-all hover:bg-[rgba(255,255,255,1)]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Navigation Arrows */}
            {selectedImage.images && selectedImage.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 bg-[rgba(0,0,0,0.5)] rounded-full p-2 shadow-lg transition-all hover:bg-[rgba(0,0,0,0.7)]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white hover:text-gray-300 bg-[rgba(0,0,0,0.5)] rounded-full p-2 shadow-lg transition-all hover:bg-[rgba(0,0,0,0.7)]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Image Container */}
            <div className="relative bg-gray-100">
              <img
                src={getImageSrc(selectedImage, selectedImageIndex)}
                alt={selectedImage.title}
                className="w-full max-h-[70vh] object-contain"
                onError={(e) => {
                  console.log('Modal image failed to load, using fallback:', e.target.src);
                  e.target.src = '/api/placeholder/400/300';
                }}
              />
              {/* Image Counter */}
              {selectedImage.images && selectedImage.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[rgba(0,0,0,0.7)] text-white text-sm px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {selectedImage.images.length}
                </div>
              )}
            </div>
            
            {/* Image Details */}
            <div className="p-6 bg-white">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {selectedImage.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {selectedImage.description}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <span className={`inline-block text-sm px-3 py-1 rounded-full font-semibold ${
                  selectedImage.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedImage.status}
                </span>
                {selectedImage.images && selectedImage.images.length > 1 && (
                  <span className="text-sm text-gray-500">
                    {selectedImage.images.length} images in this album
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Gallery;
