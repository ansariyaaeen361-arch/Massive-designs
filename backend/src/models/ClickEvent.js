import mongoose from 'mongoose';

const clickEventSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true },
);

clickEventSchema.index({ createdAt: -1 });
clickEventSchema.index({ event: 1 });
clickEventSchema.index({ sessionId: 1, createdAt: 1 });

export default mongoose.model('ClickEvent', clickEventSchema);
