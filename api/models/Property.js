import mongoose from 'mongoose';

const propertySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    propertyType: { type: String, required: true },
    price: { type: Number, required: true }, // Recommendation: Keep Price as Number for sorting!
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

    // 🔴 OLD WAY (Delete this)
    // locationCoords: {
    //   lat: { type: Number },
    //   lng: { type: Number },
    // },

    // 🟢 NEW WAY (Add this): GeoJSON Format
    locationCoords: {
      type: {
        type: String,
        enum: ['Point'], // We only support "Points" (dots on the map)
        default: 'Point',
      },
      coordinates: {
        type: [Number], // Array of numbers: [Longitude, Latitude]
        required: true, 
      }
    },

    agent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

// ✅ IMPORTANT: Add the Geospatial Index
// This line makes the "search inside polygon" query possible and fast.
propertySchema.index({ locationCoords: '2dsphere' });

const Property = mongoose.model('Property', propertySchema);

export default Property;