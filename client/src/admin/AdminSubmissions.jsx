import { useState } from 'react';
import { useAdminContext } from '../context/adminContext';
import { MagnifyingGlassIcon, DocumentIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';

const AdminSubmissions = () => {
    const { submissions, updateSubmissionStatus, updateSubmissionAward, deleteSubmission, loading, events } = useAdminContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterEvent, setFilterEvent] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    // Filter submissions based on search, status, and event
    const filteredSubmissions = submissions.filter(submission => {
        const participantName = submission.userId?.name || '';
        const email = submission.userId?.email || '';
        const title = submission.submissionDetails?.title || '';
        const description = submission.submissionDetails?.description || '';
        
        const matchesSearch = participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
        const matchesEvent = filterEvent === 'all' || submission.eventId === filterEvent;
        
        return matchesSearch && matchesStatus && matchesEvent;
    });

    const handleStatusChange = async (submissionId, newStatus) => {
        try {
            await updateSubmissionStatus(submissionId, newStatus);
        } catch (error) {
            console.error('Error updating submission status:', error);
        }
    };

    const handleDelete = async (submissionId) => {
        if (window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
            try {
                await deleteSubmission(submissionId);
            } catch (error) {
                console.error('Error deleting submission:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'submitted':
                return 'bg-blue-100 text-blue-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'under-review':
                return 'bg-yellow-100 text-yellow-800';
            case 'winner':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            case 'submitted':
                return <ClockIcon className="h-4 w-4 text-blue-500" />;
            case 'rejected':
                return <XCircleIcon className="h-4 w-4 text-red-500" />;
            case 'under-review':
                return <ClockIcon className="h-4 w-4 text-yellow-500" />;
            case 'winner':
                return <CheckCircleIcon className="h-4 w-4 text-purple-500" />;
            default:
                return <ClockIcon className="h-4 w-4 text-gray-500" />;
        }
    };

    

    const getSubmissionStats = () => {
        const stats = {
            total: submissions.length,
            approved: submissions.filter(s => s.status === 'approved').length,
            submitted: submissions.filter(s => s.status === 'submitted').length,
            rejected: submissions.filter(s => s.status === 'rejected').length,
            underReview: submissions.filter(s => s.status === 'under-review').length,
            winner: submissions.filter(s => s.status === 'winner').length
        };
        return stats;
    };

    const stats = getSubmissionStats();

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Submission Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Review and manage event submissions
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <DocumentIcon className="h-6 w-6 text-gray-400" />
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Approved</dt>
                                    <dd className="text-lg font-medium text-green-600">{stats.approved}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Submitted</dt>
                                    <dd className="text-lg font-medium text-blue-600">{stats.submitted}</dd>
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Under Review</dt>
                                    <dd className="text-lg font-medium text-blue-600">{stats.underReview}</dd>
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
                                    <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
                                    <dd className="text-lg font-medium text-red-600">{stats.rejected}</dd>
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
                            placeholder="Search submissions..."
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
                            <option value="submitted">Submitted</option>
                            <option value="under-review">Under Review</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="winner">Winner</option>
                        </select>
                    </div>

                    {/* Event Filter */}
                    <div>
                        <select
                            value={filterEvent}
                            onChange={(e) => setFilterEvent(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option key="all-events" value="all">All Events</option>
                            {events.map(event => (
                                <option key={event._id} value={event._id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Stats */}
                    <div className="text-sm text-gray-600">
                        Showing {filteredSubmissions.length} of {submissions.length} submissions
                    </div>
                </div>
            </div>

            {/* Submissions Grid */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterStatus !== 'all' || filterEvent !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'No submissions have been received yet.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {filteredSubmissions.map((submission) => (
                            <div key={submission._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                {/* Submission Media */}
                                {(submission.files?.mainFileUrl) && (
                                    <div className="aspect-w-16 aspect-h-9">
                                        {submission.files.mainFileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img
                                                src={submission.files.mainFileUrl}
                                                alt={submission.submissionDetails?.title}
                                                className="w-full h-32 object-cover"
                                            />
                                        ) : submission.files.mainFileUrl.match(/\.(mp4|avi|mov|wmv|webm)$/i) ? (
                                            <div className="relative w-full h-32">
                                                <video
                                                    src={submission.files.mainFileUrl}
                                                    className="w-full h-32 object-cover"
                                                    muted
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
                                                    <div className="w-8 h-8 border-l-2 border-white"></div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                                <DocumentIcon className="h-8 w-8 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {submission.submissionDetails?.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                by {submission.userId?.name}
                                            </p>
                                        </div>
                                        <div className="ml-2 flex items-center">
                                            {getStatusIcon(submission.status)}
                                        </div>
                                    </div>
                                    
                                    <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                                        {submission.submissionDetails?.description}
                                    </p>
                                    
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-500">
                                            {submission.submissionDetails.title}
                                        </span>
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                                            {submission.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </div>
                                    
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-xs text-gray-400">
                                            {new Date(submission.submissionTime || Date.now()).toLocaleDateString()}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => setSelectedSubmission(submission)}
                                                className="text-purple-600 hover:text-purple-900 text-xs font-medium flex items-center"
                                            >
                                                <EyeIcon className="h-3 w-3 mr-1" />
                                                View
                                            </button>
                                            {submission.files?.mainFileUrl && (
                                                <a
                                                    href={submission.files.mainFileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                                                >
                                                    Link
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <select
                                            value={submission.status}
                                            onChange={(e) => handleStatusChange(submission._id, e.target.value)}
                                            className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                        >
                                            <option value="submitted">Submitted</option>
                                            <option value="under-review">Under Review</option>
                                            <option value="approved">Approved</option>
                                            <option value="rejected">Rejected</option>
                                            <option value="winner">Winner</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submission Detail Modal */}
            {selectedSubmission && (
                <SubmissionDetailModal
                    submission={selectedSubmission}
                    event={events.find(e => {
                        const submissionEventId = typeof selectedSubmission.eventId === 'object' 
                            ? selectedSubmission.eventId?._id 
                            : selectedSubmission.eventId;
                        return e._id === submissionEventId;
                    })}
                    onClose={() => setSelectedSubmission(null)}
                    onStatusUpdate={handleStatusChange}
                    onDelete={handleDelete}
                    onAwardUpdate={updateSubmissionAward}
                />
            )}
        </div>
    );
};

// Submission Detail Modal Component
const SubmissionDetailModal = ({ submission, event, onClose, onStatusUpdate, onDelete, onAwardUpdate }) => {
    const [awardData, setAwardData] = useState({
        position: submission?.award?.position || 'none',
        prize: submission?.award?.prize || '',
        certificate: submission?.award?.certificate || ''
    });

    const handleAwardUpdate = async () => {
        try {
            await onAwardUpdate(submission._id, awardData);
            onClose(); // Close modal after successful update
        } catch (error) {
            console.error('Error updating award:', error);
        }
    };

    const getAwardColor = (position) => {
        switch (position) {
            case 'first':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'second':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'third':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'honorable-mention':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'special-recognition':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            default:
                return 'bg-gray-50 text-gray-500 border-gray-200';
        }
    };

    const getAwardIcon = (position) => {
        switch (position) {
            case 'first':
                return '🥇';
            case 'second':
                return '🥈';
            case 'third':
                return '🥉';
            case 'honorable-mention':
                return '🏅';
            case 'special-recognition':
                return '⭐';
            default:
                return '🏆';
        }
    };
    return (
        <div className="fixed inset-0 bg-[rgba(75,85,99,0.5)] overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                            Submission Details
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
                                <p className="text-sm font-medium text-gray-900">{event?.title || 'Unknown Event'}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                    {event?.date && (
                                        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                                    )}
                                    {event?.time && (
                                        <p>Time: {event.time}</p>
                                    )}
                                    {event?.venue && (
                                        <p>Venue: {event.venue}</p>
                                    )}
                                    {event?.location && (
                                        <p>Location: {event.location}</p>
                                    )}
                                    {!event && (
                                        <p>Event details not available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submission Content */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Submission Content</h4>
                            <div className="space-y-4">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-900">{submission.submissionDetails?.title}</h5>
                                    <p className="text-sm text-gray-600 mt-1">{submission.submissionDetails?.description}</p>
                                </div>
                                
                                {/* Media Display */}
                                {submission.files?.mainFileUrl && (
                                    <div className="border rounded-lg overflow-hidden">
                                        {submission.files.mainFileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img
                                                src={submission.files.mainFileUrl}
                                                alt={submission.submissionDetails?.title}
                                                className="w-full h-64 object-cover"
                                            />
                                        ) : submission.files.mainFileUrl.match(/\.(mp4|avi|mov|wmv|webm)$/i) ? (
                                            <video
                                                src={submission.files.mainFileUrl}
                                                className="w-full h-64 object-cover"
                                                controls
                                            />
                                        ) : (
                                            <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                                                <DocumentIcon className="h-12 w-12 text-gray-400" />
                                                <div className="ml-3">
                                                    <p className="text-sm font-medium text-gray-900">File Attachment</p>
                                                    <p className="text-sm text-gray-500">Document/File</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Participant Information */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Participant Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Name</label>
                                    <p className="text-sm text-gray-900">{submission.participantInfo?.name || submission.userId?.name}</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500">Email</label>
                                    <p className="text-sm text-gray-900">{submission.participantInfo?.email || submission.userId?.email}</p>
                                </div>
                                {(submission.participantInfo?.studentId || submission.userId?.studentId) && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500">Student ID</label>
                                        <p className="text-sm text-gray-900">{submission.participantInfo?.studentId || submission.userId?.studentId}</p>
                                    </div>
                                )}
                                {(submission.participantInfo?.department || submission.userId?.department) && (
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500">Department</label>
                                        <p className="text-sm text-gray-900">{submission.participantInfo?.department || submission.userId?.department}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submission Status */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Review Status</h4>
                            <div className="flex items-center space-x-4 mb-3">
                                <span className="text-sm text-gray-500">Current Status:</span>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    submission.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                                    submission.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    submission.status === 'under-review' ? 'bg-yellow-100 text-yellow-800' :
                                    submission.status === 'winner' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {submission.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Update Status
                                </label>
                                <select
                                    value={submission.status}
                                    onChange={(e) => onStatusUpdate(submission._id, e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                >
                                    <option value="submitted">Submitted</option>
                                    <option value="under-review">Under Review</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="winner">Winner</option>
                                </select>
                            </div>
                        </div>

                        {/* Award Management */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Award Management</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                {/* Current Award Status */}
                                <div className="flex items-center space-x-3">
                                    <span className="text-sm text-gray-500">Current Award:</span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getAwardColor(submission.award?.position || 'none')}`}>
                                        <span className="mr-1">{getAwardIcon(submission.award?.position || 'none')}</span>
                                        {submission.award?.position === 'none' || !submission.award?.position 
                                            ? 'No Award' 
                                            : submission.award.position.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                                        }
                                    </span>
                                </div>
                                
                                {/* Award Controls */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Award Position
                                        </label>
                                        <select
                                            value={awardData.position}
                                            onChange={(e) => setAwardData(prev => ({ ...prev, position: e.target.value }))}
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                        >
                                            <option value="none">No Award</option>
                                            <option value="first">🥇 First Place</option>
                                            <option value="second">🥈 Second Place</option>
                                            <option value="third">🥉 Third Place</option>
                                            <option value="honorable-mention">🏅 Honorable Mention</option>
                                            <option value="special-recognition">⭐ Special Recognition</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Prize Description
                                        </label>
                                        <input
                                            type="text"
                                            value={awardData.prize}
                                            onChange={(e) => setAwardData(prev => ({ ...prev, prize: e.target.value }))}
                                            placeholder="e.g., $500, Trophy, etc."
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Certificate URL
                                        </label>
                                        <input
                                            type="url"
                                            value={awardData.certificate}
                                            onChange={(e) => setAwardData(prev => ({ ...prev, certificate: e.target.value }))}
                                            placeholder="https://certificate-url.com"
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAwardUpdate}
                                        className="px-3 py-1 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                    >
                                        Update Award
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submission Details */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Submission Details</h4>
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <p className="text-sm text-gray-600">
                                    Submitted on {new Date(submission.submissionTime || Date.now()).toLocaleDateString()} at{' '}
                                    {new Date(submission.submissionTime || Date.now()).toLocaleTimeString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Submission ID: #{submission._id}
                                </p>
                                {submission.files?.mainFileUrl && (
                                    <p className="text-sm text-gray-600">
                                        <a
                                            href={submission.files.mainFileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-600 hover:text-purple-800 underline"
                                        >
                                            View Original File
                                        </a>
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

export default AdminSubmissions;
