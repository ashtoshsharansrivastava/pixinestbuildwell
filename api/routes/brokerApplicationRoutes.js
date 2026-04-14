// backend/routes/brokerApplicationRoutes.js
import express from 'express';
import {
  submitApplication,
  getApplications,
  approveApplication,
  rejectApplication,
} from '../controllers/brokerApplicationController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post(submitApplication).get(protect, admin, getApplications);
router.route('/:id/approve').post(protect, admin, approveApplication);
router.route('/:id').delete(protect, admin, rejectApplication);

export default router;