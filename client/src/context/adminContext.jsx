import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

// Note: axios interceptors are configured in appContext.jsx to avoid duplication

export const AdminContext = createContext();

export const AdminContextProvider = ({ children }) => {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [members, setMembers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAdminData = async () => {
            try {
                // Check for existing admin session
                const adminData = localStorage.getItem('adminAuth');
                const authToken = localStorage.getItem('authToken');
                
                if (adminData && authToken) {
                    try {
                        const response = await axios.get('/api/v1/auth/me');
                        if (response.data.success && response.data.user.role === 'admin') {
                            setAdminUser(response.data.user);
                            setIsAdminAuthenticated(true);
                            await loadAdminData();
                        } else {
                            localStorage.removeItem('adminAuth');
                            localStorage.removeItem('authToken');
                        }
                    } catch (error) {
                        console.error('Admin session verification failed:', error);
                        localStorage.removeItem('adminAuth');
                        localStorage.removeItem('authToken');
                    }
                }
            } catch (error) {
                console.error('Error initializing admin data:', error);
            }
        };

        initializeAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            setLoading(true);
            
            // Load data sequentially to prevent overwhelming the server
            await fetchAdminEvents().catch(() => []);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await fetchMembers().catch(() => []);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await fetchRegistrations().catch(() => []);
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await fetchSubmissions().catch(() => []);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminEvents = async (filters = {}) => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/admin/events', { 
                params: filters,
                timeout: 5000
            });
            
            if (response.data?.success) {
                setEvents(response.data.events);
                return response.data.events;
            }
            console.error('Fetch admin events failed:', response.data?.message);
            setEvents([]);
            return [];
        } catch (error) {
            console.error('Failed to fetch events:', error.message);
            setEvents([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await axios.get('/api/v1/admin/members');
            if (response.data.success) {
                setMembers(response.data.members);
                return response.data.members;
            }
            throw new Error('Failed to fetch members');
        } catch (error) {
            console.error('Failed to fetch members:', error.message);
            setMembers([]);
            throw error;
        }
    };

    const fetchRegistrations = async (eventId = null) => {
        try {
            const url = eventId ? `/api/v1/admin/events/${eventId}/registrations` : '/api/v1/admin/registrations';
            const response = await axios.get(url);
            if (response.data.success) {
                setRegistrations(response.data.registrations);
                return response.data.registrations;
            }
            throw new Error('Failed to fetch registrations');
        } catch (error) {
            console.error('Failed to fetch registrations:', error.message);
            setRegistrations([]);
            throw error;
        }
    };

    const fetchSubmissions = async (eventId = null) => {
        try {
            const url = eventId ? `/api/v1/admin/events/${eventId}/submissions` : '/api/v1/admin/submissions';
            const response = await axios.get(url);
            
            if (response.data.success) {
                setSubmissions(response.data.submissions);
                return response.data.submissions;
            }
            throw new Error('Failed to fetch submissions');
        } catch (error) {
            console.error('Failed to fetch submissions:', error.message);
            setSubmissions([]);
            throw error;
        }
    };

    // Admin authentication functions
    const adminLogin = async (credentials) => {
        setLoading(true);
        try {
            // Make actual API call to backend for admin login
            const response = await axios.post('/api/v1/auth/login', {
                email: credentials.email,
                password: credentials.password
            });

            if (response.data.success) {
                const userData = response.data.user;
                
                // Check if user has admin role
                if (userData.role !== 'admin') {
                    toast.error('Admin access required');
                    return false;
                }
                
                setAdminUser(userData);
                setIsAdminAuthenticated(true);
                localStorage.setItem('adminAuth', JSON.stringify(userData));
                
                // Store token if provided in response (for API calls without cookies)
                if (response.data.token) {
                    localStorage.setItem('authToken', response.data.token);
                    // Set the Authorization header immediately for subsequent requests
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                }
                
                toast.success('Admin login successful!');
                navigate('/admin');
                return true;
            } else {
                toast.error(response.data.message || 'Admin login failed');
                return false;
            }
        } catch (error) {
            console.error('Admin login error:', error);
            const errorMessage = error.response?.data?.message || 'Admin login failed';
            toast.error(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const adminLogout = async () => {
        try {
            // Make API call to logout
            await axios.post('/api/v1/auth/logout');
            
            setAdminUser(null);
            setIsAdminAuthenticated(false);
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('authToken');
            
            // Clear axios Authorization header
            delete axios.defaults.headers.common['Authorization'];
            
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local data even if API call fails
            setAdminUser(null);
            setIsAdminAuthenticated(false);
            localStorage.removeItem('adminAuth');
            localStorage.removeItem('authToken');
            
            // Clear axios Authorization header
            delete axios.defaults.headers.common['Authorization'];
            
            toast.success('Logged out successfully');
            navigate('/');
        }
    };

    // Event management functions
    const createEvent = async (eventData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/admin/events', eventData);
            if (response.data.success) {
                const newEvent = response.data.event;
                setEvents(prev => [...prev, newEvent]);
                toast.success('Event created successfully!');
                return newEvent;
            } else {
                throw new Error(response.data.message || 'Failed to create event');
            }
        } catch (error) {
            console.error('Create event error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to create event';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };



    const updateEvent = async (eventId, eventData) => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/v1/admin/events/${eventId}`, eventData);
            if (response.data.success) {
                const updatedEvent = response.data.event;
                setEvents(prev => prev.map(event => 
                    event._id === eventId ? updatedEvent : event
                ));
                toast.success('Event updated successfully!');
                return updatedEvent;
            } else {
                throw new Error(response.data.message || 'Failed to update event');
            }
        } catch (error) {
            console.error('Update event error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update event';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (eventId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/v1/admin/events/${eventId}`);
            if (response.data.success) {
                setEvents(prev => prev.filter(event => event._id !== eventId));
                toast.success('Event deleted successfully!');
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete event');
            }
        } catch (error) {
            console.error('Delete event error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete event';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Member management functions
    const createMember = async (memberData) => {
        setLoading(true);
        try {
            console.log('Creating member with data:', memberData);
            const response = await axios.post('/api/v1/admin/members', memberData);
            if (response.data.success) {
                const newMember = response.data.member;
                setMembers(prev => [...prev, newMember]);
                toast.success('Member added successfully!');
                return newMember;
            } else {
                throw new Error(response.data.message || 'Failed to create member');
            }
        } catch (error) {
            console.error('Create member error:', error);
            let errorMessage = 'Failed to add member';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error. Please check if all required fields are provided.';
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid member data. Please check your input.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateMember = async (memberId, memberData) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/v1/admin/members/${memberId}`, memberData);
            if (response.data.success) {
                const updatedMember = response.data.member;
                setMembers(prev => prev.map(member => 
                    member._id === memberId ? updatedMember : member
                ));
                toast.success('Member updated successfully!');
                return updatedMember;
            } else {
                throw new Error(response.data.message || 'Failed to update member');
            }
        } catch (error) {
            console.error('Update member error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update member';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteMember = async (memberId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/v1/admin/members/${memberId}`);
            if (response.data.success) {
                setMembers(prev => prev.filter(member => member._id !== memberId));
                toast.success('Member removed successfully!');
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete member');
            }
        } catch (error) {
            console.error('Delete member error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to remove member';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Update member position (promotion/role change)
    const updateMemberPosition = async (memberId, { newPosition, reason }) => {
        setLoading(true);
        try {
            console.log('Updating member position:', { memberId, newPosition, reason });
            const response = await axios.patch(`/api/v1/admin/members/${memberId}/position`, {
                newPosition,
                reason
            });
            
            if (response.data.success) {
                const updatedMember = response.data.member;
                setMembers(prev => prev.map(member => 
                    member._id === memberId ? updatedMember : member
                ));
                
                const promotionMessage = `${updatedMember.name} has been promoted to ${newPosition.title || newPosition.role}`;
                toast.success(promotionMessage);
                return updatedMember;
            } else {
                throw new Error(response.data.message || 'Failed to update member position');
            }
        } catch (error) {
            console.error('Update member position error:', error);
            let errorMessage = 'Failed to update member position';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.status === 404) {
                errorMessage = 'Member not found';
            } else if (error.response?.status === 400) {
                errorMessage = 'Invalid position data. Please check your input.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Gallery management functions
    const addGalleryImage = async (imageData) => {
        setLoading(true);
        try {
            const newImage = {
                ...imageData,
                _id: `gallery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate MongoDB-style ID
                timestamps: {
                    ...imageData.timestamps,
                    uploadedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };
            setGalleryImages(prev => [...prev, newImage]);
            toast.success('Image added to gallery!');
            return newImage;
        } catch (error) {
            toast.error('Failed to add image');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateGalleryImage = async (imageId, imageData) => {
        setLoading(true);
        try {
            setGalleryImages(prev => prev.map(image => 
                image._id === imageId ? { 
                    ...image, 
                    ...imageData,
                    timestamps: {
                        ...image.timestamps,
                        ...imageData.timestamps,
                        updatedAt: new Date().toISOString()
                    }
                } : image
            ));
            toast.success('Image updated successfully!');
        } catch (error) {
            toast.error('Failed to update image');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteGalleryImage = async (imageId) => {
        setLoading(true);
        try {
            setGalleryImages(prev => prev.filter(image => image._id !== imageId));
            toast.success('Image deleted successfully!');
        } catch (error) {
            toast.error('Failed to delete image');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Registration management functions
    const updateRegistrationStatus = async (registrationId, status) => {
        setLoading(true);
        try {
            // Make API call to update status on backend
            const response = await axios.patch(`/api/v1/admin/registrations/${registrationId}/status`, {
                status
            });

            if (response.data.success) {
                // Update local state if API call succeeds
                setRegistrations(prev => prev.map(reg => 
                    reg._id === registrationId 
                        ? { 
                            ...reg, 
                            status,
                            timestamps: {
                                ...reg.timestamps,
                                updatedAt: new Date().toISOString()
                            }
                        } 
                        : reg
                ));
                toast.success('Registration status updated!');
            } else {
                throw new Error(response.data.message || 'Failed to update registration status');
            }
        } catch (error) {
            console.error('Error updating registration status:', error);
            toast.error(error.response?.data?.message || 'Failed to update registration');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Submission management functions
    const updateSubmissionStatus = async (submissionId, status) => {
        setLoading(true);
        try {
            // Make API call to update status on backend
            const response = await axios.patch(`/api/v1/admin/submissions/${submissionId}/status`, {
                status
            });

            if (response.data.success) {
                // Update local state if API call succeeds
                setSubmissions(prev => prev.map(sub => 
                    sub._id === submissionId
                        ? { 
                            ...sub, 
                            status,
                            timestamps: {
                                ...sub.timestamps,
                                updatedAt: new Date().toISOString()
                            }
                        } 
                        : sub
                ));
                toast.success('Submission status updated!');
            } else {
                throw new Error(response.data.message || 'Failed to update submission status');
            }
        } catch (error) {
            console.error('Error updating submission status:', error);
            toast.error(error.response?.data?.message || 'Failed to update submission');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteSubmission = async (submissionId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/v1/admin/submissions/${submissionId}`);

            if (response.data.success) {
                // Remove from local state if API call succeeds
                setSubmissions(prev => prev.filter(sub => sub._id !== submissionId));
                toast.success('Submission deleted successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to delete submission');
            }
        } catch (error) {
            console.error('Error deleting submission:', error);
            toast.error(error.response?.data?.message || 'Failed to delete submission');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateSubmissionAward = async (submissionId, awardData) => {
        setLoading(true);
        try {
            // Make API call to update award on backend
            const response = await axios.patch(`/api/v1/admin/submissions/${submissionId}/award`, awardData);

            if (response.data.success) {
                // Update local state if API call succeeds
                setSubmissions(prev => prev.map(sub => 
                    sub._id === submissionId
                        ? { 
                            ...sub, 
                            award: response.data.submission.award
                        } 
                        : sub
                ));
                toast.success('Submission award updated!');
                return response.data.submission;
            } else {
                throw new Error(response.data.message || 'Failed to update submission award');
            }
        } catch (error) {
            console.error('Error updating submission award:', error);
            toast.error(error.response?.data?.message || 'Failed to update submission award');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Settings management
    const updateSettings = async (newSettings) => {
        setLoading(true);
        try {
            setSettings(prev => ({ ...prev, ...newSettings }));
            toast.success('Settings updated successfully!');
        } catch (error) {
            toast.error('Failed to update settings');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Member data fetching function (alias for fetchMembers)
    const getMembers = async () => {
        return await fetchMembers();
    };

    // Update member profile (simplified - only bio, mobile, skills)
    const updateMemberProfile = async (memberId, profileData) => {
        setLoading(true);
        try {
            const response = await axios.patch(`/api/v1/admin/members/${memberId}/profile`, profileData);
            if (response.data.success) {
                const updatedMember = response.data.member;
                setMembers(prev => prev.map(member => 
                    member._id === memberId ? updatedMember : member
                ));
                toast.success('Profile updated successfully!');
                return updatedMember;
            } else {
                throw new Error(response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update profile';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const getContacts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/contact/submissions');
            if (response.data.success) {
                setContacts(response.data.contacts);
                return response.data;
            }
        } catch (error) {
            console.error('Get contacts error:', error);
            toast.error('Failed to fetch contact submissions');
            throw error;
        } finally {
            setLoading(false);
        }
    };
    
    const markContactAsRead=  async (contactId, isRead) => {
        try {
            const response = await axios.patch(`/api/v1/contact/${contactId}/read`, { isRead });
            if (response.data.success) {
                setContacts(prev => prev.map(contact => 
                    contact._id === contactId ? { ...contact, isRead } : contact
                ));
                toast.success(`Contact marked as ${isRead ? 'read' : 'unread'}`);
                return response.data.contact;
            }
        } catch (error) {
            console.error('Mark contact as read error:', error);
            toast.error('Failed to update contact status');
            throw error;
        }
    }; 

    const updateContactStatus = async (contactId, status) => {
        try {
            const response = await axios.patch(`/api/v1/contact/${contactId}/status`, { status });
            if (response.data.success) {
                setContacts(prev => prev.map(contact => 
                    contact._id === contactId ? { ...contact, status } : contact
                ));
                toast.success('Contact status updated successfully');
                return response.data.contact;
            }
        } catch (error) {
            console.error('Update contact status error:', error);
            toast.error('Failed to update contact status');
            throw error;
        }
    };

    const deleteContact = async (contactId) => {
        try {
            const response = await axios.delete(`/api/v1/contact/${contactId}`);
            if (response.data.success) {
                setContacts(prev => prev.filter(contact => contact._id !== contactId));
                toast.success('Contact deleted successfully');
                return true;
            }
        } catch (error) {
            console.error('Delete contact error:', error);
            toast.error('Failed to delete contact');
            throw error;
        }
    };
    const adminCreateArtwork = async (artworkData) => {
        setLoading(true);
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
            const errorMessage = error.response?.data?.message || 'Failed to create artwork';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const adminUpdateArtwork = async (artworkId, artworkData) => {
        setLoading(true);
        try {
            const response = await axios.put(`/api/v1/admin/artworks/${artworkId}`, artworkData);
            if (response.data.success) {
                toast.success('Artwork updated successfully!');
                return response.data.artwork;
            } else {
                throw new Error(response.data.message || 'Failed to update artwork');
            }
        } catch (error) {
            console.error('Update artwork error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update artwork';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };


    const adminToggleArtworkFeatured = async (artworkId) => {
        setLoading(true);
        try {
            const response = await axios.patch(`/api/v1/admin/artworks/${artworkId}/featured`);
            if (response.data.success) {
                toast.success('Artwork featured status updated successfully!');
                return response.data.artwork;
            } else {
                throw new Error(response.data.message || 'Failed to update featured status');
            }
        } catch (error) {
            console.error('Toggle artwork featured error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to update featured status';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const adminDeleteArtwork = async (artworkId) => {
        setLoading(true);
        try {
            const response = await axios.delete(`/api/v1/admin/artworks/${artworkId}`);
            if (response.data.success) {
                toast.success('Artwork deleted successfully!');
                return true;
            } else {
                throw new Error(response.data.message || 'Failed to delete artwork');
            }
        } catch (error) {
            console.error('Delete artwork error:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete artwork';
            toast.error(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        // Auth state
        isAdminAuthenticated,
        adminUser,
        loading,
        
        // Data state
        events,
        members,
        contacts,
        galleryImages,
        registrations,
        submissions,
        settings,
        
        // Auth functions
        adminLogin,
        adminLogout,
        
        // Data fetching functions
        fetchAdminEvents,
        fetchMembers,
        fetchRegistrations,
        fetchSubmissions,
        loadAdminData,
        
        // Event functions
        createEvent,
        updateEvent,
        deleteEvent,
        
        // Member functions
        getMembers,
        createMember,
        updateMember,
        updateMemberProfile,
        deleteMember,
        updateMemberPosition,
        
        // Gallery functions
        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,
        
        // Registration functions
        updateRegistrationStatus,
        
        // Submission functions
        updateSubmissionStatus,
        deleteSubmission,
        updateSubmissionAward,
        
        // Settings functions
        updateSettings,
        
        // Contact management functions
        getContacts,
        
        markContactAsRead,
        
        updateContactStatus,
        
        deleteContact,

        // Artwork management functions
        adminCreateArtwork,

        adminUpdateArtwork,

        adminDeleteArtwork,
        adminToggleArtworkFeatured,

    };

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error('useAdminContext must be used within AdminContextProvider');
    }
    return context;
};
