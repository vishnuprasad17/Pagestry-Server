import mongoose, { Schema, Document } from "mongoose";

interface IBookDocument extends Document {
  title: string;
  authorId: mongoose.Types.ObjectId;
  description: string;
  category: mongoose.Types.ObjectId;
  ISBN: string;
  featured: boolean;
  coverImage: string;
  mrp: number;
  sellingPrice: number;
  stock: number;
  totalRating: number;
  ratingCount: number;
  averageRating: number;
  ratingBreakdown: Record<string, number>;
}

const bookSchema = new Schema<IBookDocument>(
  {
    title: { type: String, required: true, trim: true },
    authorId: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    ISBN: { type: String, required: true, unique: true, trim: true },
    featured: { type: Boolean, default: false },
    coverImage: { type: String, required: true },
    mrp: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    totalRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingBreakdown: {
      "1": { type: Number, default: 0 },
      "2": { type: Number, default: 0 },
      "3": { type: Number, default: 0 },
      "4": { type: Number, default: 0 },
      "5": { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", ISBN: "text" });
bookSchema.index({ category: 1 });
bookSchema.index({ featured: 1 });

export const BookModel = mongoose.model<IBookDocument>("Book", bookSchema);