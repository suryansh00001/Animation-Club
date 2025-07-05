import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';

const Artworks = () => {
  const { fetchArtworks } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const artworksData = await fetchArtworks(filters);
      setArtworks(artworksData || []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Artworks', count: artworks.length },
    { id: '2d', name: '2D Animation', count: artworks.filter(art => art.category === '2d').length },
    { id: '3d', name: '3D Animation', count: artworks.filter(art => art.category === '3d').length },
    { id: 'illustration', name: 'Illustration', count: artworks.filter(art => art.category === 'illustration').length },
    { id: 'motion', name: 'Motion Graphics', count: artworks.filter(art => art.category === 'motion').length },
    { id: 'student', name: 'Student', count: artworks.filter(art => art.category === 'student').length },
  ];

  const filteredArtworks = selectedCategory === 'all' 
    ? artworks 
    : artworks.filter(artwork => artwork.category === selectedCategory);

  const getCategoryColor = (category) => {
    switch (category) {
      case '2d': return 'bg-blue-100 text-blue-800';
      case '3d': return 'bg-purple-100 text-purple-800';
      case 'illustration': return 'bg-pink-100 text-pink-800';
      case 'motion': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Date not available';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Student Artworks
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Explore the creative works of our talented animation club members. 
              From 2D animations to 3D models, discover the amazing art our community creates.
            </p>
            <div className="flex justify-center">
              <a
                href="/artworks/submit"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Submit Your Artwork
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 shadow-md hover:shadow-lg'
                }`}
              >
                {category.name}
                <span className="ml-2 text-sm opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredArtworks.length} artwork{filteredArtworks.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* Artworks Grid */}
        {filteredArtworks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No artworks found</h3>
            <p className="text-gray-600">
              There are no artworks in this category yet. Check back later for new submissions!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtworks.map((artwork) => (
              <div
                key={artwork._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedArtwork(artwork)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={artwork.artworkUrl}
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='150' y='150' font-family='Arial' font-size='14' fill='%236b7280' text-anchor='middle' dy='0.3em'%3EArtwork Unavailable%3C/text%3E%3C/svg%3E`;
                    }}
                  />
                  <div className="absolute inset-0 bg-[rgba(0,0,0,0)] group-hover:bg-[rgba(255,255,255,0.2)] transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(artwork.category)}`}>
                      {artwork.source === 'instagram' ? 'INSTAGRAM' : artwork.category?.toUpperCase() || 'ART'}
                    </span>
                  </div>

                  {/* Instagram Badge */}
                  {artwork.source === 'instagram' && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1 rounded-full">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{artwork.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {artwork.artist}</p>
                  <p className="text-xs text-gray-500">{formatDate(artwork.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Artwork Modal */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 bg-[rgba(0,0,0,0.75)] backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="flex-1 bg-gray-100 flex items-center justify-center min-h-[300px] md:min-h-[500px]">
              <img
                src={selectedArtwork.artworkUrl}
                alt={selectedArtwork.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' font-family='Arial' font-size='16' fill='%236b7280' text-anchor='middle' dy='0.3em'%3EArtwork Unavailable%3C/text%3E%3C/svg%3E`;
                }}
              />
            </div>

            {/* Info Section */}
            <div className="w-full md:w-80 p-6 overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedArtwork.title}</h2>
                <button
                  onClick={() => setSelectedArtwork(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Artist</h3>
                  <p className="text-gray-900">{selectedArtwork.artist}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selectedArtwork.category)}`}>
                      {selectedArtwork.category?.toUpperCase() || 'ART'}
                    </span>
                    {selectedArtwork.source === 'instagram' && (
                      <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        INSTAGRAM FEATURE
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Created</h3>
                  <p className="text-gray-900">{formatDate(selectedArtwork.createdAt)}</p>
                </div>

                {selectedArtwork.source === 'instagram' && (
                  <>
                    {selectedArtwork.instagramUrl && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-1">Instagram Post</h3>
                        <a
                          href={selectedArtwork.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          View on Instagram
                        </a>
                      </div>
                    )}
                  </>
                )}

                {selectedArtwork.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
                    <p className="text-gray-900 text-sm leading-relaxed">{selectedArtwork.description}</p>
                  </div>
                )}

                {selectedArtwork.tools && selectedArtwork.tools.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Tools Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedArtwork.tools.map((tool, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedArtwork.duration && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Duration</h3>
                    <p className="text-gray-900">{selectedArtwork.duration}</p>
                  </div>
                )}

                {selectedArtwork.resolution && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Resolution</h3>
                    <p className="text-gray-900">{selectedArtwork.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artworks;
