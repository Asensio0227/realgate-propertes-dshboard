import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SessionPlatform = 'whatsapp' | 'messenger';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ISession {
  senderId: string; // phone number (WhatsApp) or PSID (Messenger)
  platform: SessionPlatform;
  history: ChatMessage[];
  leadSaved: boolean;
  lastActivity: Date;
  meta?: string; // JSON blob — serialised concierge ClientSession state
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionDocument extends ISession, Document {}

// ─── Schema ───────────────────────────────────────────────────────────────────

const sessionSchema = new Schema<ISessionDocument>(
  {
    senderId: { type: String, required: true, trim: true },
    platform: {
      type: String,
      enum: ['whatsapp', 'messenger'],
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant', 'system'],
          required: true,
        },
        content: { type: String, required: true },
      },
    ],
    leadSaved: { type: Boolean, default: false },
    lastActivity: { type: Date, default: Date.now },
    meta: { type: String, default: null },
  },
  {
    timestamps: true,
    collection: 'chatbot_sessions',
  },
);

// ─── Indexes ──────────────────────────────────────────────────────────────────

// One session per sender per platform
sessionSchema.index({ senderId: 1, platform: 1 }, { unique: true });

// Auto-expire after 7 days of inactivity
sessionSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 604800 });

// ─── Model (safe for Next.js hot-reload) ─────────────────────────────────────

const Session =
  (mongoose.models.Session as Model<ISessionDocument>) ||
  mongoose.model<ISessionDocument>('Session', sessionSchema);

export default Session;
