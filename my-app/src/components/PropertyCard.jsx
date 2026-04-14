import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiMapPin, FiTag, FiSquare, FiHome, FiZap, FiChevronLeft } from 'react-icons/fi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const BACKEND_URL = import.meta.env.VITE_BASE_URL || 'https://pixinestbuildwell-1.onrender.com';

export default function PropertyCard({ property }) {
  const {
    _id,
    title,
    locality,
    city,
    price,
    area = 0,
    bedrooms = 0,
    bathrooms = 0,
    images = [],
    propertyType,
  } = property;

  return (
    <Link
      to={`/properties/${_id}`}
      className="relative block w-80 sm:w-80 md:w-96 lg:w-80 xl:w-96 rounded-xl overflow-hidden shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl group"
    >
      <div className="relative h-48 bg-gray-200">
        {images.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            loop
            navigation={{
              nextEl: `.swiper-button-next-${_id}`,
              prevEl: `.swiper-button-prev-${_id}`,
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            className="h-full w-full"
          >
            {images.map((imgFilename, index) => (
              <SwiperSlide key={`${_id}-${index}`}>
                <img
                  // --- ✅ THIS IS THE FIX ---
                  // Use imgFilename directly as it's already a full URL
                  src={imgFilename}
                  alt={`${title} - ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/e2e8f0/4a5568?text=Image+Error'; }}
                />
              </SwiperSlide>
            ))}
            <div className={`swiper-button-prev swiper-button-prev-${_id} absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer`}>
                <FiChevronLeft size={20} />
            </div>
            <div className={`swiper-button-next swiper-button-next-${_id} absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer`}>
                <FiChevronRight size={20} />
            </div>
          </Swiper>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
             <img src='https://placehold.co/600x400/e2e8f0/4a5568?text=No+Image' alt="No image available" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div className="bg-white p-5 space-y-2">
        <h3 className="font-extrabold text-xl text-gray-900 truncate" title={title}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 flex items-center">
          <FiMapPin className="mr-1 text-blue-500" /> {locality}, {city}
        </p>
        <p className="text-md text-gray-700 flex items-center font-semibold">
          <FiTag className="mr-1 text-green-500" /> {price || 'N/A'}
        </p>
        {propertyType && (
          <p className="text-sm text-gray-600 flex items-center">
            <FiSquare className="mr-1 text-purple-500" /> {propertyType} • {area} sqft
          </p>
        )}
         <div className="flex items-center justify-between text-gray-700 border-t pt-3 text-sm">
            <span className="flex items-center gap-2"><FiHome size={18} /> {bedrooms} Beds</span>
            <span className="flex items-center gap-2"><FiZap size={18} /> {bathrooms} Baths</span>
          </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-blue-600 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
        <FiChevronRight className="w-6 h-6" />
      </div>
    </Link>
  );
}