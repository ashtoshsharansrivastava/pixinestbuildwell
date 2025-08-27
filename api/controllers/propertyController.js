// backend/controllers/propertyController.js
import Property from "../models/Property.js";
import Review from "../models/Review.js";
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({}).populate("agent", "fullName email");
  res.json(properties);
});

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "agent",
    "fullName email"
  );
  if (property) {
    res.json(property);
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
});

// ✅ FIX: Safe parsing function to prevent NaN and undefined errors
const safeParseNumber = (value, defaultValue = null) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};


// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = asyncHandler(async (req, res) => {
  const {
    title, description, propertyType, price, units, bedrooms, bathrooms,
    furnishing, possession, builtYear, locality, city, videoUrls, lat, lng,
    amenities, submittedBy,
  } = req.body;

  // ✅ FIX: Safely map over req.files, which is now guaranteed to exist by multer
  const imagePaths = (req.files || []).map(file => `uploads/${file.filename}`);

  const property = await Property.create({
    title, description, propertyType,
    price,
    area: safeParseNumber(units),
    bedrooms: safeParseNumber(bedrooms),
    bathrooms: safeParseNumber(bathrooms),
    furnishing, possession,
    builtYear: safeParseNumber(builtYear),
    location: `${locality}, ${city}`,
    locality, city,
    images: imagePaths,
    // ✅ FIX: Safely parse JSON data
    videoUrls: videoUrls ? JSON.parse(videoUrls) : [],
    amenities: amenities ? JSON.parse(amenities) : [],
    locationCoords: {
      lat: safeParseNumber(lat),
      lng: safeParseNumber(lng),
    },
    agent: req.user._id,
    submittedBy,
  });

  res.status(201).json(property);
});


// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // ✅ FIX: Safely handle new uploaded images
  const newImagePaths = (req.files || []).map(file => `uploads/${file.filename}`);
  let existingImagePaths = [];
  try {
    // ✅ FIX: Safely parse JSON for existing images
    existingImagePaths = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
  } catch (error) {
    existingImagePaths = [];
  }
  
  // ✅ FIX: Use consistent, safe number parsing for updates
  property.title = req.body.title || property.title;
  property.description = req.body.description || property.description;
  property.propertyType = req.body.propertyType || property.propertyType;
  property.price = req.body.price || property.price;
  property.area = safeParseNumber(req.body.area, property.area);
  property.bedrooms = safeParseNumber(req.body.bedrooms, property.bedrooms);
  property.bathrooms = safeParseNumber(req.body.bathrooms, property.bathrooms);
  property.furnishing = req.body.furnishing || property.furnishing;
  property.possession = req.body.possession || property.possession;
  property.builtYear = safeParseNumber(req.body.builtYear, property.builtYear);
  property.locality = req.body.locality || property.locality;
  property.city = req.body.city || property.city;
  property.location = `${property.locality}, ${property.city}`;

  property.images = [...existingImagePaths, ...newImagePaths];
  property.videoUrls = req.body.videoUrls ? JSON.parse(req.body.videoUrls) : property.videoUrls;
  property.amenities = req.body.amenities ? JSON.parse(req.body.amenities) : property.amenities;
  
  if (req.body.lat && req.body.lng) {
    property.locationCoords = { lat: safeParseNumber(req.body.lat), lng: safeParseNumber(req.body.lng) };
  } else if (req.body.lat === '' || req.body.lng === '') {
      property.locationCoords = { lat: null, lng: null };
  }
  property.submittedBy = req.body.submittedBy || property.submittedBy;
  property.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : property.isPublished;

  const updatedProperty = await property.save();
  res.json(updatedProperty);
});


// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (property) {
    await property.deleteOne();
    res.json({ message: "Property removed" });
  } else {
    res.status(404);
    throw new Error("Property not found");
  }
});


// --- ROUTES FOR REVIEWS ---

// @desc    Get reviews for a property
// @route   GET /api/properties/:id/reviews
// @access  Public
const getReviewsForProperty = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ property: req.params.id }).populate('user', 'name');
  res.json(reviews);
});

// @desc    Create a new review
// @route   POST /api/properties/:id/reviews
// @access  Private (requires login)
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  const alreadyReviewed = await Review.findOne({ 
    property: req.params.id, 
    user: req.user._id 
  });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Property already reviewed');
  }
  const review = new Review({
    rating: Number(rating),
    comment,
    user: req.user._id,
    property: req.params.id,
  });
  await review.save();
  const reviews = await Review.find({ property: req.params.id });
  property.numReviews = reviews.length;
  property.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await property.save();
  res.status(201).json({ message: 'Review added' });
});


export {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getReviewsForProperty,
  createReview,
};