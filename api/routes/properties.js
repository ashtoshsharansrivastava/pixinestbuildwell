// backend/routes/properties.js

import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import {
  getReviewsForProperty,
  addReviewForProperty,
} from '../controllers/reviewController.js';
import multer from 'multer';

// --- ADDED: Cloudinary and multer-storage-cloudinary imports ---
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// --- ADDED: Cloudinary Configuration ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- CHANGED: Multer now uses Cloudinary for storage ---
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pixinest', // This will create a 'pixinest' folder in your Cloudinary account
    allowedFormats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage: storage });

// --- PUBLIC ROUTES ---
router.route('/').get(getProperties);
router.route('/:id').get(getPropertyById);

// Reviews
router.route('/:id/reviews').get(getReviewsForProperty); // Public GET
router.route('/:id/reviews').post(protect, addReviewForProperty); // Authenticated POST

// --- PRIVATE/ADMIN ROUTES ---
// These routes now automatically upload images to Cloudinary
router
  .route('/')
  .post(protect, admin, upload.array('images', 10), createProperty);
router
  .route('/:id')
  .put(protect, admin, upload.array('images', 10), updateProperty);

router.route('/:id').delete(protect, admin, deleteProperty);

export default router;