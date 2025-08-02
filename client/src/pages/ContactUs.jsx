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
    const [submitStatus, setSubmitStatus] = useState(null);

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
        <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-2xl md:text-4xl font-bold text-emerald-400 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-sm md:text-base lg:text-xl text-[#d1d5db] max-w-2xl mx-auto">
                        Have questions about our club? Want to join us? We'd love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-emerald-800 to-teal-700 rounded-lg p-8 text-white h-full shadow-[0_0_30px_#10b98177]">
                            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start space-x-4">
                                    <Mail className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <a
                                            href={`mailto:${settings.contactInfo?.email || settings.socialLinks?.email || 'animation.fmcweekend@gmail.com'}`}
                                            className="text-gray-200 text-sm hover:text-white transition-colors block"
                                        >
                                            {settings.contactInfo?.email || settings.socialLinks?.email || 'animation.fmcweekend@gmail.com'}
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                {settings.contactInfo?.phone && (
                                    <div className="flex items-start space-x-4">
                                        <Phone className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold mb-1">Phone</h3>
                                            <a
                                                href={`tel:${settings.contactInfo.phone}`}
                                                className="text-gray-200 text-sm hover:text-white transition-colors block"
                                            >
                                                {settings.contactInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {/* Location */}
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Location</h3>
                                        <p className="text-gray-200 text-sm whitespace-pre-line">
                                            {settings.contactInfo?.address || 'Animation Lab, Room 201\nComputer Science Building\nCollege Campus'}
                                        </p>
                                    </div>
                                </div>

                                {/* Office Hours */}
                                <div className="flex items-start space-x-4">
                                    <Clock className="w-6 h-6 text-emerald-300 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold mb-1">Office Hours</h3>
                                        <p className="text-gray-200 text-sm whitespace-pre-line">
                                            {settings.contactInfo?.officeHours || 'Mon - Fri: 10:00 AM - 6:00 PM\nSat: 12:00 PM - 4:00 PM\nSun: Closed'}
                                        </p>
                                    </div>
                                </div>
                            </div>

<div className="mt-8 pt-6 border-t border-emerald-600">
  <h3 className="font-semibold text-emerald-300 mb-3">Follow Us</h3>
  <div className="flex items-center flex-wrap gap-4">
    {settings.socialLinks?.facebook && (
      <a
        href={settings.socialLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 12a10 10 0 10-11.5 9.87v-6.99H8v-2.88h2.5v-2.2c0-2.47 1.46-3.83 3.7-3.83 1.07 0 2.19.2 2.19.2v2.4h-1.24c-1.22 0-1.6.76-1.6 1.54v1.89h2.72l-.43 2.88h-2.29v6.99A10 10 0 0022 12z" />
        </svg>
      </a>
    )}

    {settings.socialLinks?.instagram && (
      <a
        href={settings.socialLinks.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.65 0 3 1.35 3 3v10c0 1.65-1.35 3-3 3H7c-1.65 0-3-1.35-3-3V7c0-1.65 1.35-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.1a1 1 0 110 2 1 1 0 010-2z" />
        </svg>
      </a>
    )}

    {settings.socialLinks?.youtube && (
      <a
        href={settings.socialLinks.youtube}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5 fill-current transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
        >
          <path d="M549.7 124.1c-6.3-23.7-24.9-42.3-48.5-48.6C456.6 64 288 64 288 64s-168.6 0-213.2 11.5c-23.6 6.3-42.2 24.9-48.5 48.6C16 168.7 16 256 16 256s0 87.3 10.3 131.9c6.3 23.7 24.9 42.3 48.5 48.6C119.4 448 288 448 288 448s168.6 0 213.2-11.5c23.6-6.3 42.2-24.9 48.5-48.6C560 343.3 560 256 560 256s0-87.3-10.3-131.9zM232 336V176l142.8 80L232 336z" />
        </svg>
      </a>
    )}

    {settings.socialLinks?.twitter && (
      <a
        href={settings.socialLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.27 4.27 0 001.88-2.35c-.83.5-1.75.86-2.73 1.05A4.24 4.24 0 0016.11 4c-2.35 0-4.26 1.91-4.26 4.26 0 .33.04.65.11.96-3.54-.18-6.68-1.87-8.78-4.45a4.27 4.27 0 00-.58 2.14c0 1.48.75 2.78 1.89 3.54-.7-.02-1.36-.22-1.94-.54v.05c0 2.06 1.47 3.78 3.42 4.17-.36.1-.74.16-1.13.16-.28 0-.55-.03-.82-.08.55 1.73 2.14 2.99 4.02 3.03a8.5 8.5 0 01-5.26 1.81c-.34 0-.67-.02-1-.06A12.03 12.03 0 008.29 21c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.3 8.3 0 0022.46 6z" />
        </svg>
      </a>
    )}

    {settings.socialLinks?.linkedin && (
      <a
        href={settings.socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5 fill-current transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M100.28 448H7.4V148.9h92.88zm-46.44-340C24.22 108 0 83.77 0 53.89 0 24.22 24.22 0 53.83 0c29.6 0 53.8 24.22 53.8 53.89 0 29.88-24.2 54.11-53.79 54.11zM447.9 448h-92.6V302.4c0-34.7-12.4-58.3-43.4-58.3-23.7 0-37.7 15.9-43.9 31.3-2.3 5.6-2.8 13.4-2.8 21.3V448h-92.6s1.2-261.5 0-288.1h92.6v40.8c12.3-19 34.4-46 83.7-46 61.1 0 106.9 39.8 106.9 125.3V448z"/>
        </svg>
      </a>
    )}

    {settings.socialLinks?.discord && (
      <a
        href={settings.socialLinks.discord}
        target="_blank"
        rel="noopener noreferrer"
        className="text-emerald-200 hover:text-white transition-colors"
      >
        <svg
          className="w-5 h-5 fill-current transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 25 30"
        >
          <path d="M23.6361 9.33998C22.212 8.71399 20.6892 8.25903 19.0973 8C18.9018 8.33209 18.6734 8.77875 18.5159 9.13408C16.8236 8.89498 15.1469 8.89498 13.4857 9.13408C13.3283 8.77875 13.0946 8.33209 12.8974 8C11.3037 8.25903 9.77927 8.71565 8.35518 9.3433C5.48276 13.4213 4.70409 17.3981 5.09342 21.3184C6.99856 22.6551 8.84487 23.467 10.66 23.9983C11.1082 23.4189 11.5079 22.8029 11.8523 22.1536C11.1964 21.9195 10.5683 21.6306 9.9748 21.2951C10.1323 21.1856 10.2863 21.071 10.4351 20.9531C14.0551 22.5438 17.9881 22.5438 21.5649 20.9531C21.7154 21.071 21.8694 21.1856 22.0251 21.2951C21.4299 21.6322 20.8 21.9211 20.1442 22.1553C20.4885 22.8029 20.8865 23.4205 21.3364 24C23.1533 23.4687 25.0013 22.6567 26.9065 21.3184C27.3633 16.7738 26.1261 12.8335 23.6361 9.33998ZM12.3454 18.9075C11.2587 18.9075 10.3676 17.9543 10.3676 16.7937C10.3676 15.6331 11.2397 14.6783 12.3454 14.6783C13.4511 14.6783 14.3422 15.6314 14.3232 16.7937C14.325 17.9543 13.4511 18.9075 12.3454 18.9075ZM19.6545 18.9075C18.5678 18.9075 17.6767 17.9543 17.6767 16.7937C17.6767 15.6331 18.5488 14.6783 19.6545 14.6783C20.7602 14.6783 21.6514 15.6314 21.6323 16.7937C21.6323 17.9543 20.7602 18.9075 19.6545 18.9075Z" />
        </svg>
      </a>
    )}
  </div>
</div>


                        </div>
                    </div>

{/* Contact Form */}
<div className="lg:col-span-2">
  <div className="bg-[#0d1515] rounded-lg shadow-[0_0_30px_#10b98155] p-8">
    <h2 className="text-2xl font-bold text-emerald-300 mb-6">Send us a Message</h2>

    {/* Success Message */}
    {submitStatus === 'success' && (
      <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-400 rounded-lg flex items-start space-x-3">
        <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-emerald-200">Message Sent Successfully!</h3>
          <p className="text-emerald-300 mt-1">
            Thank you for contacting us. We'll get back to you within 24-48 hours.
          </p>
        </div>
      </div>
    )}

    {/* Error Message */}
    {submitStatus === 'error' && (
      <div className="mb-6 p-4 bg-red-900/30 border border-red-400 rounded-lg flex items-start space-x-3">
        <X className="w-6 h-6 text-red-300 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-red-200">Failed to Send Message</h3>
          <p className="text-red-300 mt-1">
            Something went wrong. Please try again or contact us directly.
          </p>
        </div>
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-emerald-200 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-emerald-200 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-black/20 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-emerald-200 mb-2">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/20 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-emerald-200 mb-2">
          Subject *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/20 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          placeholder="Brief description of your message"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-emerald-200 mb-2">
          Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-black/20 border border-emerald-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors resize-none"
          placeholder="Please provide details about your inquiry..."
        />
        <p className="text-sm text-emerald-300 mt-1">
          {formData.message.length}/2000 characters
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-black font-semibold rounded-lg hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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
{/* FAQ Section */}
<div className="mt-16">
  <div className="bg-[#0d1515] rounded-lg shadow-[0_0_30px_#10b98155] p-8">
    <h2 className="text-2xl font-bold text-emerald-400 mb-6">Frequently Asked Questions</h2>

    <div className="space-y-6 text-gray-400">
      <div>
        <h3 className="font-semibold text-white mb-2">How can I join the Animation Club?</h3>
        <p className="lg:text-sm">
          You can join by attending our weekly meetings or by contacting us through this form.
          Membership is open to all students interested in animation, regardless of skill level.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-2">Do I need prior experience in animation?</h3>
        <p  className="lg:text-sm">
          Not at all! We welcome beginners and provide workshops and mentoring for members
          at all skill levels. Our goal is to help everyone learn and grow.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-2">What software do you teach?</h3>
        <p className="lg:text-sm">
          We cover various animation software including Blender, After Effects, Maya, and more.
          We also provide access to industry-standard tools and equipment.
        </p>
      </div>
      <div>
        <h3 className="font-semibold text-white mb-2">How often do you meet?</h3>
        <p className="lg:text-sm">
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
      scrollTo(0,0);
        fetchLeadership();
    }, []);

    const fetchLeadership = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/v1/users/members');
            if (response.data.success) {
                const allMembers = response.data.members;
                // Filter for current active leadership only
                const leadership_secy = allMembers.filter(member => 
                    member.status === 'active' && 
                    member.membershipType === 'core' &&
                    member.currentPosition?.role === 'secretary' 
                );
                const leadership_jointsecy = allMembers.filter(member => 
                    member.status === 'active' && 
                    member.membershipType === 'core' &&
                    member.currentPosition?.role === 'joint-secretary' 
                );
                const allLeadership = [...leadership_secy, ...leadership_jointsecy];
                setCurrentMembers(allLeadership);
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
        <div className="bg-[#0d1515] rounded-lg shadow-[0_0_30px_#10b98155] p-8">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6">Current Leadership</h2>
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            </div>
        </div>
    );
}

if (currentMembers.length === 0) {
    return (
        <div className="bg-[#0d1515] rounded-lg shadow-[0_0_30px_#10b98155] p-8">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6">Current Leadership</h2>
            <p className="text-emerald-100 text-center py-8">
                Leadership information will be updated soon.
            </p>
        </div>
    );
}

return (
    <div className="bg-[#0d1515] rounded-lg shadow-[0_0_30px_#10b98155] p-8">
        <h2 className="text-2xl font-bold text-emerald-400 mb-6 text-center">Current Leadership</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 justify-center text-xs md:text-[0.5rem] lg:text-[0.75rem] gap-6">
            {currentMembers.map((member) => (
                <div key={member._id} className="bg-emerald-900/10 md:w-50 lg:w-70 border border-emerald-600 rounded-lg p-6 text-center hover:bg-emerald-900/20 transition-colors">
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center overflow-hidden shadow-md">
                        {member.profile?.profileImage ? (
                            <img 
                                src={member.profile.profileImage} 
                                alt={member.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-10 h-10 text-black" />
                        )}
                    </div>
                    <h3 className="text-base font-bold text-emerald-400 mb-1">{member.name}</h3>
                    <p className="text-white font-medium text-sm capitalize mb-2">
                        {getRoleTitle(member.currentPosition?.role)}
                    </p>
                    {member.email && (
                        <p className="text-xs font-medium transition-colors text-gray-400">{member.email}</p>
                    )}
                    {member.profile?.mobile && (
                        <p className="text-xs font-medium transition-colors text-gray-400">{member.profile.mobile}</p>
                    )}
                </div>
            ))}
        </div>
    </div>
);
}

export default ContactUs;
