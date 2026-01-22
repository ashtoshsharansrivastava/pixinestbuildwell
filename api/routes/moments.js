import express from 'express';
import Moment from '../models/Moment.js';
import { verifyAdmin } from '../middleware/authMiddleware.js'; // Assuming you have middleware

const router = express.Router();

// GET all moments (Public)
router.get('/', async (req, res) => {
  try {
    const moments = await Moment.find().sort({ createdAt: -1 });
    res.json(moments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new moment (Admin Only)
router.post('/', verifyAdmin, async (req, res) => {
  const { name, location, image } = req.body;
  try {
    const newMoment = new Moment({ name, location, image });
    const savedMoment = await newMoment.save();
    res.status(201).json(savedMoment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE moment (Admin Only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Moment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Moment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;