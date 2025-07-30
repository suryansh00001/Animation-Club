import React from 'react';

const SciFiBackground = () => {
  const commonStyle = "pointer-events-none rounded-full blur-md opacity-25";

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Crystal Glow */}
      <div
        className={`${commonStyle} bg-emerald-400 animate-[crystal-glow_6s_ease-in-out_infinite]`}
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '80px',
          height: '80px',
          filter: 'drop-shadow(0 0 25px rgba(110, 231, 183, 0.8))',
        }}
      />

      {/* Cube Spin */}
      <div
        className={`${commonStyle} bg-teal-300 animate-[cube-spin_10s_linear_infinite]`}
        style={{
          position: 'absolute',
          top: '30%',
          right: '10%',
          width: '60px',
          height: '60px',
          transformStyle: 'preserve-3d',
        }}
      />

      {/* Ring Pulse */}
      <div
        className="pointer-events-none border-4 border-emerald-400 rounded-full animate-[ring-pulse_5s_ease-in-out_infinite]"
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '20%',
          width: '100px',
          height: '100px',
          opacity: 0.1,
        }}
      />

      {/* Polyhedron Float */}
      <div
        className={`${commonStyle} bg-green-400 animate-[polyhedron-float_8s_ease-in-out_infinite]`}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '25%',
          width: '50px',
          height: '50px',
        }}
      />

      {/* Inner Diamond Spin */}
      <div
        className="pointer-events-none bg-teal-400 animate-[inner-diamond-spin_6s_linear_infinite]"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '40px',
          height: '40px',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          filter: 'drop-shadow(0 0 20px rgba(52, 211, 153, 0.6))',
        }}
      />
    </div>
  );
};

export default SciFiBackground;

