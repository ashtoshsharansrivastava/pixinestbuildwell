import React from 'react';
import PropertyCard from './PropertyCard.jsx';

// Removed the static data import to use live data from the API
export default function PropertyGrid({ properties }) {
  // Handle case where properties might not be loaded yet
  if (!properties || properties.length === 0) {
    return <p className="text-center text-gray-500 col-span-full">No properties found.</p>;
  }

  return (
    <section className="flex flex-wrap justify-center gap-8 sm:gap-10 lg:gap-12 max-w-full mx-auto px-4">
      {properties.map((prop) => (
        // Use the correct unique key, which is '_id' from MongoDB
        <PropertyCard key={prop._id} property={prop} />
      ))}
    </section>
  );
}
