/**
 * App Context - Centralized State Management
 * 
 * This context provides centralized user authentication and profile management.
 */

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [userRegistrations, setUserRegistrations] = useState([]);
    const [userSubmissions, setUserSubmissions] = useState([]);
    
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
        const initializeUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('authToken');
                const userData = localStorage.getItem('userAuth');
                
                if (token && userData) {
                    try {
                        const response = await axios.get('/api/v1/auth/me');
                        if (response.data.success) {
                            setUser(response.data.user);
                            setIsAuthenticated(true);
                            loadProfileData();
                        } else {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('userAuth');
                        }
                    } catch (error) {
                        console.error('Session verification failed:', error);
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('userAuth');
                    }
                }
            } catch (error) {
                console.error('User initialization error:', error);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, []);

    // Centralized profile data loading
    const loadProfileData = useCallback(async (forceReload = false) => {
        if (!isAuthenticated || (profileData.loaded && !forceReload)) return;
        
        try {
            setProfileData(prev => ({ ...prev, loading: true }));
            
            const [registrations, submissions, activity, stats] = await Promise.allSettled([
                fetchUserRegistrations(),
                fetchUserSubmissions(),
                getUserActivity(),
                getUserStats()
            ]);

            setProfileData({
                registrations: registrations.status === 'fulfilled' ? registrations.value : [],
                submissions: submissions.status === 'fulfilled' ? submissions.value : [],
                activity: activity.status === 'fulfilled' ? activity.value : [],
                stats: stats.status === 'fulfilled' ? stats.value : null,
                loaded: true,
                loading: false
            });
        } catch (error) {
            console.error('Profile data loading error:', error);
            setProfileData(prev => ({ ...prev, loading: false }));
        }
    }, [isAuthenticated]);

    // Authentication functions
    const loginUser = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/auth/login', { email, password });

            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('userAuth', JSON.stringify(userData));
                localStorage.setItem('authToken', response.data.token);
                toast.success('Login successful!');
                await loadProfileData(true);
                navigate('/profile');
                return userData;
            } else {
                toast.error(response.data.message || 'Login failed');
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed';
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

    const registerUser = async (registrationData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/auth/register', registrationData);

            if (response.data.success) {
                const userData = response.data.user;
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('userAuth', JSON.stringify(userData));
                localStorage.setItem('authToken', response.data.token);
                toast.success('Registration successful!');
                await loadProfileData(true);
                navigate('/profile');
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

    // Alias functions for backward compatibility
    const login = loginUser;
    const register = registerUser;

    const logoutUser = async () => {
        try {
            await axios.post('/api/v1/auth/logout');
        } catch (error) {
            console.error('Logout API error:', error);
        }
        
        setUser(null);
        setIsAuthenticated(false);
        setUserRegistrations([]);
        setUserSubmissions([]);
        localStorage.removeItem('userAuth');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRegistrations');
        localStorage.removeItem('userSubmissions');
        toast.success('Logged out successfully');
        navigate('/');
    };

    // User profile functions
    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
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

    const uploadAvatar = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axios.post('/api/v1/users/upload-avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                localStorage.setItem('userAuth', JSON.stringify(updatedUser));
                toast.success(response.data.message || 'Avatar uploaded successfully!');
                return response.data.avatar;
            } else {
                toast.error(response.data.message || 'Avatar upload failed');
                throw new Error('Avatar upload failed');
            }
        } catch (error) {
            console.error('Avatar upload error:', error);
            const errorMessage = error.response?.data?.message || 'Avatar upload failed';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteAvatar = async () => {
        setLoading(true);
        try {
            const response = await axios.delete('/api/v1/users/avatar');

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                localStorage.setItem('userAuth', JSON.stringify(updatedUser));
                toast.success(response.data.message || 'Avatar deleted successfully!');
                return updatedUser;
            } else {
                toast.error(response.data.message || 'Avatar deletion failed');
                throw new Error('Avatar deletion failed');
            }
        } catch (error) {
            console.error('Avatar deletion error:', error);
            const errorMessage = error.response?.data?.message || 'Avatar deletion failed';
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
            throw error;
        }
    }, []);

    // Contact API functions
    const fetchContacts = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/contact');
            if (response.data.success) {
                return response.data.contacts;
            } else {
                throw new Error('Failed to fetch contacts');
            }
        } catch (error) {
            console.error('Fetch contacts error:', error);
            throw error;
        }
    }, []);

    const submitContact = async (contactData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/contact', contactData);
            
            if (response.data.success) {
                toast.success('Message sent successfully!');
                return response.data.contact;
            } else {
                throw new Error(response.data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Submit contact error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Member API functions
    const fetchMembers = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/members', { params: filters });
            if (response.data.success) {
                return response.data.members;
            } else {
                throw new Error('Failed to fetch members');
            }
        } catch (error) {
            console.error('Fetch members error:', error);
            throw error;
        }
    }, []);

    // Event API functions
    const fetchEvents = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/events', { params: filters });
            if (response.data.success) {
                return response.data.events;
            } else {
                throw new Error('Failed to fetch events');
            }
        } catch (error) {
            console.error('Fetch events error:', error);
            throw error;
        }
    }, []);

    const fetchUpcomingEvents = useCallback(async (limit = 10) => {
        try {
            const response = await axios.get('/api/v1/events', { 
                params: { 
                    status: 'upcoming',
                    limit 
                } 
            });
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

    const fetchFeaturedEvents = useCallback(async (limit = 5) => {
        try {
            const response = await axios.get('/api/v1/events', { 
                params: { 
                    featured: true,
                    limit 
                } 
            });
            if (response.data.success) {
                return response.data.events;
            } else {
                throw new Error('Failed to fetch featured events');
            }
        } catch (error) {
            console.error('Fetch featured events error:', error);
            throw error;
        }
    }, []);

    const fetchEventDetails = useCallback(async (eventId) => {
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

    const registerForEvent = async (eventId, registrationData) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/events/${eventId}/register`, registrationData);
            
            if (response.data.success) {
                const newRegistration = response.data.registration;
                setUserRegistrations(prev => [...prev, newRegistration]);
                await fetchUserRegistrations();
                loadProfileData(true);
                toast.success('Successfully registered for event!');
                return newRegistration;
            } else {
                throw new Error(response.data.message || 'Registration failed');
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

    const unregisterFromEvent = async (eventId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/v1/events/${eventId}/register`);
            
            if (response.data.success) {
                setUserRegistrations(prev => prev.filter(reg => reg.eventId !== eventId));
                await fetchUserRegistrations();
                loadProfileData(true);
                toast.success('Successfully unregistered from event!');
                return true;
            } else {
                throw new Error(response.data.message || 'Unregistration failed');
            }
        } catch (error) {
            console.error('Unregistration error:', error);
            const errorMessage = error.response?.data?.message || 'Unregistration failed';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const submitToEvent = async (eventId, submissionData) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/events/${eventId}/submit`, submissionData);
            
            if (response.data.success) {
                const newSubmission = response.data.submission;
                setUserSubmissions(prev => [...prev, newSubmission]);
                await fetchUserSubmissions();
                loadProfileData(true);
                toast.success('Submission uploaded successfully!');
                return newSubmission;
            } else {
                throw new Error(response.data.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            const errorMessage = error.response?.data?.message || 'Submission failed';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

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

    const fetchFeaturedGallery = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/gallery/featured');
            if (response.data.success) {
                return response.data.images;
            } else {
                throw new Error('Failed to fetch featured gallery images');
            }
        } catch (error) {
            console.error('Fetch featured gallery error:', error);
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

    const fetchFeaturedArtworks = useCallback(async () => {
        try {
            const response = await axios.get('/api/v1/artworks/featured');
            if (response.data.success) {
                return response.data.artworks;
            } else {
                throw new Error('Failed to fetch featured artworks');
            }
        } catch (error) {
            console.error('Fetch featured artworks error:', error);
            throw error;
        }
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

    const adminGetGalleryImages = useCallback(async (filters = {}) => {
        try {
            const response = await axios.get('/api/v1/admin/gallery', { params: filters });
            if (response.data.success) {
                return response.data.images;
            } else {
                throw new Error('Failed to fetch gallery images');
            }
        } catch (error) {
            console.error('Fetch gallery images error:', error);
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

    const adminCreateArtwork = useCallback(async (artworkData) => {
        try {
            const response = await axios.post('/api/v1/admin/artworks', artworkData);
            if (response.data.success) {
                toast.success('Artwork created successfully!');
                return response.data.artwork;
            } else {
                throw new Error(response.data.message || 'Failed to create artwork');
            }
        } catch (error) {
            console.error('Create artwork error:', error);
            toast.error(error.response?.data?.message || 'Failed to create artwork');
            throw error;
        }
    }, []);

    // Export all functions and state for the app context
    return (
        <AppContext.Provider value={{
            // Authentication state
            user,
            isAuthenticated,
            loading,
            
            // User functions
            loginUser,
            registerUser,
            login,
            register,
            logoutUser,
            updateProfile,
            uploadAvatar,
            deleteAvatar,
            
            // User data functions
            getUserActivity,
            getUserDashboard,
            getUserStats,
            fetchUserRegistrations,
            fetchUserSubmissions,
            loadProfileData,
            
            // Public data functions
            fetchEvents,
            fetchUpcomingEvents,
            fetchFeaturedEvents,
            fetchEventDetails,
            registerForEvent,
            unregisterFromEvent,
            submitToEvent,
            fetchContacts,
            submitContact,
            fetchMembers,
            fetchAchievements,
            fetchGallery,
            fetchFeaturedGallery,
            fetchArtworks,
            fetchFeaturedArtworks,
            
            // Admin functions
            adminCreateAchievement,
            adminUpdateAchievement,
            adminDeleteAchievement,
            adminCreateGalleryImage,
            adminUpdateGalleryImage,
            adminDeleteGalleryImage,
            adminGetGalleryImages,
            adminGetArtworks,
            adminUpdateArtworkStatus,
            adminDeleteArtwork,
            adminCreateArtwork,
            
            // Event data for components that use it
            events: []
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};
