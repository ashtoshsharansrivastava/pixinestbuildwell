import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    propertyType: { type: String, required: true },
    price: { type: String, required: true },
    
    // ✅ CHANGE: The 'area' field is now a String to support multiple values.
    area: { type: String, required: true },

    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    furnishing: { type: String, default: 'Unfurnished' },
    possession: { type: String, default: 'Immediate' },
    builtYear: { type: Number },
    location: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    images: [{ type: String }],
    videoUrls: [{ type: String }],
    amenities: [{ type: String }],
    locationCoords: {
      lat: { type: Number },
      lng: { type: Number },
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    
    // ✅ CHANGE: The 'submittedBy' field has been removed.
    
    // --- ADDED FOR REVIEW SYSTEM ---
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    // --- END OF ADDED FIELDS ---
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Property = mongoose.model('Property', propertySchema);

export default Property;

