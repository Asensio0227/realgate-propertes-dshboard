import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadSource = 'chatbot' | 'website' | 'ads';
export type LeadStatus = 'new' | 'contacted' | 'closed';
export type LeadType = 'rent' | 'buy';
export type LeadPriority = 'low' | 'medium' | 'high';

export interface ILead {
  name: string;
  phone: string;
  budget?: number;
  location?: string;
  type?: LeadType;
  propertyType?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: LeadPriority;
  notes?: string;
  agency: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadDocument extends ILead, Document {
  id: string;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    budget: { type: Number, default: null },
    location: { type: String, trim: true },
    type: { type: String, enum: ['rent', 'buy'] },
    propertyType: { type: String, trim: true },
    notes: { type: String },
    source: {
      type: String,
      enum: ['chatbot', 'website', 'ads'],
      default: 'chatbot',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency',
      required: [true, 'Agency is required'],
    },
  },
  {
    timestamps: true,
    collection: 'leads',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ source: 1 });
leadSchema.index({ agency: 1 });

// ─── Model (safe for Next.js hot-reload) ─────────────────────────────────────

const Lead =
  (mongoose.models.Lead as Model<ILeadDocument>) ||
  mongoose.model<ILeadDocument>('Lead', leadSchema);

export default Lead;
