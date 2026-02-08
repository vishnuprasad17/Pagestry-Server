import mongoose, { Schema, Document } from "mongoose";

interface IAuthorDocument extends Document {
  name: string;
  bio: string;
  profileImage?: string;
  website?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const authorSchema = new Schema<IAuthorDocument>(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    profileImage: { type: String },
    website: { type: String },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

authorSchema.index({ name: "text" });

export const AuthorModel = mongoose.model<IAuthorDocument>("Author", authorSchema);