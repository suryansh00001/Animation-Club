import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';

const Achievements = () => {
  const { fetchAchievements } = useAppContext();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadAchievements();
  }, [selectedCategory]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const filters = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const achievementsData = await fetchAchievements(filters);
      setAchievements(achievementsData || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to load achievements');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'award', name: 'Awards' },
    { id: 'recognition', name: 'Recognition' },
    { id: 'competition', name: 'Competition' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    );
  }



  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Achievements</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Achievements
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Celebrating our club's journey of excellence, innovation, and recognition in the world of animation.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 shadow-md'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {achievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all' 
                ? 'No achievements available at the moment.' 
                : `No achievements found in the ${categories.find(c => c.id === selectedCategory)?.name} category.`}
            </p>
          </div>
        )}

        {/* Timeline */}
        {achievements.length > 0 && (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-purple-200"></div>

            {/* Achievement Items */}
            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <div key={achievement._id} className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-purple-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>

                  {/* Content Card */}
                  <div className={`ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-8 md:ml-0' : 'md:ml-8 md:mr-0'
                  } w-full md:w-1/2`}>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        {/* Date */}
                        <div className="text-sm text-purple-600 font-semibold mb-2">
                          {new Date(achievement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-800 mb-3">
                          {achievement.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {achievement.description}
                        </p>

                        {/* Award Badge */}
                        {achievement.award && (
                          <div className="flex items-center mb-4">
                            <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {achievement.award}
                            </div>
                          </div>
                        )}

                        {/* Project Details */}
                        {achievement.project && (
                          <div className="mb-4">
                            <span className="text-sm font-semibold text-gray-700">Project: </span>
                            <span className="text-sm text-gray-600">{achievement.project.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Achievements;
