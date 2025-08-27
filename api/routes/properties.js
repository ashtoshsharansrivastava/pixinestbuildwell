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
import path from 'path';

const router = express.Router();

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// --- PUBLIC ROUTES ---
router.route('/').get(getProperties);
router.route('/:id').get(getPropertyById);

// ✅ NEW: Reviews
router.route('/:id/reviews').get(getReviewsForProperty); // Public GET
router.route('/:id/reviews').post(protect, addReviewForProperty); // Authenticated POST

// --- PRIVATE/ADMIN ROUTES ---
router
  .route('/')
  .post(protect, admin, upload.array('images', 10), createProperty);

router
  .route('/:id')
  .put(protect, admin, upload.array('images', 10), updateProperty);

router.route('/:id').delete(protect, admin, deleteProperty);

export default router;
