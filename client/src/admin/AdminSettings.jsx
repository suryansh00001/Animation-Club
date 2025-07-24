import { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { CogIcon, GlobeAltIcon, PhoneIcon, EnvelopeIcon, PhotoIcon } from '@heroicons/react/24/outline';

const AdminSettings = () => {
    const { fetchSettings, updateSettings} = useAppContext();
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        site: {
            name: '',
            description: '',
            contactEmail: '',
            contactPhone: '',
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            }
        },
        socialMedia: {
            instagram: '',
            youtube: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            discord: '',
            tiktok: ''
        },
        email: {
            smtpHost: '',
            smtpPort: '',
            smtpUser: '',
            smtpPass: '',
            fromEmail: '',
            fromName: ''
        }
    });

    const tabs = [
        { id: 'general', name: 'General', icon: CogIcon },
        { id: 'social', name: 'Social Media', icon: GlobeAltIcon },
        { id: 'contact', name: 'Contact & Address', icon: PhoneIcon },
        { id: 'email', name: 'Email Settings', icon: EnvelopeIcon },
        { id: 'branding', name: 'Logo & Branding', icon: PhotoIcon }
    ];

    // Load settings on component mount
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setLoading(true);
            const settingsData = await fetchSettings();
            setSettings(settingsData);
            setFormData({
                site: {
                    name: settingsData?.site?.name || '',
                    description: settingsData?.site?.description || '',
                    contactEmail: settingsData?.site?.contactEmail || '',
                    contactPhone: settingsData?.site?.contactPhone || '',
                    address: {
                        street: settingsData?.site?.address?.street || '',
                        city: settingsData?.site?.address?.city || '',
                        state: settingsData?.site?.address?.state || '',
                        zipCode: settingsData?.site?.address?.zipCode || '',
                        country: settingsData?.site?.address?.country || ''
                    }
                },
                socialMedia: {
                    instagram: settingsData?.socialMedia?.instagram || '',
                    youtube: settingsData?.socialMedia?.youtube || '',
                    twitter: settingsData?.socialMedia?.twitter || '',
                    facebook: settingsData?.socialMedia?.facebook || '',
                    linkedin: settingsData?.socialMedia?.linkedin || '',
                    discord: settingsData?.socialMedia?.discord || '',
                    tiktok: settingsData?.socialMedia?.tiktok || ''
                },
                email: {
                    smtpHost: settingsData?.email?.smtpHost || '',
                    smtpPort: settingsData?.email?.smtpPort || '',
                    smtpUser: settingsData?.email?.smtpUser || '',
                    smtpPass: settingsData?.email?.smtpPass || '',
                    fromEmail: settingsData?.email?.fromEmail || '',
                    fromName: settingsData?.email?.fromName || ''
                }
            });
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const parts = name.split('.');
            setFormData(prev => {
                const newData = { ...prev };
                let current = newData;
                
                for (let i = 0; i < parts.length - 1; i++) {
                    if (!current[parts[i]]) current[parts[i]] = {};
                    current = current[parts[i]];
                }
                
                current[parts[parts.length - 1]] = value;
                return newData;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedSettings = await updateSettings(formData);
            setSettings(updatedSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage club settings and configuration
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg overflow-hidden mb-6">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6" aria-label="Tabs">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                                        activeTab === tab.id
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'general' && (
                        <GeneralSettings
                            formData={formData}
                            onChange={handleInputChange}
                        />
                    )}
                    
                    {activeTab === 'social' && (
                        <SocialMediaSettings
                            formData={formData}
                            onChange={handleInputChange}
                        />
                    )}
                    
                    {activeTab === 'contact' && (
                        <ContactSettings
                            formData={formData}
                            onChange={handleInputChange}
                        />
                    )}
                    
                    {activeTab === 'email' && (
                        <EmailSettings
                            formData={formData}
                            onChange={handleInputChange}
                        />
                    )}
                    
                    {activeTab === 'branding' && (
                        <BrandingSettings
                            settings={settings}
                            onSettingsUpdate={loadSettings}
                            updateSettings={updateSettings}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// General Settings Component
const GeneralSettings = ({ formData, onChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">General Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Site Name
                        </label>
                        <input
                            type="text"
                            name="site.name"
                            value={formData.site.name}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Animation Club"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            name="site.contactEmail"
                            value={formData.site.contactEmail}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="animation.fmcweekend@gmail.com"
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                    </label>
                    <textarea
                        name="site.description"
                        value={formData.site.description}
                        onChange={onChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Brief description of the Animation Club..."
                    />
                </div>
            </div>
        </div>
    );
};

// Social Media Settings Component
const SocialMediaSettings = ({ formData, onChange }) => {
    const socialPlatforms = [
        { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/animationclub' },
        { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/animationclub' },
        { key: 'twitter', label: 'Twitter', placeholder: 'https://twitter.com/animationclub' },
        { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/animationclub' },
        { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/animationclub' },
        { key: 'discord', label: 'Discord', placeholder: 'https://discord.gg/animationclub' },
        { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@animationclub' }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Links</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Add your club's social media profile links. These will be displayed on the website.
                </p>
                
                <div className="space-y-4">
                    {socialPlatforms.map((platform) => (
                        <div key={platform.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {platform.label}
                            </label>
                            <input
                                type="url"
                                name={`socialMedia.${platform.key}`}
                                value={formData.socialMedia[platform.key]}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder={platform.placeholder}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Contact Settings Component
const ContactSettings = ({ formData, onChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="site.contactPhone"
                            value={formData.site.contactPhone}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="+1 (555) 123-4567"
                        />
                    </div>
                </div>
                
                <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street Address
                            </label>
                            <input
                                type="text"
                                name="site.address.street"
                                value={formData.site.address.street}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="123 Main Street"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="site.address.city"
                                value={formData.site.address.city}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Anytown"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                            </label>
                            <input
                                type="text"
                                name="site.address.state"
                                value={formData.site.address.state}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="CA"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                ZIP Code
                            </label>
                            <input
                                type="text"
                                name="site.address.zipCode"
                                value={formData.site.address.zipCode}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="12345"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                name="site.address.country"
                                value={formData.site.address.country}
                                onChange={onChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="United States"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Email Settings Component
const EmailSettings = ({ formData, onChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Configuration</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Configure SMTP settings for sending emails from the system.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Host
                        </label>
                        <input
                            type="text"
                            name="email.smtpHost"
                            value={formData.email.smtpHost}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="smtp.gmail.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Port
                        </label>
                        <input
                            type="number"
                            name="email.smtpPort"
                            value={formData.email.smtpPort}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="587"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Username
                        </label>
                        <input
                            type="text"
                            name="email.smtpUser"
                            value={formData.email.smtpUser}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="user@gmail.com"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            SMTP Password
                        </label>
                        <input
                            type="password"
                            name="email.smtpPass"
                            value={formData.email.smtpPass}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Email
                        </label>
                        <input
                            type="email"
                            name="email.fromEmail"
                            value={formData.email.fromEmail}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="noreply@animationclub.edu"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Name
                        </label>
                        <input
                            type="text"
                            name="email.fromName"
                            value={formData.email.fromName}
                            onChange={onChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Animation Club"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
// Branding Settings Component with Logo/Favicon Upload
const BrandingSettings = ({ settings, onSettingsUpdate, updateSettings }) => {
    const [logoUrl, setLogoUrl] = useState('');
    const [faviconUrl, setFaviconUrl] = useState('');
    const [loading, setLoading] = useState(false);

    // Update local state when settings change
    useEffect(() => {
        setLogoUrl(settings?.site?.logo?.url || '');
        setFaviconUrl(settings?.site?.favicon?.url || '');
    }, [settings]);

    const handleLogoSave = async () => {
        try {
            setLoading(true);
            const updatedSettings = {
                site: {
                    ...settings?.site,
                    logo: {
                        url: logoUrl
                    }
                }
            };
            await updateSettings(updatedSettings);
            await onSettingsUpdate(); // Refresh settings
        } catch (error) {
            console.error('Logo save error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFaviconSave = async () => {
        try {
            setLoading(true);
            const updatedSettings = {
                site: {
                    ...settings?.site,
                    favicon: {
                        url: faviconUrl
                    }
                }
            };
            await updateSettings(updatedSettings);
            await onSettingsUpdate(); // Refresh settings
        } catch (error) {
            console.error('Favicon save error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoClear = async () => {
        try {
            setLoading(true);
            setLogoUrl('');
            const updatedSettings = {
                site: {
                    ...settings?.site,
                    logo: {
                        url: ''
                    }
                }
            };
            await updateSettings(updatedSettings);
            await onSettingsUpdate(); // Refresh settings
        } catch (error) {
            console.error('Logo clear error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFaviconClear = async () => {
        try {
            setLoading(true);
            setFaviconUrl('');
            const updatedSettings = {
                site: {
                    ...settings?.site,
                    favicon: {
                        url: ''
                    }
                }
            };
            await updateSettings(updatedSettings);
            await onSettingsUpdate(); // Refresh settings
        } catch (error) {
            console.error('Favicon clear error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Logo & Branding</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Add your club's logo and favicon by providing image URLs. Use reliable image hosting services.
                </p>
                
                {/* Logo Settings */}
                <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Logo</h4>
                    <div className="flex items-start space-x-6">
                        {/* Logo Preview */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                {logoUrl ? (
                                    <img 
                                        src={logoUrl} 
                                        alt="Logo Preview" 
                                        className="w-full h-full object-contain rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                ) : null}
                                {!logoUrl && (
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <span className="mt-2 block text-sm font-medium text-gray-600">No logo</span>
                                    </div>
                                )}
                                {logoUrl && (
                                    <div className="text-center" style={{ display: 'none' }}>
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <span className="mt-2 block text-sm font-medium text-gray-600">Invalid URL</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Logo URL Input */}
                        <div className="flex-1">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Logo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>
                                
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleLogoSave}
                                        disabled={loading}
                                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Logo'}
                                    </button>
                                    
                                    {logoUrl && (
                                        <button
                                            onClick={handleLogoClear}
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                                        >
                                            Clear Logo
                                        </button>
                                    )}
                                </div>
                                
                                <p className="text-xs text-gray-500">
                                    Use a publicly accessible image URL. Recommended: PNG or JPG, minimum 200x200px
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Favicon Settings */}
                <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4">Favicon</h4>
                    <div className="flex items-start space-x-6">
                        {/* Favicon Preview */}
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                                {faviconUrl ? (
                                    <img 
                                        src={faviconUrl} 
                                        alt="Favicon Preview" 
                                        className="w-full h-full object-contain rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'block';
                                        }}
                                    />
                                ) : null}
                                {!faviconUrl && (
                                    <div className="text-center">
                                        <PhotoIcon className="mx-auto h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                                {faviconUrl && (
                                    <div className="text-center" style={{ display: 'none' }}>
                                        <PhotoIcon className="mx-auto h-6 w-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Favicon URL Input */}
                        <div className="flex-1">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Favicon URL
                                    </label>
                                    <input
                                        type="url"
                                        value={faviconUrl}
                                        onChange={(e) => setFaviconUrl(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="https://example.com/favicon.ico"
                                    />
                                </div>
                                
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleFaviconSave}
                                        disabled={loading}
                                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Favicon'}
                                    </button>
                                    
                                    {faviconUrl && (
                                        <button
                                            onClick={handleFaviconClear}
                                            disabled={loading}
                                            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                                        >
                                            Clear Favicon
                                        </button>
                                    )}
                                </div>
                                
                                <p className="text-xs text-gray-500">
                                    Use a publicly accessible image URL. Recommended: ICO, PNG, or JPG, 32x32px or 16x16px
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
