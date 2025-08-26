import React, { useState } from 'react';
import { Star } from 'lucide-react';
import ReviewForm from './ReviewForm'; // Import the new form component

// Simulate a database save operation
const saveReviewToDatabase = async (review) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Review saved to database:', review);
      resolve({ ...review, id: Date.now() }); // Simulate adding a unique ID
    }, 1000);
  });
};

export default function ReviewCarousel({ initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleReviewSubmit = async (newReview) => {
    const savedReview = await saveReviewToDatabase(newReview);
    setReviews(prevReviews => [...prevReviews, savedReview]);
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Our Clients Say</h3>
        {reviews.length === 0 ? (
          <div className="text-center text-gray-600">
            No reviews available yet. Be the first!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="p-6 bg-blue-50 rounded-lg shadow-sm space-y-3 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-center mb-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" className="text-yellow-500" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star key={i + review.rating} size={20} className="text-gray-300" />
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{review.comment}"</p>
                <p className="text-right font-semibold text-gray-800">- {review.author}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <ReviewForm onReviewSubmit={handleReviewSubmit} />
    </div>
  );
}