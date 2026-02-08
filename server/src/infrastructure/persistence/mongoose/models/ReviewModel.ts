import mongoose, { Schema, Document } from "mongoose";

interface IReviewDocument extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  rating: number;
  likes: number;
  dislikes: number;
  likedBy: mongoose.Types.ObjectId[];
  dislikedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: []
    },
    dislikedBy: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: []
    }
  },
  { timestamps: true }
);

reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export const ReviewModel = mongoose.model<IReviewDocument>("Review", reviewSchema);