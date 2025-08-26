import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, getReviewsForProperty } from '../api/properties.js';
import { createEnquiry } from '../api/enquiries.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Loader from '../components/Loader.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import { FiMapPin, FiHome, FiZap, FiMaximize } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import StarRating from '../components/StarRating.jsx';
import ReviewForm from '../components/ReviewForm.jsx';

// This is no longer needed for images, but might be used by other API calls.
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enquiryState, setEnquiryState] = useState({ loading: false, error: null, success: false });
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState([]);

  const fetchPropertyAndReviews = async () => {
    try {
      const propertyData = await getPropertyById(id);
      setProperty(propertyData);
      const reviewsData = await getReviewsForProperty(id);
      setReviews(reviewsData);
    } catch (err) {
      console.error("Failed to load property details or reviews:", err);
      setError("Failed to load property details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPropertyAndReviews();
  }, [id]);

  const handleReviewSubmitted = () => {
    fetchPropertyAndReviews();
  };

  const handleEnquiry = async () => {
    setEnquiryState({ loading: true, error: null, success: false });
    try {
      await createEnquiry(id);
      setEnquiryState({ loading: false, error: null, success: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send enquiry.';
      setEnquiryState({ loading: false, error: errorMessage, success: false });
    }
  };
  
  if (loading) return <Loader />;

  if (error) return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 text-red-600 text-xl">
      <p>{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">Go Back</button>
    </main>
  );

  if (!property) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <p className="text-gray-600 text-xl">Property not found.</p>
    </main>
  );
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 py-16 sm:py-20">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">{property.title}</h1>
          <p className="text-gray-600 text-lg sm:text-xl flex items-center mb-6">
            <FiMapPin className="mr-2 text-blue-500" /> {property.location}
          </p>
          
          <div className="mb-6">
            <StarRating rating={property.rating} text={`${property.numReviews} reviews`} />
          </div>

          {property.images && property.images.length > 0 ? (
            <div className="relative h-96 sm:h-[500px] mb-6 rounded-xl overflow-hidden shadow-lg">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation pagination={{ clickable: true }} loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="h-full w-full"
              >
                {property.images.map((imgFilename, index) => (
                  <SwiperSlide key={index}>
                    <img
                      // --- ✅ THIS IS THE FIX ---
                      // Use imgFilename directly, as it's already the full URL from your database
                      src={imgFilename}
                      alt={`${property.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/800x500/e2e8f0/4a5568?text=Image+Error'; }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="relative h-96 sm:h-[500px] mb-6 rounded-xl overflow-hidden shadow-lg bg-gray-200">
              <img src='https://placehold.co/800x500/e2e8f0/4a5568?text=No+Image' alt="No image available" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8">
            <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 flex items-center">
              <FaRupeeSign className="mr-2" /> {property.price}
            </p>
          </div>

          {user && !user.isAdmin && (
            <div className="mt-8 pt-8 border-t border-gray-200 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Interested in this property?</h3>
              {!enquiryState.success ? (
                <button
                  onClick={handleEnquiry}
                  disabled={enquiryState.loading}
                  className="inline-block px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {enquiryState.loading ? 'Sending...' : 'Send Enquiry'}
                </button>
              ) : (
                <p className="text-center text-green-600 font-semibold bg-green-50 p-4 rounded-lg border border-green-200">
                  ✔ Your enquiry has been sent successfully! Our team will contact you shortly.
                </p>
              )}
              {enquiryState.error && (
                <p className="text-center text-red-600 font-medium bg-red-50 p-3 rounded-lg border border-red-200 mt-4">
                  {enquiryState.error}
                </p>
              )}
            </div>
          )}
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">Key Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-lg">
            <div className="flex items-center"><FiHome className="mr-3 text-blue-500" /> <strong>Bedrooms:</strong><span className="ml-2">{property.bedrooms || 'N/A'}</span></div>
            <div className="flex items-center"><FiZap className="mr-3 text-blue-500" /> <strong>Bathrooms:</strong><span className="ml-2">{property.bathrooms || 'N/A'}</span></div>
            <div className="flex items-center"><FiMaximize className="mr-3 text-blue-500" /> <strong>Area:</strong><span className="ml-2">{property.area ? `${property.area} sq. ft.` : 'N/A'}</span></div>
          </div>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-4 inline-block">Description</h2>
          <p className="text-gray-800 leading-relaxed text-lg">
            {property.description || 'No description available.'}
          </p>
        </section>
        
        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-4 mb-8 inline-block">User Reviews</h2>
            {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet for this property.</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review._id} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center mb-2">
                                <strong className="mr-4 text-gray-800">{review.user?.fullname || 'Anonymous'}</strong>
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                            <p className="text-xs text-gray-500 mt-2">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
            {user && <ReviewForm propertyId={id} onReviewSubmitted={handleReviewSubmitted} />}
        </section>

        {property.locationCoords && property.locationCoords.lat && property.locationCoords.lng && (
          <MapEmbed 
            lat={property.locationCoords.lat} 
            lng={property.locationCoords.lng}
            address={property.location} 
          />
        )}
      </div>
    </main>
  );
}