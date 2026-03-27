import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'agent';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  agency: mongoose.Types.ObjectId; // required when role === 'agent'
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const userSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'agent'],
      default: 'agent',
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      // Required only for agents — admins may have no agency
      required: function (this: IUserDocument) {
        return this.role === 'agent';
      },
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

userSchema.index({ agency: 1 });

// ─── Hash password before saving ─────────────────────────────────────────────

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─── Instance method: compare password ───────────────────────────────────────

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Model (safe for Next.js hot-reload) ─────────────────────────────────────

const User =
  (mongoose.models.User as Model<IUserDocument>) ||
  mongoose.model<IUserDocument>('User', userSchema);

export default User;
