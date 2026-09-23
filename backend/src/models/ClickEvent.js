import mongoose from 'mongoose';

const clickEventSchema = new mongoose.Schema(
  {
    siteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Site', required: true, index: true },
    event: { type: String, required: true, trim: true },
    source: { type: String, trim: true },
    page: { type: String, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    city: { type: String, trim: true },
    region: { type: String, trim: true },
    country: { type: String, trim: true },
    isp: { type: String, trim: true },
    referrer: { type: String, trim: true },
    device: { type: String, trim: true },
    browser: { type: String, trim: true },
    os: { type: String, trim: true },
    sessionId: { type: String, trim: true },
    visitorId: { type: String, trim: true },
    isReturning: { type: Boolean },
    durationMs: { type: Number },
    isBot: { type: Boolean, default: false },
    botReason: { type: String, trim: true },
    // Computed once at ingest time (see lib/classifyChannel.js) so every
    // later report/dashboard reuses the same categories instead of
    // re-deriving them from the raw referrer each time.
    channel: { type: String, trim: true },
    utm: {
      source: { type: String, trim: true },
      medium: { type: String, trim: true },
      campaign: { type: String, trim: true },
      term: { type: String, trim: true },
      content: { type: String, trim: true },
    },
    // Open-ended bag for future phases (perf metrics, error info, etc.) so
    // they don't each need their own schema migration.
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

clickEventSchema.index({ createdAt: -1 });
clickEventSchema.index({ event: 1 });
clickEventSchema.index({ sessionId: 1, createdAt: 1 });
clickEventSchema.index({ siteId: 1, createdAt: -1 });
// Powers isSessionFlood.js's per-visitor session-count check without a
// collection scan.
clickEventSchema.index({ siteId: 1, visitorId: 1, createdAt: -1 });

export default mongoose.model('ClickEvent', clickEventSchema);
