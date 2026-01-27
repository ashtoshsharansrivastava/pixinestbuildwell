import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// --- HELPER FUNCTIONS ---

// Helper to generate a code (e.g., "REF-A1B2C")
const generateReferralCode = () => {
  return 'REF-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- AUTH CONTROLLERS ---

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    fullName,
    email,
    phoneNumber,
    password,
    role: 'user', // Default role
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// --- PROFILE CONTROLLERS (Likely what was missing) ---

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is set by the auth middleware
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      referralCode: user.referralCode, // Include in profile if needed
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// --- ADMIN / BROKER CONTROLLERS ---

// @desc    Create a new Broker manually (Admin Only)
// @route   POST /api/users/create-broker
// @access  Private/Admin
const createBroker = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber } = req.body;

  // 1. Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    // If they exist but are just a 'user', upgrade them
    if (userExists.role === 'user') {
      userExists.role = 'broker';
      userExists.isVerified = true;
      // ✅ FIX: Generate code if missing
      if (!userExists.referralCode) {
         userExists.referralCode = generateReferralCode();
      }
      await userExists.save();
      return res.status(200).json({ message: 'User role updated to broker.' });
    }
    res.status(400);
    throw new Error('User already exists and is already a broker/admin.');
  }

  // 2. Create new Broker
  const referralCode = generateReferralCode(); // ✅ FIX: Generate Code
  const defaultPassword = 'password123'; // You might want to generate this or email it

  const user = await User.create({
    fullName,
    email,
    phoneNumber,
    password: defaultPassword,
    role: 'broker',
    isVerified: true,
    referralCode, // ✅ FIX: Save to DB
    referrals: 0,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      referralCode: user.referralCode,
      message: 'New broker created successfully.',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    ONE-TIME FIX: Repair Brokers with missing codes
// @route   GET /api/users/fix-codes
// @access  Public (Remove or protect after use)
const fixMissingReferralCodes = asyncHandler(async (req, res) => {
  const brokers = await User.find({ role: 'broker', referralCode: { $exists: false } });
  
  let count = 0;
  for (const broker of brokers) {
    broker.referralCode = generateReferralCode();
    await broker.save();
    count++;
  }
  
  res.json({ message: `Success! Fixed ${count} brokers who had 'N/A' codes.` });
});

export { 
  authUser, 
  registerUser, 
  getUserProfile,    // Added
  updateUserProfile, // Added
  createBroker, 
  getUsers, 
  deleteUser,
  fixMissingReferralCodes 
};