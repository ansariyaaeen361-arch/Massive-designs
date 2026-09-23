import mongoose from 'mongoose';
import { ALERT_TYPES } from '../lib/alertTypes.js';

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  domain: { type: String, required: true, trim: true, lowercase: true },
  siteKey: { type: String, required: true, unique: true, index: true },
  ownerEmail: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  theme: {
    primaryColor: { type: String, default: '#4f46e5' },
    accentColor: { type: String, default: '#22c55e' },
    mode: { type: String, enum: ['light', 'dark'], default: 'light' },
  },
  branding: {
    brandName: { type: String, default: null },
    logoUrl: { type: String, default: null },
  },
  alertSettings: {
    enabledTypes: { type: [String], enum: ALERT_TYPES, default: ALERT_TYPES },
    emailEnabled: { type: Boolean, default: true },
    webhookUrl: { type: String, default: null },
  },
  reportSettings: {
    weeklyEnabled: { type: Boolean, default: true },
    monthlyEnabled: { type: Boolean, default: false },
    lastWeeklyReportAt: { type: Date, default: null },
    lastMonthlyReportAt: { type: Date, default: null },
  },
  privacySettings: {
    // 425 days matches GA4's own default retention window.
    retentionDays: { type: Number, default: 425 },
    anonymizeIp: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Site', siteSchema);
