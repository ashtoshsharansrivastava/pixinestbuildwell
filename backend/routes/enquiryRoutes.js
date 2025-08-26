// backend/routes/enquiryRoutes.js

import express from 'express';
import { createEnquiry, getEnquiries } from '../controllers/enquiryController.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

router.route('/')
  .post(protect, createEnquiry) // Any logged-in user can create
  .get(protect, admin, getEnquiries); // Only admins can view all

export default router;