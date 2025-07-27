import React, { useEffect, useRef } from 'react';

const GlowingCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${x}px`;
        cursorRef.current.style.top = `${y}px`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-18 h-18 bg-emerald-400 rounded-full pointer-events-none z-50 
           blur-xl opacity-50 mix-blend-screen transition-transform duration-300"
      style={{
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.7), 0 0 40px rgba(52, 211, 153, 0.4)',
      }}
    />
  );
};

export default GlowingCursor;
