import mongoose from 'mongoose';

// One document per site per UTC day (siteId: null holds the site-agnostic
// global total) — a simple, atomic counter for enforcing the free tier's
// real daily ceiling without needing a separate job or cache layer.
const aiUsageSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', default: null, index: true },
  date: { type: String, required: true, index: true }, // 'YYYY-MM-DD' (UTC)
  count: { type: Number, default: 0 },
});

aiUsageSchema.index({ siteId: 1, date: 1 }, { unique: true });

export default mongoose.model('AiUsage', aiUsageSchema);
