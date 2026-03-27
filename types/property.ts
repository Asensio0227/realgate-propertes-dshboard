import mongoose from 'mongoose';

// ─── Shared property types ────────────────────────────────────────────────────
// Single source of truth used by PropertyCard, PropertyFormModal, and the page.

export interface PropertyData {
  _id?: string;
  title: string;
  type: string;
  category: string;
  location: string;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  description?: string;
  available: boolean;
  images?: string[];
  agency?: mongoose.Types.ObjectId | string;
}

// A PropertyData that has definitely been persisted (has an _id)
export type SavedProperty = PropertyData & { _id: string };

export interface PropertyForm {
  title: string;
  type: string;
  category: string;
  location: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  description: string;
  available: string;
  images: string[];
}
