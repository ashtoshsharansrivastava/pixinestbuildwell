// File: frontend/src/components/ReviewForm.jsx
import React, { useState } from 'react';
import { addReviewForProperty } from '../api/properties'; // API function to submit the review
import StarRatingInput from './StarRatingInput'; // Import the separate star input component

const ReviewForm = ({ propertyId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }
    if (!comment.trim()) {
        setError('Please enter a comment.');
        return;
    }
    setLoading(true);
    setError('');
    try {
      // --- ✅ FIX: Changed createReview to the imported function addReviewForProperty ---
      await addReviewForProperty(propertyId, { rating, comment });
      
      // Notify the parent component that a new review was submitted so it can refresh the list
      onReviewSubmitted(); 
      
      // Reset the form
      setRating(0);
      setComment('');
    } catch (err) {
      // --- ✨ IMPROVEMENT: Log the actual error to the console for easier debugging ---
      console.error("Failed to submit review:", err); 
      setError(err.response?.data?.message || 'Failed to submit review. You may have already reviewed this property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Your Rating</label>
          <StarRatingInput rating={rating} setRating={setRating} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comment">
            Your Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            placeholder="Share your thoughts about this property..."
          />
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;