import React, { useState } from 'react';
import { useAppContext } from '../context/appContext';

const ArtworkSubmission = () => {
  const { user, submitArtwork } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '2d-animation',
    media: {
      mainImage: {
        url: ''
      }
    },
    tags: [],
    technical: {
      software: [],
      techniques: []
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const artworkData = {
        ...formData,
        tags: typeof formData.tags === 'string' 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : formData.tags,
        technical: {
          software: typeof formData.technical.software === 'string'
            ? formData.technical.software.split(',').map(s => ({ name: s.trim() })).filter(s => s.name)
            : formData.technical.software,
          techniques: typeof formData.technical.techniques === 'string'
            ? formData.technical.techniques.split(',').map(t => t.trim()).filter(t => t)
            : formData.technical.techniques
        }
      };

      const response = await submitArtwork(artworkData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: '2d-animation',
        media: {
          mainImage: {
            url: ''
          }
        },
        tags: [],
        technical: {
          software: [],
          techniques: []
        }
      });
    } catch (error) {
      console.error('Error submitting artwork:', error);
      setError('Failed to submit artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Artwork Submission Disabled</h3>
            <p className="text-gray-600">
              Artwork submission functionality is currently disabled.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="text-gray-400 text-8xl mb-6">🎨</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Artwork Submission Currently Disabled</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Artwork submission functionality is temporarily disabled. Please check back later or contact administrators for more information.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-xl mx-auto">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-800 font-medium">
                For questions about artwork submission, please contact the administration team.
              </p>
            </div>
          </div>
          <div className="mt-8">
            <a 
              href="/artworks" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Artworks Gallery
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkSubmission;
