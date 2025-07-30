import { useState } from 'react';
import { useAdminContext } from '../context/adminContext';
import { MagnifyingGlassIcon, UserGroupIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const AdminRegistrations = () => {
    const { registrations, updateRegistrationStatus, loading, events } = useAdminContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterEvent, setFilterEvent] = useState('all');
    const [selectedRegistration, setSelectedRegistration] = useState(null);

    // Filter registrations based on search, status, and event
    const filteredRegistrations = registrations.filter(registration => {
        const name = registration.userId?.name || registration.name || '';
        const email = registration.userId?.email || registration.email || '';
        const studentId = registration.userId?.studentId || registration.studentId || '';
        const major = registration.userId?.major || registration.department || '';
        
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            major.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || registration.status === filterStatus || 
                         (filterStatus === 'waitlist' && (registration.status === 'waitlist' || registration.status === 'waitlisted'));
        const matchesEvent = filterEvent === 'all' || 
                         registration.eventId?._id === filterEvent || 
                         registration.eventId === filterEvent;
        
        return matchesSearch && matchesStatus && matchesEvent;
    });

    const handleStatusChange = async (registrationId, newStatus) => {
        try {
            await updateRegistrationStatus(registrationId, newStatus);
        } catch (error) {
            console.error('Error updating registration status:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'waitlist':
            case 'waitlisted':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <ClockIcon className="h-4 w-4 text-yellow-500" />;
            case 'cancelled':
                return <XCircleIcon className="h-4 w-4 text-red-500" />;
            case 'waitlist':
            case 'waitlisted':
                return <ClockIcon className="h-4 w-4 text-blue-500" />;
            default:
                return <ClockIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    

    const getRegistrationStats = () => {
        const stats = {
            total: registrations.length,
            confirmed: registrations.filter(r => r.status === 'confirmed').length,
            pending: registrations.filter(r => r.status === 'pending').length,
            cancelled: registrations.filter(r => r.status === 'cancelled').length,
            waitlist: registrations.filter(r => r.status === 'waitlist' || r.status === 'waitlisted').length
        };
        return stats;
    };

    const stats = getRegistrationStats();

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Registration Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        View and manage event registrations
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UserGroupIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Confirmed</dt>
                                    <dd className="text-lg font-medium text-green-600">{stats.confirmed}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-yellow-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                    <dd className="text-lg font-medium text-yellow-600">{stats.pending}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Waitlist</dt>
                                    <dd className="text-lg font-medium text-blue-600">{stats.waitlist}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <XCircleIcon className="h-6 w-6 text-red-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Cancelled</dt>
                                    <dd className="text-lg font-medium text-red-600">{stats.cancelled}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search registrations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="waitlist">Waitlist</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Event Filter */}
                    <div>
                        <select
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="all">All Events</option>
                            {events.map(event => (
                                <option key={event._id} value={event._id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stats */}
                    <div className="text-sm text-gray-600">
                        Showing {filteredRegistrations.length} of {registrations.length} registrations
                    </div>
                </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : filteredRegistrations.length === 0 ? (
                    <div className="text-center py-12">
                        <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No registrations found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterStatus !== 'all' || filterEvent !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'No registrations have been submitted yet.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Participant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Event
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Team Members
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registration Date
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
                                {filteredRegistrations.map((registration) => (
                                    <tr key={registration._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {registration.userId?.name || registration.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {registration.userId?.studentId || registration.studentId}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {registration.eventId?.title || 'Event Not Found'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{registration.userId?.email || registration.email}</div>
                                            <div className="text-sm text-gray-500">{registration.userId?.phone || registration.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {registration.registrationData.teamMembers && registration.registrationData.teamMembers.length > 0 ? (
                                                registration.registrationData.teamMembers.map((teammate, index) => (
                                                <div key={index} className="text-sm text-gray-900">
                                                    {teammate.name}
                                                </div>
                                                ))
                                            ) : (
                                                'Individual'
                                            )}
                                            </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(registration?.createdAt || registration.registrationDate || '2024-01-01').toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {getStatusIcon(registration.status)}
                                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                                                    {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedRegistration(registration)}
                                                    className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                                                >
                                                    View
                                                </button>
                                                <select
                                                    value={registration.status}
                                                    onChange={(e) => handleStatusChange(registration._id, e.target.value)}
                                                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="waitlist">Waitlist</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Registration Detail Modal */}
            {selectedRegistration && (
                <RegistrationDetailModal
                    registration={selectedRegistration}
                    event={events.find(e => e._id === (selectedRegistration.eventId?._id || selectedRegistration.eventId))}
                    onClose={() => setSelectedRegistration(null)}
                    onStatusUpdate={handleStatusChange}
                />
            )}
        </div>
    );
};

// Registration Detail Modal Component
const RegistrationDetailModal = ({ registration, event, onClose, onStatusUpdate }) => {
    return (
        <div className="fixed inset-0 bg-[rgba(75,85,99,0.5)] overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Registration Details
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Event Information */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Event Information</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm font-medium text-gray-900">{registration.eventId?.title || 'Unknown Event'}</p>
                                <p className="text-sm text-gray-500">
                                    {registration.eventId?.date ? (
                                        <>
                                            {new Date(registration.eventId.date).toLocaleString('en-IN', {year: 'numeric', month: 'long', day: 'numeric',})} at {new Date(registration.eventId.date).toLocaleString('en-IN', {hour: '2-digit', minute: '2-digit', hour12: false,})}
                                        </>
                                    ) : 'Date not available'}
                                </p>
                                <p className="text-sm text-gray-500">{registration.eventId?.location}</p>
                            </div>
                        </div>

                        {/* Participant Information */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Participant Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Full Name</label>
                                    <p className="text-sm text-gray-900">{registration.userId?.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Student ID</label>
                                    <p className="text-sm text-gray-900">{registration.userId?.studentId}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Email</label>
                                    <p className="text-sm text-gray-900">{registration.userId?.email }</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Phone</label>
                                    <p className="text-sm text-gray-900">{registration.participantDetails?.phone}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Department/Major</label>
                                    <p className="text-sm text-gray-900">{registration.participantDetails?.department }</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Year</label>
                                    <p className="text-sm text-gray-900">{registration.participantDetails?.year}</p>
                                </div>
                            </div>
                        </div>

                        {/* registration data  */}

                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Team Members</h4>
                            <div className="space-y-1">
                                {registration.registrationData.teamMembers && registration.registrationData.teamMembers.length > 0 ? (
                                registration.registrationData.teamMembers.map((teammate, index) => (
                                    <div key={index} className="text-sm text-gray-700">
                                    {teammate.name}
                                    </div>
                                ))
                                ) : (
                                <div className="text-sm text-gray-500">Individual (no team members)</div>
                                )}
                            </div>
                            <br></br>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Expectations:</h4>
                            <div className="space-y-1">
                                {registration.registrationData.expectations && (
                                    <div  className="text-sm text-gray-700">
                                    {registration.registrationData.expectations}
                                    </div>
                                )}
                            </div>

                        </div>



                        {/* Registration Status */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Registration Status</h4>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">Current Status:</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                    registration.status === 'waitlist' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
                                </span>
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Update Status
                                </label>
                                <select
                                    value={registration.status}
                                    onChange={(e) => onStatusUpdate(registration._id, e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="waitlist">Waitlist</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        {/* Registration Date */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Registration Details</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600">
                                    Registered on {new Date(registration.timestamps?.registeredAt || registration.registrationDate || '2024-01-01').toLocaleDateString()} at{' '}
                                    {new Date(registration.timestamps?.registeredAt || registration.registrationDate || '2024-01-01').toLocaleTimeString()}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    Registration ID: #{registration._id}
                                </p>
                                {registration.paymentStatus && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        Payment Status: <span className={`font-medium ${registration.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {registration.paymentStatus.charAt(0).toUpperCase() + registration.paymentStatus.slice(1)}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRegistrations;
