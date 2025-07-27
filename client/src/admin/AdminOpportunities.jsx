
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminContext } from '../context/adminContext';

const OpportunityForm = ({ opportunity, onClose, onSave }) => {
  const [form, setForm] = useState(opportunity || {
    title: '',
    description: '',
    status: 'open',
    compensation: '',
    tag : 'intermediate'
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
      <form className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">{opportunity ? 'Edit Opportunity' : 'Create Opportunity'}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Compensation</label>
          <input name="compensation" value={form.compensation} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tag</label>
          <select name="tag" value={form.tag} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded">Save</button>
        </div>
      </form>
    </div>
  );
};

const AdminOpportunities = () => {
  const {
    opportunities,
    fetchAdminOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    updateOpportunityStatus,
    loading,
  } = useAdminContext();


  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const minutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) {
      return `Updated on ${date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}`;
    }

    if (minutes < 60) return 'Updated moments ago';
    if (hours < 24) return `Updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `Updated ${days} day${days > 1 ? 's' : ''} ago`;
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchAdminOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter(o =>
    o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      await deleteOpportunity(id);
      fetchAdminOpportunities();
    }
  };

  const handleEdit = (opp) => {
    setEditingOpportunity(opp);
  };

  const handleStatusUpdate = async (id, status) => {
    await updateOpportunityStatus(id, status);
  };

  const handleSave = async (form) => {
    if (editingOpportunity) {
      await updateOpportunity(editingOpportunity._id, form);
    } else {
      await createOpportunity(form);
    }
    setShowCreateForm(false);
    setEditingOpportunity(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Opportunities Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage all club opportunities, internships, contests, and more.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
          >
            Add New Opportunity
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Opportunities
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Search by title or description..."
        />
      </div>

      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Stamps</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOpportunities.map((opp) => (
                <tr key={opp._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{opp.title}</div>
                    <div className="text-sm text-gray-500 max-w-xs truncate">{opp.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">Created: {new Date(opp.createdAt).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}</div>
                    <div className="text-sm text-gray-500">Updated: {formatRelativeTime(opp.updatedAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={opp.status}
                      onChange={e => handleStatusUpdate(opp._id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(opp)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(opp._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOpportunities.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No opportunities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search.' : 'Get started by creating your first opportunity.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Opportunity
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-purple-600">{opportunities.length}</div>
          <div className="text-sm text-gray-500">Total Opportunities</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-blue-600">{opportunities.filter(o => o.status === 'open').length}</div>
          <div className="text-sm text-gray-500">Open</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-2xl font-bold text-gray-600">{opportunities.filter(o => o.status === 'closed').length}</div>
          <div className="text-sm text-gray-500">Closed</div>
        </div>
      </div>

      {(showCreateForm || editingOpportunity) && (
        <OpportunityForm
          opportunity={editingOpportunity}
          onClose={() => {
            setShowCreateForm(false);
            setEditingOpportunity(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default AdminOpportunities;
