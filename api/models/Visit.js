import mongoose from 'mongoose';

const VisitSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional (if logged in)
  guestName: { type: String }, // If not logged in
  guestPhone: { type: String }, // If not logged in
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.model('Visit', VisitSchema);