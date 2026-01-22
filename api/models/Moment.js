import mongoose from 'mongoose';

const MomentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true }, // Stores Image URL
}, { timestamps: true });

export default mongoose.model('Moment', MomentSchema);