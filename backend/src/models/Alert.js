import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true, index: true },
  type: { type: String, required: true },
  severity: { type: String, enum: ['high', 'medium', 'low'], required: true },
  whatHappened: { type: String, required: true },
  evidence: { type: String, required: true },
  suggestedAction: { type: String },
  // A stable key for this specific finding (type + rounded direction), used
  // to avoid re-alerting on the exact same ongoing condition every
  // evaluation cycle — see lib/alertEvaluator.js.
  dedupeKey: { type: String, required: true, index: true },
  acknowledged: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  webhookSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model('Alert', alertSchema);
