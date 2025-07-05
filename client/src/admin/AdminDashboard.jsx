import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminContext } from '../context/adminContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { 
    events, 
    members, 
    registrations, 
    submissions, 
    fetchAdminEvents, 
    fetchMembers, 
    fetchRegistrations, 
    fetchSubmissions,
    loading,
    isAdminAuthenticated
  } = useAdminContext();
  
  const [statsLoading, setStatsLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  // Track if we've already attempted to load data
  const [dataLoadAttempted, setDataLoadAttempted] = useState(false);

  useEffect(() => {
    // Only attempt to load data once and only if authenticated
    if (dataLoadAttempted || !isAdminAuthenticated) return;
    setDataLoadAttempted(true);

    const loadDashboardData = async () => {
      try {
        setStatsLoading(true);
        setDashboardError(null);
        
        // Silence console errors temporarily to avoid flooding the console
        const originalConsoleError = console.error;
        console.error = (...args) => {
          if (!(args[0]?.includes?.('API error') || args[0]?.includes?.('Failed to load'))) {
            originalConsoleError(...args);
          }
        };
        
        // Load all admin data sequentially to avoid overwhelming the server
        await fetchAdminEvents().catch(() => {});
        await fetchMembers().catch(() => {});
        await fetchRegistrations().catch(() => {});
        await fetchSubmissions().catch(() => {});
        
        // Restore console error
        console.error = originalConsoleError;
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setDashboardError('Failed to load dashboard data. Please check your connection and try again.');
      } finally {
        setStatsLoading(false);
      }
    };

    loadDashboardData();
  }, [isAdminAuthenticated, dataLoadAttempted]);

  // Calculate statistics from API data
  const totalEvents = events?.length || 0;
  const upcomingEvents = events?.filter(e => e?.status === 'upcoming')?.length || 0;
  const ongoingEvents = events?.filter(e => e?.status === 'ongoing')?.length || 0;
  const totalMembers = members?.length || 0;
  const totalRegistrations = registrations?.length || 0;
  const totalSubmissions = submissions?.length || 0;
  
  // Recent events from API data - safely handle potential null/undefined
  const recentEvents = events && events.length > 0
    ? [...events]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 3)
    : [];
  
  // Recent registrations from API data - safely handle potential null/undefined
  const recentRegistrations = registrations && registrations.length > 0
    ? [...registrations]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 3)
    : [];

  // Prepare data for graphs
  const prepareRegistrationGraphData = () => {
    if (!events || !registrations) return [];
    
    // Get last 10 events with registration required
    const eventsWithRegistration = events
      .filter(event => event.registrationRequired !== false) // Include events that require registration
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 10);
    
    return eventsWithRegistration.map(event => {
      const eventRegistrations = registrations.filter(reg => 
        reg.eventId?._id === event._id || reg.eventId === event._id
      );
      
      return {
        name: event.title?.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
        registrations: eventRegistrations.length
      };
    }).reverse(); // Reverse to show chronological order
  };

  const prepareRegistrationSubmissionGraphData = () => {
    if (!events || !registrations || !submissions) return [];
    
    // Get last 10 events that require both registration and submission
    const eventsWithBoth = events
      .filter(event => 
        event.registrationRequired !== false && 
        event.submissionRequired === true
      )
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 10);
    
    return eventsWithBoth.map(event => {
      const eventRegistrations = registrations.filter(reg => 
        reg.eventId?._id === event._id || reg.eventId === event._id
      );
      
      const eventSubmissions = submissions.filter(sub => 
        sub.eventId?._id === event._id || sub.eventId === event._id
      );
      
      return {
        name: event.title?.length > 15 ? event.title.substring(0, 15) + '...' : event.title,
        registrations: eventRegistrations.length,
        submissions: eventSubmissions.length
      };
    }).reverse(); // Reverse to show chronological order
  };

  const prepareOverallTrendData = () => {
    if (!events || !registrations || !submissions) return [];
    
    // Get last 8 events for a cleaner trend view
    const recentEvents = events
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 8);
    
    return recentEvents.map(event => {
      const eventRegistrations = registrations.filter(reg => 
        reg.eventId?._id === event._id || reg.eventId === event._id
      );
      
      const eventSubmissions = submissions.filter(sub => 
        sub.eventId?._id === event._id || sub.eventId === event._id
      );
      
      return {
        name: event.title?.length > 12 ? event.title.substring(0, 12) + '...' : event.title,
        events: 1, // Each point represents one event
        registrations: eventRegistrations.length,
        submissions: eventSubmissions.length
      };
    }).reverse(); // Reverse to show chronological order
  };

  const registrationData = prepareRegistrationGraphData();
  const registrationSubmissionData = prepareRegistrationSubmissionGraphData();
  const overallTrendData = prepareOverallTrendData();

  // Skeleton loading component
  const SkeletonStat = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
      </div>
      <div className="mt-2 h-3 bg-gray-200 rounded w-24"></div>
    </div>
  );

  const stats = [
    {
      name: 'Total Events',
      value: totalEvents,
      change: `${upcomingEvents} upcoming`,
      changeType: 'increase',
      icon: '📅',
      color: 'bg-blue-500'
    },
    {
      name: 'Active Members',
      value: totalMembers,
      change: `${totalMembers} total members`,
      changeType: 'increase',
      icon: '👥',
      color: 'bg-green-500'
    },
    {
      name: 'Total Registrations',
      value: totalRegistrations,
      change: `${totalRegistrations} total`,
      changeType: 'increase',
      icon: '📝',
      color: 'bg-purple-500'
    },
    {
      name: 'Submissions',
      value: totalSubmissions,
      change: `${totalSubmissions} total`,
      changeType: 'increase',
      icon: '🎨',
      color: 'bg-orange-500'
    }
  ];

  // Function to render skeletons while loading
  const renderSkeletons = (count) => {
    return [...Array(count)].map((_, i) => (
      <SkeletonStat key={i} />
    ));
  };

  if (statsLoading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600">Manage your Animation Club website content and monitor activity.</p>
        </div>
        
        {/* Skeleton Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderSkeletons(4)}
        </div>
        
        {/* Skeleton Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skeleton Graph 1 */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-32 mt-2"></div>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Skeleton Graph 2 */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-40 mt-2"></div>
            </div>
            <div className="p-6">
              <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Graph 3 */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-56 mt-2"></div>
            </div>
            <div className="p-6">
              <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Skeleton Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-36"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse flex">
                    <div className="h-12 w-12 bg-gray-200 rounded mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Admin Dashboard</h2>
        <p className="text-gray-600">Manage your Animation Club website content and monitor activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                <span className="text-white text-2xl">{stat.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {dashboardError && (
          <div className="col-span-1 lg:col-span-2 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{dashboardError}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Event Registrations Chart */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Event Registrations Trend</h3>
            <p className="text-sm text-gray-500 mt-1">Registration trends for last 10 events</p>
          </div>
          <div className="p-6" style={{ backgroundColor: '#fafafa' }}>
            {registrationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrationData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    tick={{ fill: '#666666' }}
                    domain={['dataMin - 1', 'dataMax + 2']}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Registrations']}
                    labelFormatter={(label) => `Event: ${label}`}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#7c3aed" 
                    strokeWidth={5}
                    dot={{ fill: '#7c3aed', strokeWidth: 0, r: 8 }}
                    activeDot={{ r: 12, stroke: '#7c3aed', strokeWidth: 3, fill: '#ffffff' }}
                    name="Registrations"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>No registration data available</p>
                <p className="text-sm">Events with registration requirements will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Registrations vs Submissions Chart */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Registrations vs Submissions Trend</h3>
            <p className="text-sm text-gray-500 mt-1">Comparative trends for events with both registration and submission</p>
          </div>
          <div className="p-6" style={{ backgroundColor: '#fafafa' }}>
            {registrationSubmissionData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={registrationSubmissionData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    tick={{ fill: '#666666' }}
                    domain={['dataMin - 1', 'dataMax + 2']}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '25px',
                      fontSize: '14px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#dc2626" 
                    strokeWidth={5}
                    dot={{ fill: '#dc2626', strokeWidth: 0, r: 8 }}
                    activeDot={{ r: 12, stroke: '#dc2626', strokeWidth: 3, fill: '#ffffff' }}
                    name="Registrations"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#f59e0b" 
                    strokeWidth={5}
                    dot={{ fill: '#f59e0b', strokeWidth: 0, r: 8 }}
                    activeDot={{ r: 12, stroke: '#f59e0b', strokeWidth: 3, fill: '#ffffff' }}
                    name="Submissions"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📈</div>
                <p>No comparison data available</p>
                <p className="text-sm">Events with both registration and submission will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overall Activity Trend Chart */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Overall Activity Trend</h3>
            <p className="text-sm text-gray-500 mt-1">Multi-metric trends across recent events</p>
          </div>
          <div className="p-6" style={{ backgroundColor: '#fafafa' }}>
            {overallTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={overallTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={true} vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666666' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    fontSize={11}
                    tick={{ fill: '#666666' }}
                    domain={['dataMin - 1', 'dataMax + 2']}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      fontSize: '14px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '25px',
                      fontSize: '14px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#dc2626" 
                    strokeWidth={5}
                    dot={{ fill: '#dc2626', strokeWidth: 0, r: 8 }}
                    activeDot={{ r: 12, stroke: '#dc2626', strokeWidth: 2, fill: '#ffffff' }}
                    name="Registrations"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#f59e0b" 
                    strokeWidth={5}
                    dot={{ fill: '#f59e0b', strokeWidth: 0, r: 8 }}
                    activeDot={{ r: 12, stroke: '#f59e0b', strokeWidth: 2, fill: '#ffffff' }}
                    name="Submissions"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📊</div>
                <p>No trend data available</p>
                <p className="text-sm">Event activity trends will appear here as data becomes available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
              <Link
                to="/admin/events"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div key={event._id} className="flex items-center space-x-4">
                    <img
                      src={event.image || 'https://placehold.co/48x48?text=Event'}
                      alt={event.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=Event'; }}
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500">
                        {event.date ? new Date(event.date).toLocaleDateString() : 'No date'} • {event.status || 'unknown'}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status || 'unknown'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {statsLoading ? 'Loading events...' : 'No recent events found'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Registrations</h3>
              <Link
                to="/admin/registrations"
                className="text-purple-600 hover:text-purple-800 text-sm font-medium"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((registration) => (
                  <div key={registration._id} className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {registration.participantDetails?.name || 
                         registration.user?.name || 
                         "Unknown Participant"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {registration.eventId?.title || "Unknown Event"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {registration?.createdAt ? new Date(registration.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          registration.status === 'waitlisted' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {registration.status || 'unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  {statsLoading ? 'Loading registrations...' : 'No recent registrations found'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
