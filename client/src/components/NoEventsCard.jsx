import React, { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

const NoEventsCard = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 15,
        speed: 400,
        glare: true,
        'max-glare': 0.3,
      });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative bg-white/10 backdrop-blur-md rounded-xl border border-emerald-400/30 
                 shadow-[0_0_30px_rgba(0,255,200,0.1)] p-6 text-center text-white 
                 hover:shadow-emerald-400/40 transition-transform duration-500"
    >
      <div className="text-6xl mb-4">🚀</div>

      <h3 className="text-2xl font-bold mb-2 text-emerald-300">
        No Upcoming Events
      </h3>

      <p className="text-emerald-100/80">
        Stay tuned. Something exciting is about to launch!
      </p>

      {/* Inner Glow Gradient Overlay */}
      <div
        className="absolute -inset-1 rounded-xl pointer-events-none 
                   bg-gradient-to-br from-emerald-400/10 via-purple-400/10 to-pink-400/10 
                   blur-2xl opacity-30 z-[-1]"
      ></div>
    </div>
  );
};

export default NoEventsCard;
