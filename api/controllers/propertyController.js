// api/controllers/propertyController.js

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
    amenities,
  } = req.body;

  // Get permanent image URLs directly from Cloudinary
  const imagePaths = (req.files || []).map(file => file.path);

  // ✅ NEW: Handle GeoJSON format for the map
  // Default to [0,0] if lat/lng are missing to prevent crash
  let locationCoords = {
    type: 'Point',
    coordinates: [0, 0] 
  };

  if (lat && lng) {
    locationCoords = {
      type: 'Point',
      coordinates: [safeParseNumber(lng), safeParseNumber(lat)] // MongoDB uses [Lng, Lat]
    };
  }

  const property = await Property.create({
    title, description, propertyType,
    price,
    area: units,
    bedrooms: propertyType === 'Plot' ? 0 : safeParseNumber(bedrooms),
    bathrooms: propertyType === 'Plot' ? 0 : safeParseNumber(bathrooms),
    furnishing, possession,
    builtYear: safeParseNumber(builtYear),
    location: `${locality}, ${city}`,
    locality, city,
    images: imagePaths,
    videoUrls: videoUrls ? JSON.parse(videoUrls) : [],
    amenities: amenities ? JSON.parse(amenities) : [],
    locationCoords, // ✅ Updated to use GeoJSON
    agent: req.user._id,
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

  const newImagePaths = (req.files || []).map(file => file.path);

  let existingImagePaths = [];
  try {
    existingImagePaths = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
  } catch (error) {
    existingImagePaths = [];
  }
  
  property.title = req.body.title || property.title;
  property.description = req.body.description || property.description;
  property.propertyType = req.body.propertyType || property.propertyType;
  property.price = req.body.price || property.price;
  property.area = req.body.units || property.area;

  if (property.propertyType === 'Plot') {
      property.bedrooms = 0;
      property.bathrooms = 0;
  } else {
      property.bedrooms = safeParseNumber(req.body.bedrooms, property.bedrooms);
      property.bathrooms = safeParseNumber(req.body.bathrooms, property.bathrooms);
  }

  property.furnishing = req.body.furnishing || property.furnishing;
  property.possession = req.body.possession || property.possession;
  property.builtYear = safeParseNumber(req.body.builtYear, property.builtYear);
  property.locality = req.body.locality || property.locality;
  property.city = req.body.city || property.city;
  property.location = `${property.locality}, ${property.city}`;

  property.images = [...existingImagePaths, ...newImagePaths];
  property.videoUrls = req.body.videoUrls ?
    JSON.parse(req.body.videoUrls) : property.videoUrls;
  property.amenities = req.body.amenities ? JSON.parse(req.body.amenities) : property.amenities;

  // ✅ NEW: Update GeoJSON coordinates
  if (req.body.lat && req.body.lng) {
    property.locationCoords = {
      type: 'Point',
      coordinates: [safeParseNumber(req.body.lng), safeParseNumber(req.body.lat)] // [Lng, Lat]
    };
  }
  
  property.isPublished = req.body.isPublished !== undefined ?
    req.body.isPublished : property.isPublished;

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

// ✅ NEW: Find properties inside a drawn area (Polygon Search)
// @route   POST /api/properties/search-area
// @access  Public
const searchInArea = async (req, res) => {
  const { polygon } = req.body; // Expects [{lat: x, lng: y}, ...]

  if (!polygon || polygon.length < 3) {
    return res.status(400).json({ message: 'Invalid drawing. Please draw a complete shape.' });
  }

  // 1. Convert Coordinates: Leaflet gives [Lat, Lng], MongoDB needs [Lng, Lat]
  let mongoPolygon = polygon.map(p => [p.lng, p.lat]);

  // 2. Close the Loop: The first and last points must match
  const firstPoint = mongoPolygon[0];
  const lastPoint = mongoPolygon[mongoPolygon.length - 1];

  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    mongoPolygon.push(firstPoint);
  }

  try {
    const properties = await Property.find({
      locationCoords: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [mongoPolygon] // Double brackets required for GeoJSON Polygons
          }
        }
      }
    });

    res.json(properties);
  } catch (error) {
    console.error("Geo Search Error:", error);
    res.status(500).json({ message: 'Map search failed', error: error.message });
  }
};

export {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getReviewsForProperty,
  createReview,
  searchInArea, // ✅ Exported the new function
};