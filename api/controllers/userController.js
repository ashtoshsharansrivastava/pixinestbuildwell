// backend/controllers/userController.js
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Property from '../models/Property.js';
// ✅ Removed the commented-out import and the non-code block

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

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
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user (customer)
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, phoneNumber } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    fullName,
    email,
    password,
    phoneNumber,
    role: 'customer',
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

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users with their property count
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: 'properties',
        localField: '_id',
        foreignField: 'agent',
        as: 'listedProperties',
      },
    },
    {
      $addFields: {
        propertyCount: { $size: '$listedProperties' },
      },
    },
    {
      $project: {
        listedProperties: 0,
        password: 0,
      },
    },
  ]);

  res.status(200).json(users);
});

// @desc    Create a new broker OR update an existing user's role
// @route   POST /api/users/broker
// @access  Private/Admin
const createBroker = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    if (user.role === 'admin' || user.role === 'broker') {
      res.status(400);
      throw new Error('Cannot change role for an existing admin or broker.');
    }
    
    user.role = 'broker';
    user.fullName = fullName || user.fullName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.isVerified = true; // ✅ ADDED: Set to true on update
    await user.save();

    res.status(200).json({
      message: 'User role updated to broker.',
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    });
  } else {
    const password = Math.random().toString(36).slice(-10); // ✅ FIXED: Password generation logic
    user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      role: 'broker',
      isVerified: true, // ✅ ADDED: Set to true on creation
      referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    });

    if (user) {
      res.status(201).json({
        message: 'New broker created successfully.',
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') {
      res.status(400);
      throw new Error('Cannot delete admin user');
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
  createBroker,
  getUserById,
  deleteUser,
};