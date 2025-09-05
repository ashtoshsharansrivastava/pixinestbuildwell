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
import { fileURLToPath } from 'url'; // 👈 ADDED: Required for __dirname

const router = express.Router();

// --- DEFINE __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url); // 👈 ADDED
const __dirname = path.dirname(__filename); // 👈 ADDED

// --- CORRECTED MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  // This now points to the correct /backend/uploads folder
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')); // 👈 CHANGED
  },
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