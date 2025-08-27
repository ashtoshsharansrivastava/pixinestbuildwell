// backend/controllers/enquiryController.js

import Enquiry from '../models/Enquiry.js';
import Property from '../models/Property.js';

// @desc    Create a new enquiry
// @route   POST /api/enquiries
// @access  Private
export const createEnquiry = async (req, res) => {
  const { propertyId } = req.body;

  if (!propertyId) {
    return res.status(400).json({ message: 'Property ID is required' });
  }

  try {
    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // ✅ Allow user to enquiry multiple properties
    // ❌ But prevent duplicate enquiry for the SAME property
    const existingEnquiry = await Enquiry.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (existingEnquiry) {
      return res.status(400).json({
        message: 'You have already sent an enquiry for this property',
      });
    }

    const enquiry = new Enquiry({
      property: propertyId,
      user: req.user._id, // from 'protect' middleware
    });

    const createdEnquiry = await enquiry.save();
    res.status(201).json(createdEnquiry);
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({})
      .populate('user', 'fullname email phoneNumber role') // consistent field casing
      .populate('property', 'title location price')
      .sort({ createdAt: -1 });

    res.json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
