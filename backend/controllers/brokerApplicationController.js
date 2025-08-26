// backend/controllers/brokerApplicationController.js
import asyncHandler from 'express-async-handler';
import BrokerApplication from '../models/BrokerApplication.js';
import User from '../models/User.js';

// @desc    Submit a new broker application
// @route   POST /api/broker-applications
// @access  Public
const submitApplication = asyncHandler(async (req, res) => {
  const { fullName, dob, phone, email, experience, locations, brokerMessage, referralCodeUsed } = req.body;
  
  const applicationExists = await BrokerApplication.findOne({ email });
  if (applicationExists) {
    res.status(400);
    throw new Error('An application with this email has already been submitted.');
  }

  const application = await BrokerApplication.create({
    fullName, dob, phone, email, experience, locations, brokerMessage, referralCodeUsed,
  });

  res.status(201).json({ message: 'Application submitted successfully.' });
});

// @desc    Get all pending applications
// @route   GET /api/broker-applications
// @access  Private/Admin
const getApplications = asyncHandler(async (req, res) => {
  const applications = await BrokerApplication.find({ status: 'pending' });
  res.json(applications);
});

// @desc    Approve a broker application
// @route   POST /api/broker-applications/:id/approve
// @access  Private/Admin
const approveApplication = asyncHandler(async (req, res) => {
  const application = await BrokerApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  let referredBy = null;
  // Check if a referral code was used
  if (application.referralCodeUsed) {
    const referringUser = await User.findOne({ referralCode: application.referralCodeUsed });
    if (referringUser) {
      referredBy = referringUser._id;
      // Increment the referring broker's referral count
      referringUser.referrals = (referringUser.referrals || 0) + 1;
      await referringUser.save();
    }
  }

  let user = await User.findOne({ email: application.email });
  
  if (user) {
    if (user.role === 'admin' || user.role === 'broker') {
      application.status = 'rejected';
      await application.save();
      res.status(400);
      throw new Error('User is already an admin or broker. Cannot change role.');
    }
    
    user.role = 'broker';
    user.referredBy = referredBy; 
    user.isVerified = true; // ✅ FIXED: Set to true on update
    await user.save();
    
    application.status = 'approved';
    await application.save();

    // Delete the application from the database
    await application.deleteOne();

    res.status(200).json({ message: 'Existing user role updated to broker.' });
  } else {
    user = await User.create({
      fullName: application.fullName,
      email: application.email,
      phoneNumber: application.phone,
      password: `password_${Date.now()}`,
      role: 'broker',
      isVerified: true, // ✅ FIXED: Set to true on creation
      referredBy: referredBy,
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      referrals: 0 // Initialize referrals to 0 for a new user
    });

    application.status = 'approved';
    await application.save();

    // Delete the application from the database
    await application.deleteOne();
    
    res.status(201).json({ message: 'New broker approved and user account created.', user });
  }
});

// @desc    Reject (delete) a broker application
// @route   DELETE /api/broker-applications/:id
// @access  Private/Admin
const rejectApplication = asyncHandler(async (req, res) => {
  const application = await BrokerApplication.findById(req.params.id);
  if (application) {
    await application.deleteOne();
    res.json({ message: 'Application rejected and removed.' });
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});

// ✅ MOVED: Export statement is now at the end, after all function definitions
export { submitApplication, getApplications, approveApplication, rejectApplication };