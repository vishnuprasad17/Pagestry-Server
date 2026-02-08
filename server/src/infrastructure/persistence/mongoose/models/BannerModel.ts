import mongoose, { Schema, Document } from "mongoose";

interface IBannerDocument extends Document {
  title: string;
  description: string;
  image: string;
  theme: "primary" | "secondary" | "classic";
  link?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBannerDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    theme: {
      type: String,
      required: true,
      enum: ["primary", "secondary", "classic"]
    },
    link: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const BannerModel = mongoose.model<IBannerDocument>("Banner", bannerSchema);