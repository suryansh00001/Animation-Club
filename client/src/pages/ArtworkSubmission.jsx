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
      <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-24 overflow-hidden">
        <div className="max-w-3xl mx-auto border border-green-800 rounded-xl shadow-md shadow-green-500/20 p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4 text-green-400 animate-pulse">🎨</div>
            <h3 className="text-2xl font-bold text-green-300 mb-2 tracking-widest">
              Artwork Submission Disabled
            </h3>
            <p className="text-green-500 mb-8">
              Artwork submission functionality is currently disabled.
            </p>
            <div className="bg-[#072f2f] border border-green-600 rounded-lg p-6 mb-6">
              <div className="flex items-center text-green-400">
                <svg className="w-6 h-6 text-green-500 mr-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p>
                  For questions, contact the system administrator.
                </p>
              </div>
            </div>
            <a
              href="/artworks"
              className="inline-flex items-center px-6 py-3 rounded-md font-semibold text-black bg-green-400 hover:bg-green-300 transition shadow-lg shadow-green-500/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Artworks
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null; // actual form not shown because submission is disabled
};

export default ArtworkSubmission;

