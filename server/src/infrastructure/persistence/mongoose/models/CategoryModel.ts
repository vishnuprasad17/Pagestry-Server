import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICategoryDocument extends Document {
    name: string;
    icon: string;
}

export const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true, lowercase: true },
    icon: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.model<ICategoryDocument>("Category", categorySchema);