import { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import { PlusIcon, MagnifyingGlassIcon, PhotoIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

const AdminGallery = () => {
    const { adminCreateGalleryImage, adminUpdateGalleryImage, adminDeleteGalleryImage, adminGetGalleryImages } = useAppContext();
    const [galleryImages, setGalleryImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        fetchGalleryImages();
    }, []);

    const fetchGalleryImages = async () => {
        try {
            setLoading(true);
            const images = await adminGetGalleryImages();
            setGalleryImages(images);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
            setError('Failed to load gallery images');
        } finally {
            setLoading(false);
        }
    };

    // Filter images based on search and status
    const filteredImages = galleryImages.filter(gallery => {
        const matchesSearch = gallery.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            gallery.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || gallery.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const handleDeleteImage = async (imageId) => {
        if (window.confirm('Are you sure you want to delete this gallery?')) {
            try {
                await adminDeleteGalleryImage(imageId);
                await fetchGalleryImages(); // Refresh the list
            } catch (error) {
                console.error('Error deleting gallery:', error);
                setError('Failed to delete gallery');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="sm:flex sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage gallery collections with multiple images
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="block rounded-md bg-purple-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                        <PlusIcon className="h-4 w-4 inline mr-2" />
                        Add Gallery
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="mt-8 bg-white shadow rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search galleries..."
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
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                        </select>
                    </div>

                    {/* Stats */}
                    <div className="text-sm text-gray-600">
                        Showing {filteredImages.length} of {galleryImages.length} galleries
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-12">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No galleries found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterStatus !== 'all' 
                                ? 'Try adjusting your search or filters.' 
                                : 'Get started by adding your first gallery.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                        {filteredImages.map((gallery) => (
                            <div key={gallery._id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-w-16 aspect-h-12">
                                    <img
                                        src={gallery.images && gallery.images.length > 0 ? gallery.images[0] : '/api/placeholder/400/300'}
                                        alt={gallery.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = '/api/placeholder/400/300';
                                        }}
                                    />
                                    {/* Multiple images indicator */}
                                    {gallery.images && gallery.images.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                                            +{gallery.images.length - 1}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setPreviewImage(gallery)}
                                            className="p-2 bg-white rounded-full text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setEditingImage(gallery)}
                                            className="p-2 bg-white rounded-full text-gray-600 hover:text-blue-600 transition-colors"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteImage(gallery._id)}
                                            className="p-2 bg-white rounded-full text-gray-600 hover:text-red-600 transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-gray-900 truncate">{gallery.title}</h3>
                                    {gallery.description && (
                                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{gallery.description}</p>
                                    )}
                                    
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(gallery.status)}`}>
                                            {gallery.status || 'pending'}
                                        </span>
                                        
                                        <span className="text-xs text-gray-400">
                                            {gallery.images ? gallery.images.length : 0} images
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Gallery Modal */}
            {(showCreateForm || editingImage) && (
                <GalleryFormModal
                    gallery={editingImage}
                    onClose={() => {
                        setShowCreateForm(false);
                        setEditingImage(null);
                    }}
                    onSuccess={fetchGalleryImages}
                />
            )}

            {/* Gallery Preview Modal */}
            {previewImage && (
                <GalleryPreviewModal
                    gallery={previewImage}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
};

// Gallery Form Modal Component
const GalleryFormModal = ({ gallery, onClose, onSuccess }) => {
    const { adminCreateGalleryImage, adminUpdateGalleryImage } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: gallery?.title || '',
        description: gallery?.description || '',
        images: gallery?.images?.join('\n') || '',
        status: gallery?.status || 'pending'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            
            const imageUrls = formData.images
                .split('\n')
                .map(url => url.trim())
                .filter(url => url);
            
            if (imageUrls.length === 0) {
                setError('At least one image URL is required');
                return;
            }
            
            const galleryData = {
                title: formData.title,
                description: formData.description,
                images: imageUrls,
                status: formData.status
            };
            
            if (gallery) {
                await adminUpdateGalleryImage(gallery._id, galleryData);
            } else {
                await adminCreateGalleryImage(galleryData);
            }
            
            if (onSuccess) {
                await onSuccess(); // Refresh gallery
            }
            onClose();
        } catch (error) {
            console.error('Error saving gallery:', error);
            setError('Failed to save gallery. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {gallery ? 'Edit Gallery' : 'Add New Gallery'}
                    </h3>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                            <div className="text-red-800 text-sm">{error}</div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Gallery title"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Gallery description"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URLs * (one per line)
                            </label>
                            <textarea
                                name="images"
                                value={formData.images}
                                onChange={handleChange}
                                rows={6}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter each image URL on a new line
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                            </select>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (gallery ? 'Update' : 'Add')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Gallery Preview Modal Component
const GalleryPreviewModal = ({ gallery, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    const nextImage = () => {
        if (gallery.images && gallery.images.length > 1) {
            setCurrentImageIndex((prev) => 
                prev < gallery.images.length - 1 ? prev + 1 : 0
            );
        }
    };
    
    const prevImage = () => {
        if (gallery.images && gallery.images.length > 1) {
            setCurrentImageIndex((prev) => 
                prev > 0 ? prev - 1 : gallery.images.length - 1
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-full">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {/* Navigation Arrows */}
                {gallery.images && gallery.images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
                        >
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
                
                <img
                    src={gallery.images && gallery.images.length > 0 ? gallery.images[currentImageIndex] : '/api/placeholder/400/300'}
                    alt={gallery.title}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                        e.target.src = '/api/placeholder/400/300';
                    }}
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4">
                    <h3 className="text-lg font-medium">{gallery.title}</h3>
                    {gallery.description && (
                        <p className="text-sm text-gray-300 mt-1">{gallery.description}</p>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                        <span>📊 {gallery.status}</span>
                        {gallery.images && gallery.images.length > 1 && (
                            <span>� {currentImageIndex + 1} / {gallery.images.length}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminGallery;
