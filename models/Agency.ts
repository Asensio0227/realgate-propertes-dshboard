import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IAgency {
  name: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAgencyDocument extends IAgency, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const agencySchema = new Schema<IAgencyDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
  },
  {
    timestamps: true,
    collection: 'agencies',
  },
);

agencySchema.index({ email: 1 }, { unique: true });

// ─── Model (safe for Next.js hot-reload) ─────────────────────────────────────

const Agency =
  (mongoose.models.Agency as Model<IAgencyDocument>) ||
  mongoose.model<IAgencyDocument>('Agency', agencySchema);

export default Agency;
