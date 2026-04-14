import asyncHandler from 'express-async-handler';
import BrokerApplication from '../models/BrokerApplication.js';
import User from '../models/User.js';
import crypto from 'crypto'; // ✅ Added to generate secure codes

// Helper to generate a code (e.g., "REF-A1B2C")
const generateReferralCode = () => {
  return 'REF-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

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
  // Check if a referral code was used by the applicant
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
  
  // SCENARIO 1: User already exists (e.g., registered as a normal user first)
  if (user) {
    if (user.role === 'admin' || user.role === 'broker') {
      // If already processed, mark application as rejected to clear queue
      application.status = 'rejected';
      await application.save();
      res.status(400);
      throw new Error('User is already an admin or broker.');
    }
    
    // Upgrade Role
    user.role = 'broker';
    user.referredBy = referredBy || user.referredBy; // Keep existing referrer if present
    user.isVerified = true;

    // ✅ CRITICAL FIX: Generate code if they don't have one
    if (!user.referralCode) {
      user.referralCode = generateReferralCode();
    }

    await user.save();
    
    // Update Application Status
    application.status = 'approved';
    await application.save();
    await application.deleteOne(); // Remove from list

    res.status(200).json({ message: 'Existing user role updated to broker with referral code.' });
  
  } else {
    // SCENARIO 2: User does not exist (Create new account)
    user = await User.create({
      fullName: application.fullName,
      email: application.email,
      phoneNumber: application.phone,
      password: `password_${Date.now()}`, // Temporary password
      role: 'broker',
      isVerified: true,
      referredBy: referredBy,
      referralCode: generateReferralCode(), // ✅ FIX: Use consistent generator
      referrals: 0
    });

    application.status = 'approved';
    await application.save();
    await application.deleteOne(); // Remove from list

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

export { submitApplication, getApplications, approveApplication, rejectApplication };