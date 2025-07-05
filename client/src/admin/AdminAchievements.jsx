import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';

const AdminAchievements = () => {
  const { 
    fetchAchievements, 
    adminCreateAchievement, 
    adminUpdateAchievement, 
    adminDeleteAchievement 
  } = useAppContext();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'award',
    date: '',
    image: '',
    award: '',
    project: {
      title: '',
      description: ''
    },
    status: 'active'
  });

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const achievementsData = await fetchAchievements();
      setAchievements(achievementsData || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = editingAchievement 
        ? await adminUpdateAchievement(editingAchievement._id, formData)
        : await adminCreateAchievement(formData);
      
      await loadAchievements();
      setShowCreateForm(false);
      setEditingAchievement(null);
      resetForm();
    } catch (error) {
      console.error('Error saving achievement:', error);
      setError('Failed to save achievement');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await adminDeleteAchievement(id);
        await loadAchievements();
      } catch (error) {
        console.error('Error deleting achievement:', error);
        setError('Failed to delete achievement');
      }
    }
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title || '',
      description: achievement.description || '',
      category: achievement.category || 'award',
      date: achievement.date ? new Date(achievement.date).toISOString().split('T')[0] : '',
      image: achievement.image || '',
      award: achievement.award || '',
      project: {
        title: achievement.project?.title || '',
        description: achievement.project?.description || ''
      },
      status: achievement.status || 'active'
    });
    setShowCreateForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'award',
      date: '',
      image: '',
      award: '',
      project: {
        title: '',
        description: ''
      },
      status: 'active'
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievement Management</h1>
          <p className="text-gray-600">Manage club achievements and recognitions</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm(true);
            setEditingAchievement(null);
            resetForm();
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Add Achievement
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Achievement Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="award">Award</option>
                  <option value="recognition">Recognition</option>
                  <option value="competition">Competition</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Award/Recognition
              </label>
              <input
                type="text"
                name="award"
                value={formData.award}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  name="project.title"
                  value={formData.project.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Description
                </label>
                <input
                  type="text"
                  name="project.description"
                  value={formData.project.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingAchievement(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {editingAchievement ? 'Update' : 'Create'} Achievement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Achievements List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Achievements ({achievements.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Achievement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {achievements.map((achievement) => (
                <tr key={achievement._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={achievement.image} 
                        alt={achievement.title}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {achievement.award}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {achievement.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(achievement.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        achievement.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {achievement.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(achievement._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {achievements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements found</h3>
              <p className="text-gray-600">
                Start by adding your first achievement to showcase club accomplishments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAchievements;
