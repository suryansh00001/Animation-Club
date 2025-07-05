import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Check, X, User } from 'lucide-react';
import { useAppContext } from '../context/appContext';

const ContactUs = () => {
    const { settings, axios } = useAppContext();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

    const categories = [
        { value: 'general', label: 'General Inquiry' },
        { value: 'membership', label: 'Membership' },
        { value: 'events', label: 'Events' },
        { value: 'technical', label: 'Technical Support' },
        { value: 'complaint', label: 'Complaint' },
        { value: 'suggestion', label: 'Suggestion' }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await axios.post('/api/v1/contact/submit', formData);
            
            if (response.data.success) {
                setSubmitStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    category: 'general'
                });
            }
        } catch (error) {
            console.error('Contact form submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Have questions about our club? Want to join us? We'd love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-purple-600 rounded-lg p-8 text-white h-full">
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                            
                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start space-x-4">
                                    <Mail className="w-6 h-6 text-purple-200 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <a 
                                            href={`mailto:${settings.contactInfo?.email || settings.socialLinks?.email || 'animation.fmcweekend@gmail.com'}`}
                                            className="text-purple-100 hover:text-white transition-colors block"
                                        >
                                            {settings.contactInfo?.email || settings.socialLinks?.email || 'animation.fmcweekend@gmail.com'}
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                {settings.contactInfo?.phone && (
                                    <div className="flex items-start space-x-4">
                                        <Phone className="w-6 h-6 text-purple-200 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Phone</h3>
                                            <a 
                                                href={`tel:${settings.contactInfo.phone}`}
                                                className="text-purple-100 hover:text-white transition-colors block"
                                            >
                                                {settings.contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-purple-200 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Location</h3>
                                        <p className="text-purple-100">
                                            {settings.contactInfo?.address || 'Animation Lab, Room 201\nComputer Science Building\nCollege Campus'}
                                        </p>
                                    </div>
                                </div>

                                {/* Office Hours */}
                                <div className="flex items-start space-x-4">
                                    <Clock className="w-6 h-6 text-purple-200 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Office Hours</h3>
                                        <p className="text-purple-100">
                                            {settings.contactInfo?.officeHours || 'Mon - Fri: 10:00 AM - 6:00 PM\nSat: 12:00 PM - 4:00 PM\nSun: Closed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-purple-500">
                                <h3 className="font-semibold mb-3">Follow Us</h3>
                                <div className="flex flex-wrap gap-4">
                                    {settings.socialLinks?.facebook && (
                                        <a 
                                            href={settings.socialLinks.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-200 hover:text-white transition-colors"
                                        >
                                            Facebook
                                        </a>
                                    )}
                                    {settings.socialLinks?.instagram && (
                                        <a 
                                            href={settings.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-200 hover:text-white transition-colors"
                                        >
                                            Instagram
                                        </a>
                                    )}
                                    {settings.socialLinks?.youtube && (
                                        <a 
                                            href={settings.socialLinks.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-200 hover:text-white transition-colors"
                                        >
                                            YouTube
                                        </a>
                                    )}
                                    {settings.socialLinks?.twitter && (
                                        <a 
                                            href={settings.socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-200 hover:text-white transition-colors"
                                        >
                                            Twitter
                                        </a>
                                    )}
                                    {settings.socialLinks?.linkedin && (
                                        <a 
                                            href={settings.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-200 hover:text-white transition-colors"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                    {settings.socialLinks?.discord && (
                                        <a 
                                            href={settings.socialLinks.discord}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-200 hover:text-white transition-colors"
                                        >
                                            Discord
                                        </a>
                                    )}
                                    {!settings.socialLinks?.facebook && !settings.socialLinks?.instagram && !settings.socialLinks?.youtube && !settings.socialLinks?.twitter && !settings.socialLinks?.linkedin && !settings.socialLinks?.discord && (
                                        <p className="text-purple-200">Social media links coming soon!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                            {/* Success Message */}
                            {submitStatus === 'success' && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
                                    <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-green-800">Message Sent Successfully!</h3>
                                        <p className="text-green-700 mt-1">
                                            Thank you for contacting us. We'll get back to you within 24-48 hours.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {submitStatus === 'error' && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                                    <X className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-red-800">Failed to Send Message</h3>
                                        <p className="text-red-700 mt-1">
                                            Something went wrong. Please try again or contact us directly.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                            placeholder="Your full name"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                    >
                                        {categories.map(category => (
                                            <option key={category.value} value={category.value}>
                                                {category.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                                        placeholder="Brief description of your message"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                                        placeholder="Please provide details about your inquiry..."
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        {formData.message.length}/2000 characters
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full md:w-auto px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">How can I join the Animation Club?</h3>
                                <p className="text-gray-600">
                                    You can join by attending our weekly meetings or by contacting us through this form. 
                                    Membership is open to all students interested in animation, regardless of skill level.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Do I need prior experience in animation?</h3>
                                <p className="text-gray-600">
                                    Not at all! We welcome beginners and provide workshops and mentoring for members 
                                    at all skill levels. Our goal is to help everyone learn and grow.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">What software do you teach?</h3>
                                <p className="text-gray-600">
                                    We cover various animation software including Blender, After Effects, Maya, and more. 
                                    We also provide access to industry-standard tools and equipment.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">How often do you meet?</h3>
                                <p className="text-gray-600">
                                    We have regular weekly meetings on Fridays at 6 PM, plus additional workshops 
                                    and special events throughout the semester.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Current Leadership Section */}
                <div className="mt-16">
                    <LeadershipSection />
                </div>
            </div>
        </div>
    );
};

// Leadership Section Component
const LeadershipSection = () => {
    const { axios } = useAppContext();
    const [currentMembers, setCurrentMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeadership();
    }, []);

    const fetchLeadership = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/admin/members/public');
            if (response.data.success) {
                const allMembers = response.data.members;
                // Filter for current active leadership only
                const leadership = allMembers.filter(member => 
                    member.status === 'active' && 
                    member.membershipType === 'core' &&
                    ['secretary', 'joint-secretary'].includes(member.currentPosition?.role)
                );
                setCurrentMembers(leadership);
            }
        } catch (error) {
            console.error('Error fetching leadership:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleTitle = (role) => {
        const roleTitleMap = {
            'secretary': 'Secretary',
            'joint-secretary': 'Joint Secretary',
            'core-member': 'Core Team Member'
        };
        return roleTitleMap[role] || role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Leadership</h2>
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    if (currentMembers.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Leadership</h2>
                <p className="text-gray-600 text-center py-8">
                    Leadership information will be updated soon.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Current Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentMembers.map((member) => (
                    <div key={member._id} className="bg-gray-50 rounded-lg p-6 text-center hover:bg-gray-100 transition-colors">
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                            {member.profile?.profileImage ? (
                                <img 
                                    src={member.profile.profileImage} 
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                        <p className="text-purple-600 font-medium mb-2">
                            {getRoleTitle(member.currentPosition?.role)}
                        </p>
                        {member.email && (
                            <p className="text-sm text-gray-600 mb-2">{member.email}</p>
                        )}
                        {member.profile?.mobile && (
                            <p className="text-sm text-gray-600">{member.profile.mobile}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContactUs;
