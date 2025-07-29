import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

// Axios interceptors for auth token and error handling
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userAuth');
      localStorage.removeItem('adminAuth');
      localStorage.removeItem('authToken');
      console.log('401 error - clearing authentication');
    }
    return Promise.reject(error);
  }
);

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [userSubmissions, setUserSubmissions] = useState([]);
    
    // Centralized site settings
    const [settings, setSettings] = useState({
        siteInfo: {},
        socialLinks: {},
        contactInfo: {},
        logo: null,
        favicon: null,
        announcements: [],
        loaded: false,
        loading: false
    });
    
    // Centralized profile data
    const [profileData, setProfileData] = useState({
        registrations: [],
        submissions: [],
        activity: [],
        stats: null,
        loaded: false,
        loading: false
    });
    
    const navigate = useNavigate();

    // Load data and check authentication on app start
    useEffect(() => {
        const loadData = async () => {
            try {
                // Load site settings
                try {
                    setSettings(prev => ({ ...prev, loading: true }));
                    const settingsResponse = await axios.get('/api/v1/settings');
                    if (settingsResponse.data.success) {
                        const settingsData = settingsResponse.data.settings;
                        setSettings({
                            siteInfo: {
                                name: settingsData.site?.name || 'Animation Club',
                                description: settingsData.site?.description || 'A creative community for animation enthusiasts',
                                established: settingsData.site?.established || '2020',
                                mission: settingsData.site?.mission || 'To provide learning opportunities, industry connections, and creative platforms for students interested in animation and visual storytelling.',
                                vision: settingsData.site?.vision || 'To foster creativity, innovation, and excellence in animation while building a supportive community of aspiring animators.'
                            },
                            socialLinks: {
                                instagram: settingsData.socialMedia?.instagram || '',
                                youtube: settingsData.socialMedia?.youtube || '',
                                twitter: settingsData.socialMedia?.twitter || '',
                                facebook: settingsData.socialMedia?.facebook || '',
                                linkedin: settingsData.socialMedia?.linkedin || '',
                                discord: settingsData.socialMedia?.discord || '',
                                email: settingsData.site?.contactEmail || 'animation.fmcweekend@gmail.com'
                            },
                            contactInfo: {
                                email: settingsData.site?.contactEmail || 'animation.fmcweekend@gmail.com',
                                phone: settingsData.site?.contactPhone || '',
                                address: settingsData.site?.address?.full || 
                                        (settingsData.site?.address && Object.keys(settingsData.site.address).length > 0 
                                            ? `${settingsData.site.address.street || ''}, ${settingsData.site.address.city || ''}, ${settingsData.site.address.state || ''} ${settingsData.site.address.zipCode || ''}`.replace(/(^,\s*|,\s*$)/g, '').replace(/,\s*,/g, ',').trim()
                                            : ''),
                                officeHours: settingsData.site?.officeHours || ''
                            },
                            logo: settingsData.site?.logo?.url || null,
                            favicon: settingsData.site?.favicon?.url || null,
                            announcements: settingsData.announcements || [],
                            loaded: true,
                            loading: false
                        });
                        console.log('Site settings loaded from API');
                    } else {
                        console.warn('Failed to load settings from API');
                        setSettings(prev => ({ ...prev, loading: false }));
                    }
                } catch (settingsError) {
                    console.warn('Settings API error:', settingsError);
                    setSettings(prev => ({ ...prev, loading: false }));
                }

                // Check for existing user session
                const userData = localStorage.getItem('userAuth');
                const authToken = localStorage.getItem('authToken');
                
                if (userData && authToken) {
                    // Verify token with backend (with retry for rate limiting)
                    const verifySession = async (retries = 3) => {
                        try {
                            const response = await axios.get('/api/v1/auth/me');
                            if (response.data.success) {
                                setUser(response.data.user);
                                setIsAuthenticated(true);
                            } else {
                                // Invalid session, clear local data
                                localStorage.removeItem('userAuth');
                                localStorage.removeItem('authToken');
                            }
                        } catch (error) {
                            console.error('Session verification failed:', error);
                            
                            // Check if it's a rate limiting error and we have retries left
                            if (error.response?.status === 429 && retries > 0) {
                                console.log(`Rate limited, retrying in 2 seconds... (${retries} retries left)`);
                                setTimeout(() => verifySession(retries - 1), 2000);
                                return;
                            }
                            
                            // Only clear session if it's actually invalid (not just rate limited)
                            if (error.response?.status === 401 || error.response?.status === 403) {
                                localStorage.removeItem('userAuth');
                                localStorage.removeItem('authToken');
                            } else {
                                // For other errors, keep the session but don't set user yet
                                console.log('Session verification temporarily failed');
                            }
                        }
                    };
                    
                    verifySession();
                }


                try {
                    const response = await axios.get('/api/v1/events');
                    if (response.data.success) {
                        setEvents(response.data.events);
                        console.log('Events loaded from API:', response.data.events.length);
                    } else {
                        console.warn('Failed to load events from API');
                    }
                } catch (eventsError) {
                    console.warn('Events API error:', eventsError);
                }

                
                
                
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };
        
        loadData();
    }, []);

    // User authentication functions
    const login = async (email, password) => {
        setLoading(true);
        try {
            // Make actual API call to backend
            const response = await axios.post('/api/v1/auth/login', {
                email,
                password
            });

            if (response.data.success) {
                const userData = response.data.user;
                
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('userAuth', JSON.stringify(userData));
                
                // Store token if provided in response (for API calls without cookies)
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                    // Set the Authorization header immediately for subsequent requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                }
                
                toast.success(response.data.message || 'Login successful!');
                return true;
            } else {
                toast.error(response.data.message || 'Login failed');
                return false;
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (registrationData) => {
        setLoading(true);
        try {
            // Make actual API call to backend
            const response = await axios.post('/api/v1/auth/register', registrationData);

            if (response.data.success) {
                const userData = response.data.user;
                
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('userAuth', JSON.stringify(userData));
                
                // Store token if provided in response (for API calls without cookies)
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                    // Set the Authorization header immediately for subsequent requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                }
                
                toast.success(response.data.message || 'Registration successful!');
                return userData;
            } else {
                toast.error(response.data.message || 'Registration failed');
                throw new Error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Make API call to logout (clears server-side cookies)
            await axios.post('/api/v1/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
            // Continue with logout even if API call fails
        }
        
        // Clear client-side data
        setUser(null);
        setIsAuthenticated(false);
        setUserRegistrations([]);
        setUserSubmissions([]);
        localStorage.removeItem('userAuth');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRegistrations');
        localStorage.removeItem('userSubmissions');
        
        // Clear axios Authorization header
        delete axios.defaults.headers.common['Authorization'];
        
        toast.success('Logged out successfully');
        navigate('/');
    };

    // User profile functions
    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
            console.log('Updating profile with data:', profileData);
            
            const response = await axios.put('/api/v1/users/profile', profileData);

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                localStorage.setItem('userAuth', JSON.stringify(updatedUser));
                toast.success(response.data.message || 'Profile updated successfully!');
                return updatedUser;
            } else {
                toast.error(response.data.message || 'Profile update failed');
                throw new Error('Profile update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            console.error('Error response:', error.response?.data);
            
            let errorMessage = 'Profile update failed';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                errorMessage = error.response.data.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUserActivity = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/users/activity');
            if (response.data.success) {
                return response.data.activities;
            } else {
                throw new Error('Failed to get user activity');
            }
        } catch (error) {
            console.error('Get user activity error:', error);
            if (error.response?.status === 401) {
                // Don't throw the error for auth issues, just return empty array
                return [];
            }
            throw error;
        }
    }, []);

    const getUserDashboard = async () => {
        try {
            const response = await axios.get('/api/v1/users/dashboard');
            if (response.data.success) {
                return response.data.dashboard;
            } else {
                throw new Error('Failed to get user dashboard');
            }
        } catch (error) {
            console.error('Get user dashboard error:', error);
            throw error;
        }
    };

    const getUserStats = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/users/stats');
            if (response.data.success) {
                return response.data.stats;
            } else {
                throw new Error('Failed to get user stats');
            }
        } catch (error) {
            console.error('Get user stats error:', error);
            if (error.response?.status === 401) {
                // Don't throw the error for auth issues, just return empty object
                return {};
            }
            throw error;
        }
    }, []);

    const fetchUserRegistrations = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/users/registrations');
            if (response.data.success) {
                setUserRegistrations(response.data.registrations);
                return response.data.registrations;
            } else {
                throw new Error('Failed to get user registrations');
            }
        } catch (error) {
            console.error('Get user registrations error:', error);
            if (error.response?.status === 401) {
                // Don't throw the error for auth issues, just return empty array
                return [];
            }
            throw error;
        }
    }, []);

    const fetchUserSubmissions = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/users/submissions');
            if (response.data.success) {
                setUserSubmissions(response.data.submissions);
                return response.data.submissions;
            } else {
                throw new Error('Failed to get user submissions');
            }
        } catch (error) {
            console.error('Get user submissions error:', error);
            if (error.response?.status === 401) {
                // Don't throw the error for auth issues, just return empty array
                return [];
            }
            throw error;
        }
    }, []);

    // Centralized profile data loading
    const loadProfileData = useCallback(async (forceReload = false) => {
        // Don't load if already loaded and not forcing reload
        if (profileData.loaded && !forceReload) {
            return profileData;
        }
        
        // Don't load if already loading
        if (profileData.loading) {
            return profileData;
        }
        
        // Don't load if no user or not authenticated
        if (!user || !user._id || !isAuthenticated) {
            console.log('Not loading profile data - user not authenticated');
            return profileData;
        }

        setProfileData(prev => ({ ...prev, loading: true }));

        try {
            console.log('Loading centralized profile data...');
            
            // Load all profile data in parallel with individual error handling
            const [registrations, submissions, activity, stats] = await Promise.allSettled([
                fetchUserRegistrations(),
                fetchUserSubmissions(),
                getUserActivity(),
                getUserStats()
            ]).then(results => [
                results[0].status === 'fulfilled' ? results[0].value : [],
                results[1].status === 'fulfilled' ? results[1].value : [],
                results[2].status === 'fulfilled' ? results[2].value : [],
                results[3].status === 'fulfilled' ? results[3].value : {}
            ]);

            const newProfileData = {
                registrations: registrations || [],
                submissions: submissions || [],
                activity: activity || [],
                stats: stats || {},
                loaded: true,
                loading: false
            };

            setProfileData(newProfileData);
            console.log('Centralized profile data loaded successfully');
            
            return newProfileData;

        } catch (error) {
            console.error('Error loading profile data:', error);
            
            // If it's an authentication error, clear the session
            if (error.response?.status === 401) {
                console.log('Authentication failed - clearing session');
                localStorage.removeItem('userAuth');
                localStorage.removeItem('authToken');
                setUser(null);
                setIsAuthenticated(false);
            }
            
            const errorProfileData = {
                registrations: [],
                submissions: [],
                activity: [],
                stats: {},
                loaded: false,
                loading: false
            };
            setProfileData(errorProfileData);
            return errorProfileData;
        }
    }, [user, profileData.loaded, profileData.loading, fetchUserRegistrations, fetchUserSubmissions, getUserActivity, getUserStats]);

    const fetchOpportunities = async () => {
        try {
            const response = await axios.get('/api/v1/opportunities');
            if (response.data?.success) {
            return response.data.opportunities.sort(
                (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
            );
            } else {
            console.warn('Failed to load opportunities from API');
            return [];
            }
        } catch (error) {
            console.error('Opportunities API error:', error);
            return [];
        }
    };

    // Reset profile data when user changes
    useEffect(() => {
        if (!user) {
            setProfileData({
                registrations: [],
                submissions: [],
                activity: [],
                stats: null,
                loaded: false,
                loading: false
            });
        }
    }, [user]);

    // Auto-load profile data when user logs in
    useEffect(() => {
        if (user && user._id && isAuthenticated && !profileData.loaded && !profileData.loading) {
            console.log('Auto-loading profile data for authenticated user');
            loadProfileData();
        } else if (!isAuthenticated && profileData.loaded) {
            console.log('User not authenticated - clearing profile data');
            setProfileData({
                registrations: [],
                submissions: [],
                activity: [],
                stats: {},
                loaded: false,
                loading: false
            });
        }
    }, [user, isAuthenticated, profileData.loaded, profileData.loading, loadProfileData]);

    // Event registration function (MongoDB optimized)
    const registerForEvent = async (eventId, registrationData) => {
        console.log('🔵 Registering for event:', { eventId, type: typeof eventId, length: eventId?.length });
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/events/${eventId}/register`, registrationData);
            
            if (response.data.success) {
                const newRegistration = response.data.registration;
                
                // Update local state immediately
                setUserRegistrations(prev => [...prev, newRegistration]);
                
                // Also refresh user registrations from server to ensure consistency
                await fetchUserRegistrations();
                
                // Update profile data
                loadProfileData(true);
                
                toast.success('Successfully registered for event!');
                return newRegistration;
            } else {
                throw new Error(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || 'Failed to register for event';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Event submission function (MongoDB optimized)
    const submitToEvent = async (eventId, submissionData) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/events/${eventId}/submit`, submissionData);
            
            if (response.data.success) {
                toast.success('Successfully submitted to event!');
                
                // Refresh both registrations and submissions since auto-registration might have occurred
                await fetchUserRegistrations();
                
                // Refresh profile data to include the new submission
                await loadProfileData(true);
                
                return response.data.submission;
            } else {
                throw new Error(response.data.message || 'Failed to submit to event');
            }
        } catch (error) {
            console.error('Submit to event error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit to event';
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Contact form submission
    const submitContactForm = async (contactData) => {
        setLoading(true);
        try {
            // Mock contact form submission
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Message sent successfully!');
            return true;
        } catch (error) {
            toast.error('Failed to send message');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Event API functions
    const fetchEvents = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/events', { params: filters });
            if (response.data.success) {
                setEvents(response.data.events);
                return response.data.events;
            } else {
                throw new Error('Failed to fetch events');
            }
        } catch (error) {
            console.error('Fetch events error:', error);
            throw error;
        }
    }, []);

    const fetchUpcomingEvents = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/events/upcoming');
            if (response.data.success) {
                return response.data.events;
            } else {
                throw new Error('Failed to fetch upcoming events');
            }
        } catch (error) {
            console.error('Fetch upcoming events error:', error);
            throw error;
        }
    }, []);

    const fetchEventById = useCallback(async (eventId) => {
        try {
            const response = await axios.get(`/api/v1/events/${eventId}`);
            if (response.data.success) {
                return response.data.event;
            } else {
                throw new Error('Failed to fetch event');
            }
        } catch (error) {
            console.error('Fetch event by id error:', error);
            throw error;
        }
    }, []);

    // Achievements API functions
    const fetchAchievements = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/achievements', { params: filters });
            if (response.data.success) {
                return response.data.achievements;
            } else {
                throw new Error('Failed to fetch achievements');
            }
        } catch (error) {
            console.error('Fetch achievements error:', error);
            throw error;
        }
    }, []);

    // Gallery API functions
    const fetchGallery = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/gallery', { params: filters });
            if (response.data.success) {
                return response.data.images;
            } else {
                throw new Error('Failed to fetch gallery images');
            }
        } catch (error) {
            console.error('Fetch gallery error:', error);
            throw error;
        }
    }, []);

    // Artworks API functions
    const fetchArtworks = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/artworks', { params: filters });
            if (response.data.success) {
                return response.data.artworks;
            } else {
                throw new Error('Failed to fetch artworks');
            }
        } catch (error) {
            console.error('Fetch artworks error:', error);
            throw error;
        }
    }, []);

    

    const submitArtwork = useCallback(async (artworkData) => {
        // Artwork submission is currently disabled
        toast.error('Artwork submission is currently disabled');
        throw new Error('Artwork submission is currently disabled');
    }, []);

    // Admin API functions
    const adminCreateAchievement = useCallback(async (achievementData) => {
        try {
            const response = await axios.post('/api/v1/admin/achievements', achievementData);
            if (response.data.success) {
                toast.success('Achievement created successfully!');
                return response.data.achievement;
            } else {
                throw new Error(response.data.message || 'Failed to create achievement');
            }
        } catch (error) {
            console.error('Create achievement error:', error);
            toast.error(error.response?.data?.message || 'Failed to create achievement');
            throw error;
        }
    }, []);

    const adminUpdateAchievement = useCallback(async (id, achievementData) => {
        try {
            const response = await axios.put(`/api/v1/admin/achievements/${id}`, achievementData);
            if (response.data.success) {
                toast.success('Achievement updated successfully!');
                return response.data.achievement;
            } else {
                throw new Error(response.data.message || 'Failed to update achievement');
            }
        } catch (error) {
            console.error('Update achievement error:', error);
            toast.error(error.response?.data?.message || 'Failed to update achievement');
            throw error;
        }
    }, []);

    const adminDeleteAchievement = useCallback(async (id) => {
        try {
            const response = await axios.delete(`/api/v1/admin/achievements/${id}`);
            if (response.data.success) {
                toast.success('Achievement deleted successfully!');
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete achievement');
            }
        } catch (error) {
            console.error('Delete achievement error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete achievement');
            throw error;
        }
    }, []);

    const adminCreateGalleryImage = useCallback(async (imageData) => {
        try {
            const response = await axios.post('/api/v1/admin/gallery', imageData);
            if (response.data.success) {
                toast.success('Gallery image created successfully!');
                return response.data.image;
            } else {
                throw new Error(response.data.message || 'Failed to create gallery image');
            }
        } catch (error) {
            console.error('Create gallery image error:', error);
            toast.error(error.response?.data?.message || 'Failed to create gallery image');
            throw error;
        }
    }, []);

    const adminUpdateGalleryImage = useCallback(async (id, imageData) => {
        try {
            const response = await axios.put(`/api/v1/admin/gallery/${id}`, imageData);
            if (response.data.success) {
                toast.success('Gallery image updated successfully!');
                return response.data.image;
            } else {
                throw new Error(response.data.message || 'Failed to update gallery image');
            }
        } catch (error) {
            console.error('Update gallery image error:', error);
            toast.error(error.response?.data?.message || 'Failed to update gallery image');
            throw error;
        }
    }, []);

    const adminDeleteGalleryImage = useCallback(async (id) => {
        try {
            const response = await axios.delete(`/api/v1/admin/gallery/${id}`);
            if (response.data.success) {
                toast.success('Gallery image deleted successfully!');
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete gallery image');
            }
        } catch (error) {
            console.error('Delete gallery image error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete gallery image');
            throw error;
        }
    }, []);

    const adminGetArtworks = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/admin/artworks', { params: filters });
            if (response.data.success) {
                return response.data.artworks;
            } else {
                throw new Error('Failed to fetch artworks');
            }
        } catch (error) {
            console.error('Fetch admin artworks error:', error);
            throw error;
        }
    }, []);

    const adminUpdateArtworkStatus = useCallback(async (id, status, moderationNotes) => {
        try {
            const response = await axios.patch(`/api/v1/admin/artworks/${id}/status`, { 
                status, 
                moderationNotes 
            });
            if (response.data.success) {
                toast.success('Artwork status updated successfully!');
                return response.data.artwork;
            } else {
                throw new Error(response.data.message || 'Failed to update artwork status');
            }
        } catch (error) {
            console.error('Update artwork status error:', error);
            toast.error(error.response?.data?.message || 'Failed to update artwork status');
            throw error;
        }
    }, []);

    const adminDeleteArtwork = useCallback(async (id) => {
        try {
            const response = await axios.delete(`/api/v1/admin/artworks/${id}`);
            if (response.data.success) {
                toast.success('Artwork deleted successfully!');
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete artwork');
            }
        } catch (error) {
            console.error('Delete artwork error:', error);
            toast.error(error.response?.data?.message || 'Failed to delete artwork');
            throw error;
        }
    }, []);

    const adminGetGalleryImages = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/admin/gallery', { params: filters });
            if (response.data.success) {
                return response.data.images;
            } else {
                throw new Error('Failed to fetch gallery images');
            }
        } catch (error) {
            console.error('Fetch admin gallery images error:', error);
            throw error;
        }
    }, []);

    // Settings API functions
    const fetchSettings = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/settings');
            if (response.data.success) {
                return response.data.settings;
            } else {
                throw new Error('Failed to fetch settings');
            }
        } catch (error) {
            console.error('Fetch settings error:', error);
            throw error;
        }
    }, []);

    const updateSettings = useCallback(async (settingsData) => {
        try {
            const response = await axios.put('/api/v1/settings', settingsData);
            if (response.data.success) {
                toast.success('Settings updated successfully!');
                // Reload settings to get the latest data
                const updatedSettings = await fetchSettings();
                setSettings({
                    siteInfo: {
                        name: updatedSettings?.site?.name || 'Animation Club',
                        description: updatedSettings?.site?.description || 'A creative community for animation enthusiasts',
                        established: updatedSettings?.site?.established || '2020',
                        mission: updatedSettings?.site?.mission || 'To provide learning opportunities, industry connections, and creative platforms for students interested in animation and visual storytelling.',
                        vision: updatedSettings?.site?.vision || 'To foster creativity, innovation, and excellence in animation while building a supportive community of aspiring animators.'
                    },
                    socialLinks: {
                        instagram: updatedSettings?.socialMedia?.instagram || '',
                        youtube: updatedSettings?.socialMedia?.youtube || '',
                        twitter: updatedSettings?.socialMedia?.twitter || '',
                        facebook: updatedSettings?.socialMedia?.facebook || '',
                        linkedin: updatedSettings?.socialMedia?.linkedin || '',
                        discord: updatedSettings?.socialMedia?.discord || '',
                        email: updatedSettings?.site?.contactEmail || 'animation.fmcweekend@gmail.com'
                    },
                    contactInfo: {
                        email: updatedSettings?.site?.contactEmail || 'animation.fmcweekend@gmail.com',
                        phone: updatedSettings?.site?.contactPhone || '',
                        address: updatedSettings?.site?.address?.full || 
                                (updatedSettings?.site?.address && Object.keys(updatedSettings.site.address).length > 0 
                                    ? `${updatedSettings.site.address.street || ''}, ${updatedSettings.site.address.city || ''}, ${updatedSettings.site.address.state || ''} ${updatedSettings.site.address.zipCode || ''}`.replace(/(^,\s*|,\s*$)/g, '').replace(/,\s*,/g, ',').trim()
                                    : ''),
                        officeHours: updatedSettings?.site?.officeHours || ''
                    },
                    logo: updatedSettings?.site?.logo?.url || null,
                    favicon: updatedSettings?.site?.favicon?.url || null,
                    announcements: updatedSettings?.announcements || [],
                    loaded: true,
                    loading: false
                });
                return response.data.settings;
            } else {
                throw new Error(response.data.message || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Update settings error:', error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
            throw error;
        }
    }, []);


    // Utility functions for user state
    const isRegisteredForEvent = eventId => {
      if (!eventId || !user || !Array.isArray(userRegistrations)) return false;
      const eventIdStr = String(eventId);
      const userId = String(user._id);
      return userRegistrations.some(reg => {
        if (!reg) return false;
        let regEventId = '';
        if (reg.eventId) {
          regEventId = typeof reg.eventId === 'object' && reg.eventId._id ? String(reg.eventId._id) : String(reg.eventId);
        }
        return regEventId === eventIdStr && String(reg.userId) === userId;
      });
    };

    const hasSubmittedForEvent = eventId => {
      if (!eventId || !user || !Array.isArray(userSubmissions)) return false;
      const eventIdString = eventId?.toString();
      if (!eventIdString) return false;
      return userSubmissions.some(sub => {
        if (!sub) return false;
        let subEventIdString;
        if (typeof sub.eventId === 'object' && sub.eventId?._id) {
          subEventIdString = sub.eventId._id.toString();
        } else if (sub.eventId) {
          subEventIdString = sub.eventId.toString();
        } else {
          return false;
        }
        return subEventIdString === eventIdString && sub.userId === user._id;
      });
    };

    const getEventSubmission = eventId => {
      if (!eventId || !user || !Array.isArray(userSubmissions)) return null;
      const eventIdString = eventId?.toString();
      if (!eventIdString) return null;
      return userSubmissions.find(sub => {
        if (!sub) return false;
        let subEventIdString;
        if (typeof sub.eventId === 'object' && sub.eventId?._id) {
          subEventIdString = sub.eventId._id.toString();
        } else if (sub.eventId) {
          subEventIdString = sub.eventId.toString();
        } else {
          return false;
        }
        return subEventIdString === eventIdString && sub.userId === user._id;
      }) || null;
    };

    const getUserRegistrations = () => {
      if (!user || !Array.isArray(userRegistrations)) return [];
      try {
        return userRegistrations.filter(reg => reg && reg.userId === user._id);
      } catch {
        return [];
      }
    };

    const getUserSubmissions = () => {
      if (!user || !Array.isArray(userSubmissions)) return [];
      return userSubmissions.filter(sub => sub.userId === user._id);
    };

    const submitForEvent = submitToEvent;

    const value = {
        // User state
        user,
        isAuthenticated,
        loading,
        
        // Data
        events,
        userRegistrations,
        userSubmissions,
        
        // Site settings
        settings,
        
        // Centralized profile data
        profileData,
        loadProfileData,
        
        // Functions
        login,
        register,
        logout,
        updateProfile,
        registerForEvent,
        submitToEvent,
        submitContactForm,
        getUserActivity,
        getUserDashboard,
        getUserStats,
        fetchUserRegistrations,
        fetchUserSubmissions,
        fetchEvents,
        fetchUpcomingEvents,
        fetchEventById,
        fetchAchievements,
        fetchGallery,
        fetchArtworks,
        submitArtwork,
        fetchOpportunities,
        
        // Settings functions
        fetchSettings,
        updateSettings,
        
        // Admin functions
        adminCreateAchievement,
        adminUpdateAchievement,
        adminDeleteAchievement,
        adminCreateGalleryImage,
        adminUpdateGalleryImage,
        adminDeleteGalleryImage,
        adminGetArtworks,
        adminUpdateArtworkStatus,
        adminDeleteArtwork,
        adminGetGalleryImages,
        
        // Utils
        axios,
        isRegisteredForEvent,
        hasSubmittedForEvent,
        getEventSubmission,
        getUserRegistrations,
        getUserSubmissions,
        submitForEvent
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};