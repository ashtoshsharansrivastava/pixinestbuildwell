// backend/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      // ✅ CORRECTED: Use 'broker' for consistency
      enum: ['admin', 'customer', 'broker'],
      default: 'customer',
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // ✅ ADDED: Field to store the broker's unique referral code
    referralCode: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have a null value
    },

    // ✅ ADDED: Field to store the ID of the referring user
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// --- Middleware to hash password before saving ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method to compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;