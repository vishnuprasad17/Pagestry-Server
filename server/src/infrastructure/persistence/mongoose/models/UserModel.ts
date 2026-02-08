import mongoose, { Schema, Document } from "mongoose";

interface IUserDocument extends Document {
  firebaseUid?: string;
  username: string;
  name: string;
  profileImage?: string;
  password?: string;
  role: "user" | "admin";
  favoriteBooks: mongoose.Types.ObjectId[];
  authProvider: "password" | "google.com";
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    firebaseUid: { type: String },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profileImage: { type: String },
    password: { type: String, select: false },
    role: { type: String, required: true, enum: ["user", "admin"] },
    favoriteBooks: [{ type: Schema.Types.ObjectId, ref: 'Book', default: [] }],
    authProvider: { type: String, enum: ["password", "google.com"] },
    isBlocked: { type: Boolean, default: false }
  },
  { timestamps: true }
);

userSchema.index({ firebaseUid: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ isBlocked: 1 });

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);