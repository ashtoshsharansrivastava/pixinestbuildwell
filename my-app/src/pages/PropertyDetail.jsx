import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, getReviewsForProperty } from '../api/properties.js';
import { createEnquiry } from '../api/enquiries.js';
import { useAuthStore } from '../store/useAuthStore.js';

// Swiper (Carousel)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Animations
import { motion } from 'framer-motion';

// Icons
import { FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { FaRupeeSign, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';

// Components
import Loader from '../components/Loader.jsx';
import MapEmbed from '../components/MapEmbed.jsx';
import StarRating from '../components/StarRating.jsx';
import ReviewForm from '../components/ReviewForm.jsx';

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Enquiry Logic
  const [enquiryState, setEnquiryState] = useState({ loading: false, error: null, success: false });
  const user = useAuthStore((s) => s.user);
  
  // Review Logic
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

  const handleEnquiryAction = async () => {
    // 1. Redirect to Login if user is not authenticated
    if (!user) {
      navigate('/login'); 
      return;
    }

    // 2. Send Enquiry API Call
    setEnquiryState({ loading: true, error: null, success: false });
    try {
      await createEnquiry(id);
      setEnquiryState({ loading: false, error: null, success: true });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send enquiry.';
      setEnquiryState({ loading: false, error: errorMessage, success: false });
    }
  };
  
  // Loading & Error States
  if (loading) return <Loader />;

  if (error) return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-16 text-red-600 text-xl">
      <p>{error}</p>
      <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-black transition">Go Back</button>
    </main>
  );

  if (!property) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <p className="text-gray-600 text-xl">Property not found.</p>
    </main>
  );
  
  // Animation Variants
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.main 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gray-50 text-gray-800 pb-20 pt-6"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- HEADER SECTION --- */}
        <motion.div variants={itemVariants} className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-gray-600">
              <span className="flex items-center bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-gray-200">
                <FiMapPin className="mr-2 text-orange-500" /> {property.location}
              </span>
              <div className="flex items-center bg-white px-3 py-1 rounded-full text-sm shadow-sm border border-gray-200">
                <StarRating rating={property.rating} /> 
                <span className="ml-2 text-gray-500">({property.numReviews} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-3xl font-extrabold text-orange-600 flex items-center bg-orange-50 px-4 py-2 rounded-lg border border-orange-100">
                <FaRupeeSign className="text-2xl mr-1" /> {property.price.toLocaleString('en-IN')}
             </div>
          </div>
        </motion.div>

        {/* --- IMAGE GALLERY --- */}
        <motion.div variants={itemVariants} className="relative h-[400px] md:h-[550px] mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
            {property.images && property.images.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation 
                pagination={{ clickable: true, dynamicBullets: true }} 
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                className="h-full w-full"
              >
                {property.images.map((imgFilename, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={imgFilename}
                      alt={`${property.title} - ${index + 1}`}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x800/e2e8f0/4a5568?text=Image+Error'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                 <span className="text-gray-400 font-medium">No Images Available</span>
              </div>
            )}
        </motion.div>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Key Features */}
            <motion.section variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Property Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-orange-50 rounded-xl border border-orange-100 text-center">
                  <FaBed className="text-3xl text-orange-500 mb-2" />
                  <span className="font-bold text-gray-900 text-lg">{property.bedrooms || '-'}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                  <FaBath className="text-3xl text-blue-500 mb-2" />
                  <span className="font-bold text-gray-900 text-lg">{property.bathrooms || '-'}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-100 text-center">
                  <FaRulerCombined className="text-3xl text-green-500 mb-2" />
                  <span className="font-bold text-gray-900 text-lg">{property.area || '-'}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Sq Ft</span>
                </div>
              </div>
            </motion.section>

            {/* Description */}
            <motion.section variants={itemVariants} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About this property</h3>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {property.description || 'No description available for this property.'}
              </p>
            </motion.section>

             {/* Location Map */}
             {property.locationCoords && property.locationCoords.lat && (
              <motion.section variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                   <MapEmbed 
                    lat={property.locationCoords.lat} 
                    lng={property.locationCoords.lng}
                    address={property.location} 
                  />
                </div>
              </motion.section>
            )}

            {/* Reviews */}
            <motion.section variants={itemVariants} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h3>
                   <span className="text-sm bg-gray-100 px-3 py-1 rounded-full text-gray-600">{reviews.length} total</span>
                </div>
                
                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {reviews.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                          <p className="text-gray-500">No reviews yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        reviews.map(review => (
                            <div key={review._id} className="bg-gray-50 p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                                        {(review.user?.fullname || 'A').charAt(0)}
                                      </div>
                                      <div>
                                        <strong className="block text-gray-900 text-sm">{review.user?.fullname || 'Anonymous'}</strong>
                                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>
                                {/* Fixed: changed non-standard ml-13 to ml-14 (3.5rem) */}
                                <p className="text-gray-700 mt-2 pl-14">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
                {user && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <ReviewForm propertyId={id} onReviewSubmitted={handleReviewSubmitted} />
                  </div>
                )}
            </motion.section>
          </div>

          {/* RIGHT COLUMN: Sticky Enquiry Sidebar */}
          <div className="lg:col-span-1">
             <motion.div 
               variants={itemVariants}
               className="sticky top-24 space-y-6"
             >
                {/* Enquiry Card */}
                {/* Logic: Show if user is NOT logged in OR if user is logged in but NOT an admin */}
                {(!user || (user && !user.isAdmin)) && (
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-600"></div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Interested?</h3>
                    <p className="text-gray-500 text-sm mb-6">Send an enquiry to the broker to get more details or schedule a visit.</p>

                    {!enquiryState.success ? (
                      <button
                        onClick={handleEnquiryAction}
                        disabled={enquiryState.loading}
                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-orange-500/30 transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                      >
                         {enquiryState.loading ? (
                           <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                           </>
                         ) : (
                           <>
                             Send Enquiry <FiCheckCircle />
                           </>
                         )}
                      </button>
                    ) : (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-center">
                         <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                           <FiCheckCircle size={24} />
                         </div>
                         <h4 className="font-bold text-green-800">Enquiry Sent!</h4>
                         <p className="text-green-700 text-sm mt-1">Our agent will contact you shortly.</p>
                      </div>
                    )}

                    {enquiryState.error && (
                      <div className="mt-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center">
                        {enquiryState.error}
                      </div>
                    )}
                    
                    <div className="mt-6 text-center">
                       <p className="text-xs text-gray-400">By sending an enquiry, you agree to our Terms of Service.</p>
                    </div>
                  </div>
                )}

                {/* Agent Placeholder */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">👷‍♂️</div>
                   <div>
                     <p className="text-sm text-gray-500 font-medium">Listed by</p>
                     <p className="text-gray-900 font-bold">PixieNest Agent</p>
                   </div>
                </div>

             </motion.div>
          </div>

        </div>
      </div>
    </motion.main>
  );
}