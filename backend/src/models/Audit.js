import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fix: { type: String, required: true },
    severity: { type: Number, required: true },
    category: { type: String, required: true },
  },
  { _id: false },
);

const auditSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    overallScore: { type: Number, required: true },
    scores: {
      performance: { type: Number, required: true },
      seo: { type: Number, required: true },
      mobile: { type: Number, required: true },
      security: { type: Number, required: true },
      accessibility: { type: Number, required: true },
    },
    issues: { type: [issueSchema], default: [] },
    details: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

export default mongoose.model('Audit', auditSchema);
