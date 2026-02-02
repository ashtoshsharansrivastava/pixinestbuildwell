import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getReviewsForProperty,
  createReview,
  searchInArea, 
} from '../controllers/propertyController.js';

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// --- CONFIGURATION: CLOUDINARY ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- CONFIGURATION: MULTER STORAGE ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pixinest', // Creates a folder in your Cloudinary dashboard
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
  },
});

const upload = multer({ storage: storage });

// --- ROUTES ---

// 1. SEARCH ROUTES (Must be before /:id)
router.route('/search-area').post(searchInArea); 

// 2. GENERAL PROPERTY ROUTES
router.route('/')
  .get(getProperties)
  .post(protect, admin, upload.array('images', 10), createProperty);

// 3. SPECIFIC PROPERTY ROUTES & REVIEWS
router.route('/:id/reviews')
  .get(getReviewsForProperty)
  .post(protect, createReview);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, admin, upload.array('images', 10), updateProperty)
  .delete(protect, admin, deleteProperty);

export default router;