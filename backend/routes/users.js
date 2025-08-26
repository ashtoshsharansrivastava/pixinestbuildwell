import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  createBroker,
  getUserById,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js'; 

const router = express.Router();

// Public routes
router.post('/login', authUser);
router.route('/').post(registerUser);

// Private routes (require login)
router.route('/profile').get(protect, getUserProfile);

// Admin-only routes
router.route('/').get(protect, admin, getUsers);
router.route('/broker').post(protect, admin, createBroker);

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .delete(protect, admin, deleteUser);

export default router;