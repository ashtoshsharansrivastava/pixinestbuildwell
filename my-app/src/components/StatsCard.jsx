import React from 'react';

export default function StatsCard({ label, value }) {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md text-center border border-gray-100 transition-all duration-300 hover:shadow-lg">
      <p className="text-sm sm:text-base text-gray-500 mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 leading-tight">{value}</p>
    </div>
  );
}
