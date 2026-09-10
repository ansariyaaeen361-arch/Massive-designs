import mongoose from 'mongoose';

const popupClickSchema = new mongoose.Schema(
  {
    popup: { type: String, required: true, trim: true },
    page: { type: String, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model('PopupClick', popupClickSchema);
