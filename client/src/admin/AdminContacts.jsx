import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Mail, 
    Eye, 
    EyeOff, 
    Trash2, 
    Filter, 
    Search, 
    Calendar,
    User,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle
} from 'lucide-react';

const AdminContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
        isRead: 'all',
        search: ''
    });
    const [selectedContact, setSelectedContact] = useState(null);
    const [stats, setStats] = useState({
        unreadCount: 0,
        totalSubmissions: 0
    });

    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'resolved', label: 'Resolved' },
        { value: 'closed', label: 'Closed' }
    ];

    const categoryOptions = [
        { value: 'all', label: 'All Categories' },
        { value: 'general', label: 'General Inquiry' },
        { value: 'membership', label: 'Membership' },
        { value: 'events', label: 'Events' },
        { value: 'technical', label: 'Technical Support' },
        { value: 'complaint', label: 'Complaint' },
        { value: 'suggestion', label: 'Suggestion' }
    ];

    const priorityColors = {
        low: 'bg-green-100 text-green-800',
        medium: 'bg-yellow-100 text-yellow-800',
        high: 'bg-orange-100 text-orange-800',
        urgent: 'bg-red-100 text-red-800'
    };

    const statusColors = {
        pending: 'bg-gray-100 text-gray-800',
        'in-progress': 'bg-blue-100 text-blue-800',
        resolved: 'bg-green-100 text-green-800',
        closed: 'bg-purple-100 text-purple-800'
    };

    useEffect(() => {
        fetchContacts();
    }, [filters]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== 'all' && value !== '') {
                    queryParams.append(key, value);
                }
            });

            const response = await axios.get(`/api/v1/contact/submissions?${queryParams}`);
            
            if (response.data.success) {
                setContacts(response.data.contacts);
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (contactId, isRead) => {
        try {
            const response = await axios.patch(`/api/v1/contact/${contactId}/read`, { isRead });
            
            if (response.data.success) {
                setContacts(prev => prev.map(contact => 
                    contact._id === contactId ? { ...contact, isRead } : contact
                ));
                setStats(prev => ({
                    ...prev,
                    unreadCount: isRead ? prev.unreadCount - 1 : prev.unreadCount + 1
                }));
            }
        } catch (error) {
            console.error('Failed to update read status:', error);
        }
    };

    const updateStatus = async (contactId, status) => {
        try {
            const response = await axios.patch(`/api/v1/contact/${contactId}/status`, { status });
            
            if (response.data.success) {
                setContacts(prev => prev.map(contact => 
                    contact._id === contactId ? { ...contact, status } : contact
                ));
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const deleteContact = async (contactId) => {
        if (!window.confirm('Are you sure you want to delete this contact submission?')) {
            return;
        }

        try {
            const response = await axios.delete(`/api/v1/contact/${contactId}`);
            
            if (response.data.success) {
                setContacts(prev => prev.filter(contact => contact._id !== contactId));
                setSelectedContact(null);
            }
        } catch (error) {
            console.error('Failed to delete contact:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4" />;
            case 'in-progress':
                return <AlertCircle className="w-4 h-4" />;
            case 'resolved':
                return <CheckCircle className="w-4 h-4" />;
            case 'closed':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Submissions</h1>
                <p className="text-gray-600">Manage and respond to contact form submissions</p>
                
                {/* Stats */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <Mail className="w-8 h-8 text-blue-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalSubmissions}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <Eye className="w-8 h-8 text-red-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Unread</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.unreadCount}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-4">
                        <div className="flex items-center">
                            <CheckCircle className="w-8 h-8 text-green-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-500">Resolved</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {contacts.filter(c => c.status === 'resolved').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search contacts..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {categoryOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Read Status</label>
                        <select
                            value={filters.isRead}
                            onChange={(e) => setFilters(prev => ({ ...prev, isRead: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option value="all">All</option>
                            <option value="true">Read</option>
                            <option value="false">Unread</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Contact List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contacts List */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Contact Submissions ({contacts.length})
                        </h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        ) : contacts.length === 0 ? (
                            <div className="text-center py-8">
                                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
                                <p className="mt-1 text-sm text-gray-500">No contact submissions match your filters.</p>
                            </div>
                        ) : (
                            contacts.map((contact) => (
                                <div
                                    key={contact._id}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        !contact.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                    } ${selectedContact?._id === contact._id ? 'bg-purple-50' : ''}`}
                                    onClick={() => setSelectedContact(contact)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center space-x-2">
                                            <h3 className="font-medium text-gray-900">{contact.name}</h3>
                                            {!contact.isRead && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contact.status]}`}>
                                                {contact.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-2">{contact.email}</p>
                                    <p className="text-sm font-medium text-gray-900 mb-1">{contact.subject}</p>
                                    <p className="text-sm text-gray-600 truncate mb-2">{contact.message}</p>
                                    
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span className="capitalize">{contact.category}</span>
                                        <span>{formatDate(contact.createdAt)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Contact Details */}
                <div className="bg-white rounded-lg shadow">
                    {selectedContact ? (
                        <div className="h-full flex flex-col">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{selectedContact.subject}</h2>
                                    <p className="text-sm text-gray-600">{selectedContact.name} • {selectedContact.email}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => markAsRead(selectedContact._id, !selectedContact.isRead)}
                                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                        title={selectedContact.isRead ? 'Mark as unread' : 'Mark as read'}
                                    >
                                        {selectedContact.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => deleteContact(selectedContact._id)}
                                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                        title="Delete contact"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-4 overflow-y-auto">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-1">Category</h3>
                                            <p className="text-sm text-gray-900 capitalize">{selectedContact.category}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-1">Priority</h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[selectedContact.priority]}`}>
                                                {selectedContact.priority}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-1">Submitted</h3>
                                        <p className="text-sm text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                                        <select
                                            value={selectedContact.status}
                                            onChange={(e) => {
                                                updateStatus(selectedContact._id, e.target.value);
                                                setSelectedContact(prev => ({ ...prev, status: e.target.value }));
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            {statusOptions.slice(1).map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No contact selected</h3>
                                <p className="mt-1 text-sm text-gray-500">Select a contact to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminContacts;
