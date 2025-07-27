import React, { useRef, useEffect } from 'react';

const TiltText = ({ children }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 5;
      const y = (e.clientY / innerHeight - 0.5) * 5;

      if (ref.current) {
        ref.current.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <span
      ref={ref}
      className="logo-text inline-block transition-transform duration-300 ease-out 
                 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-teal-300
                 drop-shadow-[0_1px_1px_rgba(0,255,128,0.2)]"
    >
      {children}
    </span>
  );
};

export default TiltText;
