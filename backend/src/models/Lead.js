import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    audit: { type: mongoose.Schema.Types.ObjectId, ref: 'Audit', required: true },
    reportSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model('Lead', leadSchema);
