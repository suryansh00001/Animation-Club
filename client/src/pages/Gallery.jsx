import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';
import Tilt from 'react-parallax-tilt';

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
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-8">
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
    <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
{/* Header */}
<div className="text-center mb-12">
  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-emerald-400 mb-4 tracking-wide">
    Club Gallery
  </h1>
  <p className="text-sm sm:text-lg text-[#d1d5db] max-w-2xl mx-auto">
    Explore our collection of memorable moments, celebrations, and creative achievements from club events and activities.
  </p>
</div>

{/* Gallery Info */}
<div className="mb-8 text-center">
  <p className="text-[#6ee7b7] text-xs sm:text-sm uppercase tracking-wider">
    Showing <span className="font-bold text-[#10b981]">{`${galleryImages.length} `}</span> gallery albums
  </p>
</div>


        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {galleryImages.map((gallery) => (
            <Tilt
  key={gallery._id}
  tiltMaxAngleX={7}
  tiltMaxAngleY={7}
  glareEnable={true}
  glareMaxOpacity={0}
  glareColor="#10b981"
  glarePosition="all"
  scale={1.03}
  transitionSpeed={1000}
  className="rounded-xl"
>
  <div
    className="bg-[#0a1a1a]/60 backdrop-blur-md border border-[#10b981]/30 rounded-xl shadow-[0_0_12px_#10b98140] overflow-hidden cursor-pointer hover:shadow-[0_0_30px_#10b98180] transition-all duration-300"
    onClick={() => openModal(gallery)}
  >
    <div className="relative w-full h-48 overflow-hidden group">
      <img
        src={getImageSrc(gallery, 0)}
        alt={gallery.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          e.target.src = '/api/placeholder/400/300';
        }}
      />
      {gallery.images?.length > 1 && (
        <div className="absolute top-2 right-2 bg-[#0a1a1a]/80 text-black text-xs px-2 py-1 rounded-full font-semibold shadow-md">
          {gallery.images.length} photos
        </div>
      )}
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-center justify-center">
        <div className="text-[#10b981] opacity-0 group-hover:opacity-100 transition-opacity text-center">
          <svg
            className="w-8 h-8 mx-auto mb-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
          <span className="text-sm font-medium tracking-wider">View Album</span>
        </div>
      </div>
    </div>

    <div className="p-4">
      <h3 className="text-lg font-bold text-[#f9fafb] mb-1 line-clamp-2 tracking-wide">
        {gallery.title}
      </h3>
      <p className="text-[#9ca3af] text-sm mb-3 line-clamp-2">
        {gallery.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6ee7b7] font-medium uppercase tracking-widest">
          Album
        </span>
        <span className="text-xs text-[#10b981] font-semibold">
          {gallery.images?.length || 0} images
        </span>
      </div>
    </div>
  </div>
</Tilt>
          ))}
        </div>

{/* No Images Message */}
{galleryImages.length === 0 && (
  <div className="text-center py-12">
    <div className="text-6xl mb-4 text-[#10b981]">📸</div>
    <h3 className="text-xl font-semibold text-[#d1fae5] mb-2">
      No gallery albums found
    </h3>
    <p className="text-[#6ee7b7]">
      No gallery albums are currently available.
    </p>
  </div>
)}


<div className="mt-16 bg-white/5 backdrop-blur-md border border-[#10b981]/20 rounded-2xl shadow-[0_0_20px_#10b98140] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
  <div className="flex flex-wrap justify-center gap-x-6 gap-y-6 text-center text-[#f9fafb]">

    {/* Stat 1 */}
    <div className="w-1/2 sm:w-auto space-y-1">
      <div className="text-2xl sm:text-3xl font-extrabold text-[#10b981] tracking-wider">
        {galleryImages.reduce((total, gallery) => total + (gallery.images ? gallery.images.length : 0), 0)}
      </div>
      <div className="text-xs sm:text-sm text-[#9ca3af] uppercase tracking-wide">
        Total Images
      </div>
    </div>

    {/* Stat 2 */}
    <div className="w-1/2 sm:w-auto space-y-1">
      <div className="text-2xl sm:text-3xl font-extrabold text-[#10b981] tracking-wider">
        {galleryImages.length}
      </div>
      <div className="text-xs sm:text-sm text-[#9ca3af] uppercase tracking-wide">
        Gallery Albums
      </div>
    </div>

    {/* Stat 3 (Centered on mobile) */}
    <div className="w-full sm:w-auto mt-4 sm:mt-0 space-y-1">
      <div className="text-2xl sm:text-3xl font-extrabold text-[#10b981] tracking-wider mx-auto">
        {galleryImages.filter(g => g.status === 'approved').length}
      </div>
      <div className="text-xs sm:text-sm text-[#9ca3af] uppercase tracking-wide mx-auto">
        Approved Albums
      </div>
    </div>

  </div>
</div>

      </div>

 {/* Modal */}
{selectedImage && (
  <div 
    className="fixed inset-0 bg-[#0a1a1a]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    onClick={closeModal}
  >
    <div 
      className="relative bg-[#0a1a1a] rounded-xl max-w-5xl max-h-[95vh] overflow-hidden shadow-[0_0_30px_#10b98155] transform transition-all duration-300 scale-100 border border-[#10b981]/30"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 z-20 text-[#10b981] hover:text-[#6ee7b7] bg-[#0f172a]/90 rounded-full p-2 shadow-lg transition-all hover:bg-[#0f172a]/95"
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-[#10b981] hover:text-[#6ee7b7] bg-[#0f172a]/60 rounded-full p-2 shadow-lg transition-all hover:bg-[#0f172a]/80"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-[#10b981] hover:text-[#6ee7b7] bg-[#0f172a]/60 rounded-full p-2 shadow-lg transition-all hover:bg-[#0f172a]/80"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="relative bg-[#0a1a1a]">
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
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#0a1a1a]/90 text-[#6ee7b7] text-sm px-3 py-1 rounded-full shadow">
            {selectedImageIndex + 1} / {selectedImage.images.length}
          </div>
        )}
      </div>

      {/* Image Details */}
      <div className="p-6 bg-[#0a1a1a] text-[#e0fdfb]">
        <h3 className="text-2xl font-bold text-[#10b981] mb-3">
          {selectedImage.title}
        </h3>
        <p className="text-[#c4f1e0] mb-4 leading-relaxed">
          {selectedImage.description}
        </p>
        <div className="flex items-center justify-between flex-wrap gap-4">
         
          {selectedImage.images && selectedImage.images.length > 1 && (
            <span className="text-sm text-[#6ee7b7]">
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
