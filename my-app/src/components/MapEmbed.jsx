import React from 'react';

export default function MapEmbed({ lat, lng, address }) {
  // CORRECTED URL: The format should be "?q=LAT,LNG"
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">Location on Map</h2>
      
      <div className="aspect-video w-full rounded-xl overflow-hidden border">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={address || 'Property Location'}
        ></iframe>
      </div>
    </div>
  );
}