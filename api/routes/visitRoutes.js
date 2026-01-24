import express from 'express';
import Visit from '../models/Visit.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// POST: Create a new visit request (Public/Protected)
router.post('/', async (req, res) => {
  const { propertyId, date, time, userId, guestName, guestPhone } = req.body;
  
  try {
    const visit = new Visit({
      property: propertyId,
      user: userId || null,
      guestName,
      guestPhone,
      date,
      time
    });
    
    const savedVisit = await visit.save();
    res.status(201).json(savedVisit);
  } catch (err) {
    res.status(400).json({ message: 'Failed to schedule visit' });
  }
});

// GET: Get all visits (Admin Only) - Populating Property and User details
router.get('/', protect, admin, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('property', 'title location')
      .populate('user', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH: Update Status (Admin Only)
router.patch('/:id', protect, admin, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndUpdate(
      req.params.id, 
      { status: req.body.status },
      { new: true }
    );
    res.json(visit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;