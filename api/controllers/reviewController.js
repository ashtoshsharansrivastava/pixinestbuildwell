// backend/controllers/reviewController.js
import Review from '../models/Review.js';
import Property from '../models/Property.js';

// @desc    Get all reviews for a property
// @route   GET /api/properties/:id/reviews
// @access  Public
export const getReviewsForProperty = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.id })
      .populate("user", "fullname email role");

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
};

// @desc    Add a review to a property
// @route   POST /api/properties/:id/reviews
// @access  Private (user or broker)
export const addReviewForProperty = async (req, res) => {
  const { rating, comment } = req.body;
  const propertyId = req.params.id;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // ✅ Multiple reviews allowed — no duplicate check
    const review = new Review({
      rating: Number(rating),
      comment,
      user: req.user._id,
      property: propertyId,
    });

    await review.save();

    // ✅ Recalculate property stats
    const reviews = await Review.find({ property: propertyId });
    property.numReviews = reviews.length;
    property.rating =
      reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

    await property.save();

    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error adding review" });
  }
};
