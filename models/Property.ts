import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PropertyType = 'rent' | 'sale';
export type PropertyCategory = 'house' | 'apartment' | 'commercial' | 'stands';

export interface IProperty {
  title: string;
  type: PropertyType;
  category: PropertyCategory;
  bedrooms?: number;
  bathrooms?: number;
  price?: number;
  location: string;
  description?: string;
  images: string[];
  available: boolean;
  agency: mongoose.Types.ObjectId; // required — matches backend
  createdAt: Date;
  updatedAt: Date;
}

export interface IPropertyDocument extends IProperty, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const propertySchema = new Schema<IPropertyDocument>(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Listing type is required'],
      enum: ['rent', 'sale'],
    },
    category: {
      type: String,
      required: [true, 'Property category is required'],
      enum: ['house', 'apartment', 'commercial', 'stands'],
    },
    bedrooms: { type: Number, default: null },
    bathrooms: { type: Number, default: null },
    price: { type: Number, default: null },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    description: { type: String, trim: true },
    images: [{ type: String }],
    available: { type: Boolean, default: true },
    agency: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'properties',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

propertySchema.index({ type: 1, available: 1 });
propertySchema.index({ category: 1, type: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ agency: 1 });

// ─── Model (safe for Next.js hot-reload) ─────────────────────────────────────

const Property =
  (mongoose.models.Property as Model<IPropertyDocument>) ||
  mongoose.model<IPropertyDocument>('Property', propertySchema);

export default Property;
