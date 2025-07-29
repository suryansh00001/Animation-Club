import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/appContext';
import ScrollToTop from '../components/ScrollToTop';
import Tilt from 'react-parallax-tilt';

const Achievements = () => {
  const { fetchAchievements } = useAppContext();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    scrollTo(0,0);
  },[]);
  
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
    <div className="min-h-screen bg-[#0a0f0f] py-8 text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-400 border-t-transparent"></div>
        </div>
      </div>
    </div>
  );
}




 if (error) {
  return (
    <div className="min-h-screen bg-[#0a0f0f] py-8 text-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-emerald-300 mb-2">Error Loading Achievements</h3>
          <p className="text-emerald-200">{error}</p>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="relative bg-gradient-to-br from-[#0f0f0f] via-[#041d1b] to-[#0a1a17] font-orbitron text-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
           <h1 className="text-2xl sm:text-4xl font-bold text-emerald-400 mb-4">
             Our Achievements
           </h1>
           <p className="text-sm sm:text-lg text-[#d1d5db] max-w-2xl mx-auto">
             Celebrating our club's journey of excellence, innovation, and recognition in the world of animation.
           </p>

        </div>

        {/* Category Filter Box */}
        <div className="mb-12 px-4 sm:px-6">
          <div className="bg-[#0a1a1a] rounded-lg shadow-[0_0_20px_#10b98155] border border-emerald-600/30 p-6">
            <label className="block text-sm font-medium text-[#94a3b8] mb-2 text-center sm:text-left">
              Filter by Category
            </label>
            <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full appearance-none bg-[#0a1a1a] text-emerald-100 border border-emerald-600/40 rounded-md px-4 py-2 shadow-[0_0_12px_#10b98155] focus:outline-none focus:ring-2 focus:ring-[#10b981] transition"
        >
          
          {categories.map((category) => (
            <option key={category.id} value={category.id} className="bg-[#0a1a1a] text-emerald-100">
              {category.name}
            </option>
          ))}
        </select>

          </div>
        </div>



        {/* Empty State */}
        {achievements.length === 0 && (
              <div className="text-center py-12 text-emerald-200">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-emerald-300 mb-2">No achievements found</h3>
                <p>
                  {selectedCategory === 'all' 
                    ? 'No achievements available at the moment.' 
                    : `No achievements found in the ${categories.find(c => c.id === selectedCategory)?.name} category.`}
                </p>
              </div>
        )}

        {/* Timeline */}
        {achievements.length > 0 && (
          <div className="relative">


        {/* Vertical Line */}
        
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-1 h-full bg-emerald-800"></div>

            {/* Achievement Items */}
            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <div key={achievement._id} className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>


            {/* Dot centered on the line */}
            <div className="absolute left-[calc(1rem-0.35rem)] md:left-1/2 md:-translate-x-1/2 w-3.5 h-3.5 bg-emerald-800 rounded-full border-2 border-white shadow-md flex items-center justify-center z-10">
              <div className="w-1.5 aspect-square bg-white rounded-full"></div>
            </div>





                  {/* Content Card */}
                  <div className={`ml-16 md:ml-0 ${
                    index % 2 === 0 ? 'md:mr-8 md:ml-0' : 'md:ml-8 md:mr-0'
                  } w-full md:w-1/2`}>
                    <Tilt
                          tiltMaxAngleX={10}
                          tiltMaxAngleY={10}
                          glareEnable={true}
                          glareMaxOpacity={0.2}
                          glareColor="#10b981"
                          glarePosition="all"
                          scale={1.02}
                          transitionSpeed={2500}
                          className="rounded-lg"
                        >
                    <div className="bg-[#0a1a1a] rounded-lg shadow-[0_0_20px_#10b98133] overflow-hidden hover:shadow-[0_0_30px_#10b981aa] transition-shadow duration-300">
                      <img
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6 text-[0.6rem]">
                        {/* Date */}
                        <div className="sm:text-sm lg:text-base text-emerald-400 mb-2">
                          {new Date(achievement.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-xl font-bold text-white mb-3">
                          {achievement.title}
                        </h3>

                        {/* Description */}
                        <p className="sm:text-sm text-emerald-100 mb-4 leading-relaxed">
                          {achievement.description}
                        </p>

                        {/* Award Badge */}
                        {achievement.award && (
                          <div className="flex items-center mb-4">
                            <div className="flex items-center bg-yellow-300 text-black px-3 py-1 rounded-full text-sm font-semibold">
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
                            <span className="text-sm font-semibold text-emerald-300">Project: </span>
                            <span className="text-sm text-emerald-200">{achievement.project.title}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    </Tilt>
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
