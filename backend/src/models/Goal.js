import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true, index: true },
  // Matches an event by name only (not source) — a goal is "did this kind
  // of thing happen at all", not "from this exact button" (per Phase 5's
  // spec examples: "Phone link", "Contact form", not per-instance).
  event: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  enabled: { type: Boolean, default: true },
  // Optional, client-supplied estimate of what one of these is worth (a
  // lead's estimated value, an average order value, etc.) — used only to
  // compute an estimated business-value total, always labeled as an
  // estimate. Left unset, no dollar figure is shown for this goal at all.
  estimatedValue: { type: Number, min: 0, default: null },
  createdAt: { type: Date, default: Date.now },
});

// One goal per event per site — "enabling" an already-goaled event just
// updates it instead of creating a duplicate.
goalSchema.index({ siteId: 1, event: 1 }, { unique: true });

export default mongoose.model('Goal', goalSchema);
