// backend/models/BrokerApplication.js
import mongoose from 'mongoose';

const brokerApplicationSchema = mongoose.Schema(
  {
    fullName: { 
      type: String, 
      required: true 
    },
    dob: { 
      type: Date, 
      required: true 
    },
    phone: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    experience: { 
      type: Number, 
      default: 0 
    },
    locations: { 
      type: String 
    },
    brokerMessage: { 
      type: String 
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    // NEW field to store the referral code used by the applicant
    referralCodeUsed: { 
      type: String 
    },
  },
  {
    timestamps: true,
  }
);

const BrokerApplication = mongoose.model('BrokerApplication', brokerApplicationSchema);

export default BrokerApplication;