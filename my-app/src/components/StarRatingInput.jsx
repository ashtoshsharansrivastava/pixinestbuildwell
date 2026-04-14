// File: frontend/src/components/StarRatingInput.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';

const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <FaStar
              className="cursor-pointer"
              color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
              size={30}
            />
          </label>
        );
      })}
    </div>
  );
};

export default StarRatingInput;