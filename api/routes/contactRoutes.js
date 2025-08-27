import express from 'express';
import { submitContactForm } from '../controllers/contactController.js';

const router = express.Router();

// When a POST request is made to /api/contact, it will run the submitContactForm function
router.route('/').post(submitContactForm);

export default router;