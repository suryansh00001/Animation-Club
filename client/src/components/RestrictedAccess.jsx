import React from 'react';

const RestrictedAccess = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Restricted Access</h2>
    <p className="text-lg text-gray-700">You do not have permission to view this page.</p>
  </div>
);


export default RestrictedAccess;

