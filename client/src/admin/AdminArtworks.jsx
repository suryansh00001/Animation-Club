import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { useAdminContext } from '../context/adminContext';

const AdminArtworks = () => {
  const { adminGetArtworks, adminDeleteArtwork } = useAppContext();
  const { adminCreateArtwork, adminUpdateArtwork } = useAdminContext();
  const [artworks, setArtworks] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load artworks from API on component mount
  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const artworksData = await adminGetArtworks();
      setArtworks(artworksData);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const [newArtwork, setNewArtwork] = useState({
    title: '',
    artist: '',
    category: '2d',
    source: 'student',
    description: '',
    artworkUrl: '',
    tools: [],
    duration: '',
    resolution: '',
    instagramUrl: ''
  });

  const categories = ['2d', '3d', 'illustration', 'motion', 'student'];
  const sources = ['student', 'instagram', 'exhibition'];

  const filteredArtworks = artworks.filter(artwork => {
    if (filter === 'all') return true;
    if (filter === 'instagram') return artwork.source === 'instagram';
    return artwork.category === filter;
  });

  const handleAddArtwork = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare artwork data for API
      const artworkData = {
        title: newArtwork.title,
        artist: newArtwork.artist,
        category: newArtwork.category,
        source: newArtwork.source,
        description: newArtwork.description,
        artworkUrl: newArtwork.artworkUrl,
        tools: typeof newArtwork.tools === 'string' 
          ? newArtwork.tools.split(',').map(tool => tool.trim()).filter(tool => tool !== '')
          : newArtwork.tools.filter(tool => tool.trim() !== ''),
        duration: newArtwork.duration,
        resolution: newArtwork.resolution,
        instagramUrl: newArtwork.instagramUrl
      };
      
      const createdArtwork = await adminCreateArtwork(artworkData);
      
      // Add to local state
      setArtworks(prev => [createdArtwork, ...prev]);
      
      // Reset form
      setNewArtwork({
        title: '',
        artist: '',
        category: '2d',
        source: 'student',
        description: '',
        artworkUrl: '',
        tools: [],
        duration: '',
        resolution: '',
        instagramUrl: ''
      });
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add artwork. Please try again.');
      console.error('Add artwork error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateArtwork = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare artwork data for API
      const artworkData = {
        title: editingArtwork.title,
        artist: editingArtwork.artist,
        category: editingArtwork.category,
        source: editingArtwork.source,
        description: editingArtwork.description,
        artworkUrl: editingArtwork.artworkUrl,
        tools: typeof editingArtwork.tools === 'string'
          ? editingArtwork.tools.split(',').map(tool => tool.trim()).filter(tool => tool !== '')
          : editingArtwork.tools,
        duration: editingArtwork.duration,
        resolution: editingArtwork.resolution,
        instagramUrl: editingArtwork.instagramUrl
      };
      
      const updatedArtwork = await adminUpdateArtwork(editingArtwork._id, artworkData);
      
      // Update local state
      setArtworks(prev => prev.map(artwork => 
        artwork._id === editingArtwork._id ? updatedArtwork : artwork
      ));
      
      setEditingArtwork(null);
      setError(null);
    } catch (err) {
      setError('Failed to update artwork. Please try again.');
      console.error('Update artwork error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArtwork = async (artworkId) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      setLoading(true);
      try {
        await adminDeleteArtwork(artworkId);
        setArtworks(prev => prev.filter(artwork => artwork._id !== artworkId));
        setError(null);
      } catch (err) {
        setError('Failed to delete artwork. Please try again.');
        console.error('Delete artwork error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToolsChange = (value, isEditing = false) => {
    const toolsArray = value.split(',').map(tool => tool.trim());
    if (isEditing) {
      setEditingArtwork(prev => ({ ...prev, tools: toolsArray }));
    } else {
      setNewArtwork(prev => ({ ...prev, tools: toolsArray }));
    }
  };

  // Function to normalize artwork data for editing
  const normalizeArtworkForEdit = (artwork) => {
    return {
      ...artwork,
      artist: artwork.artist || '',
      tools: artwork.tools || [],
      duration: artwork.duration || '',
      resolution: artwork.resolution || '',
      instagramUrl: artwork.instagramUrl || ''
    };
  };

  const duplicateArtwork = async (artwork) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const duplicatedArtwork = {
        ...artwork,
        _id: `artwork_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: `${artwork.title} (Copy)`,
        createdDate: new Date().toISOString()
      };
      
      setArtworks(prev => [duplicatedArtwork, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to duplicate artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artwork Management</h1>
          <p className="text-gray-600">Manage student artworks and Instagram features ({artworks.length} total)</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Add New Artwork'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {!loading && !error && artworks.length > 0 && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="text-green-800 text-sm">
            Artwork data loaded successfully. All changes are saved locally.
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="all">All Artworks</option>
            <option value="2d">2D Animation</option>
            <option value="3d">3D Animation</option>
            <option value="illustration">Illustration</option>
            <option value="motion">Motion Graphics</option>
            <option value="student">Student Work</option>
          </select>
        </div>
      </div>

      {/* Artworks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artwork
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredArtworks.map((artwork) => (
              <tr key={artwork._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={artwork.artworkUrl}
                      alt={artwork.title}
                      className="w-12 h-12 rounded object-cover mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{artwork.title}</div>
                      <div className="text-sm text-gray-500">{artwork.description?.substring(0, 50)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{artwork.artist}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                    {artwork.category?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    artwork.source === 'instagram' ? 'bg-pink-100 text-pink-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {artwork.source?.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(artwork.createdAt || artwork.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingArtwork(normalizeArtworkForEdit(artwork))}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArtwork(artwork._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editingArtwork) && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingArtwork ? 'Edit Artwork' : 'Add New Artwork'}
              </h2>
              <form onSubmit={editingArtwork ? handleUpdateArtwork : handleAddArtwork}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingArtwork ? editingArtwork.title : newArtwork.title}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, title: e.target.value}))
                        : setNewArtwork(prev => ({...prev, title: e.target.value}))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                    <input
                      type="text"
                      value={editingArtwork ? editingArtwork.artist : newArtwork.artist}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, artist: e.target.value}))
                        : setNewArtwork(prev => ({...prev, artist: e.target.value}))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={editingArtwork ? editingArtwork.category : newArtwork.category}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, category: e.target.value}))
                        : setNewArtwork(prev => ({...prev, category: e.target.value}))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                    <select
                      value={editingArtwork ? editingArtwork.source : newArtwork.source}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, source: e.target.value}))
                        : setNewArtwork(prev => ({...prev, source: e.target.value}))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {sources.map(source => (
                        <option key={source} value={source}>{source.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingArtwork ? editingArtwork.description : newArtwork.description}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, description: e.target.value}))
                        : setNewArtwork(prev => ({...prev, description: e.target.value}))
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Artwork URL</label>
                    <input
                      type="url"
                      value={editingArtwork ? editingArtwork.artworkUrl : newArtwork.artworkUrl}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, artworkUrl: e.target.value}))
                        : setNewArtwork(prev => ({...prev, artworkUrl: e.target.value}))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tools Used (comma separated)</label>
                    <input
                      type="text"
                      value={editingArtwork ? editingArtwork.tools?.join(', ') : newArtwork.tools.join(', ')}
                      onChange={(e) => handleToolsChange(e.target.value, !!editingArtwork)}
                      placeholder="Blender, Photoshop, After Effects"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={editingArtwork ? editingArtwork.duration : newArtwork.duration}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, duration: e.target.value}))
                        : setNewArtwork(prev => ({...prev, duration: e.target.value}))
                      }
                      placeholder="e.g., 30 seconds, 2 minutes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                    <input
                      type="text"
                      value={editingArtwork ? editingArtwork.resolution : newArtwork.resolution}
                      onChange={(e) => editingArtwork 
                        ? setEditingArtwork(prev => ({...prev, resolution: e.target.value}))
                        : setNewArtwork(prev => ({...prev, resolution: e.target.value}))
                      }
                      placeholder="e.g., 1920x1080, 4K"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {(editingArtwork?.source === 'instagram' || newArtwork.source === 'instagram') && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
                        <input
                          type="url"
                          value={editingArtwork ? editingArtwork.instagramUrl : newArtwork.instagramUrl}
                          onChange={(e) => editingArtwork 
                            ? setEditingArtwork(prev => ({...prev, instagramUrl: e.target.value}))
                            : setNewArtwork(prev => ({...prev, instagramUrl: e.target.value}))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingArtwork(null);
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                  >
                    {editingArtwork ? 'Update' : 'Add'} Artwork
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArtworks;
