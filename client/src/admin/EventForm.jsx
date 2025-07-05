import React, { useState, useEffect } from 'react';
import { useAdminContext } from '../context/adminContext';

const EventForm = ({ event, onClose }) => {
  const { updateEvent, createEvent, loading } = useAdminContext();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    deadline: '', // registration deadline
    submissionDeadline: '',
    location: '',
    venue: '',
    type: 'workshop',
    status: 'upcoming',
    requirements: ['', '', ''],
    prizes: ['', '', ''],
    organizer: '',
    image: '',
    instructor: '',
    duration: '',
    price: 0,
    registrationRequired: false,  
    submissionRequired: false,     
  });

  const [errors, setErrors] = useState({});

  // Populate form with event data when editing
  useEffect(() => {
    if (event) {
      // Helper function to convert ISO date to YYYY-MM-DD format
      const formatDateForInput = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toISOString().split('T')[0];
      };

      // Helper function to extract simple strings from MongoDB arrays
      const extractRequirements = (requirements) => {
        if (!requirements || !Array.isArray(requirements)) return ['', '', ''];
        const strings = requirements.slice(0, 3);
        while (strings.length < 3) strings.push('');
        return strings;
      };

      const extractPrizes = (prizes) => {
        if (!prizes || !Array.isArray(prizes)) return ['', '', ''];
        const prizeStrings = prizes
          .slice(0, 3)
          .map(prize => `${prize.position}: ${prize.prize}`);
        while (prizeStrings.length < 3) prizeStrings.push('');
        return prizeStrings;
      };

      const extractWinners = (results) => {
        if (!results || !results.winners || !Array.isArray(results.winners)) return ['', '', ''];
        const winnerStrings = results.winners
          .sort((a, b) => a.rank - b.rank)
          .slice(0, 3)
          .map(winner => winner.participant || winner.name || '');
        while (winnerStrings.length < 3) winnerStrings.push('');
        return winnerStrings;
      };

      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: formatDateForInput(event.date),
        endDate: formatDateForInput(event.endDate),
        deadline: formatDateForInput(event.deadline),
        submissionDeadline: formatDateForInput(event.submissionDeadline),
        status: event.status || 'upcoming',
        type: event.type || 'workshop',
        registrationRequired: event.registrationRequired || false,
        submissionRequired: event.submissionRequired || false,
        image: event.image || '',
        instructor: event.instructors?.[0]?.name || event.instructor || '',
        duration: event.duration || '',
        prizes: extractPrizes(event.prizes),
        requirements: extractRequirements(event.requirements),
        winners: extractWinners(event.results),
        location: event.location || '',
        venue: event.venue || '',
        organizer: event.organizer || '',
        price: event.price || 0
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // If submissionRequired is being set to true, automatically enable registrationRequired
      if (name === 'submissionRequired' && checked) {
        newData.registrationRequired = true;
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.deadline && formData.registrationRequired) {
      newErrors.deadline = 'Registration deadline is required when registration is required';
    }

    // Compare dates properly
    if (formData.deadline && formData.date) {
      const deadlineDate = new Date(formData.deadline);
      const eventDate = new Date(formData.date);
      
      if (deadlineDate >= eventDate) {
        newErrors.deadline = 'Deadline must be before event date';
      }
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    }

    // Validate URL format
    if (formData.image.trim()) {
      try {
        new URL(formData.image);
      } catch {
        newErrors.image = 'Please enter a valid URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Helper function to convert date to ISO format
      const formatDateForMongoDB = (dateString) => {
        if (!dateString) return null;
        return new Date(dateString).toISOString();
      };

      // Helper function to convert prizes array to MongoDB format
      const formatPrizesForMongoDB = (prizesArray) => {
        return prizesArray
          .filter(prize => prize.trim())
          .map((p) => {
            const [position, prize] = p.split(':').map(s => s.trim());
            return {
              position: position || 'Position',
              prize: prize || 'Prize'
            };
          });
      };

      // Helper function to format winners for MongoDB
      const formatWinnersForMongoDB = (winnersArray) => {
        const winners = winnersArray
          .filter(winner => winner.trim())
          .map((winner, index) => ({
            rank: index + 1,
            participant: winner,
            userId: null, // Will be set by backend
            submissionId: null, // Will be set by backend
            title: '',
            prize: `${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'} Place`
          }));

        return winners.length > 0 ? {
          winners,
          totalSubmissions: 0, // Will be set by backend
          judgedBy: [],
          judgingCriteria: []
        } : null;
      };

      // Clean up and format data for MongoDB
      const cleanedData = {
        title: formData.title,
        description: formData.description,
        date: formatDateForMongoDB(formData.date),
        endDate: formatDateForMongoDB(formData.endDate),
        location: formData.location,
        venue: formData.venue,
        type: formData.type,
        status: formData.status,
        registrationDeadline: formData.registrationRequired ? formatDateForMongoDB(formData.deadline) : undefined,
        registrationRequired: formData.registrationRequired,
        submissionDeadline: formData.submissionRequired ? formatDateForMongoDB(formData.submissionDeadline) : undefined,
        submissionRequired: formData.submissionRequired,
        requirements: formData.requirements.filter(req => req.trim()),
        prizes: formatPrizesForMongoDB(formData.prizes),
        organizer: formData.organizer,
        instructors: formData.instructor ? [{
          name: formData.instructor,
          bio: '',
          image: ''
        }] : [],
        image: formData.image,
        price: Number(formData.price) || 0,
        isActive: true
      };
      
      // Only add submission/results data for completed events
      if (formData.status === 'completed') {
        cleanedData.results = formatWinnersForMongoDB(formData.winners);
      }
      
      // Remove undefined values
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === undefined) {
          delete cleanedData[key];
        }
      });

      if (event) {
        await updateEvent(event._id, cleanedData);
      } else {
        await createEvent(cleanedData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(75,85,99,0.5)] overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {event ? 'Edit Event' : 'Create New Event'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter event title"
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter event description"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {formData.registrationRequired && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Deadline *
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        errors.deadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.deadline && <p className="text-red-500 text-xs mt-1">{errors.deadline}</p>}
                  </div>
                )}

                {formData.submissionRequired && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submission Deadline
                    </label>
                    <input
                      type="date"
                      name="submissionDeadline"
                      value={formData.submissionDeadline}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="seminar">Seminar</option>
                    <option value="exhibition">Exhibition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter event location"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter event venue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter organizer name"
                  />
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Event Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                      errors.image ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructor (for workshops)
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="Enter instructor name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="e.g., 3 days, 2 hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave as 0 for free events</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="registrationRequired"
                    checked={formData.registrationRequired}
                    onChange={handleChange}
                    disabled={formData.submissionRequired}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Registration Required
                    {formData.submissionRequired && (
                      <span className="text-xs text-gray-500 block">
                        (Automatically enabled for submission events)
                      </span>
                    )}
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="submissionRequired"
                    checked={formData.submissionRequired}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Submission Required
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h4>
              
              {/* Prizes (for competitions) */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prizes (for competitions)
                  <span className="text-xs text-gray-500 block">Format: Position: Prize (e.g., "1st Place: Gold Medal")</span>
                </label>
                {formData.prizes.map((prize, index) => (
                  <input
                    key={index}
                    type="text"
                    value={prize}
                    onChange={(e) => handleArrayChange('prizes', index, e.target.value)}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder={`${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'} Place: Prize Name`}
                  />
                ))}
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                {formData.requirements.map((requirement, index) => (
                  <input
                    key={index}
                    type="text"
                    value={requirement}
                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                    placeholder={`Requirement ${index + 1}`}
                  />
                ))}
              </div>

              {/* Winners (for completed events) */}
              {formData.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Winners
                  </label>
                  {formData.winners.map((winner, index) => (
                    <input
                      key={index}
                      type="text"
                      value={winner}
                      onChange={(e) => handleArrayChange('winners', index, e.target.value)}
                      className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder={`${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : 'rd'} Place Winner`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
