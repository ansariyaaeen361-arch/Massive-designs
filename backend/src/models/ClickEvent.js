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
  },
  { timestamps: true },
);

clickEventSchema.index({ createdAt: -1 });
clickEventSchema.index({ event: 1 });

export default mongoose.model('ClickEvent', clickEventSchema);
