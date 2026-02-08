import mongoose, { Schema, Document } from "mongoose";

interface ICartDocument extends Document {
  userId: mongoose.Types.ObjectId;
  items: {
    bookId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
}

const cartItemSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { _id: false }
);

const cartSchema = new Schema<ICartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    items: {
      type: [cartItemSchema],
      default: []
    }
  },
  { timestamps: true }
);

export const CartModel = mongoose.model<ICartDocument>("Cart", cartSchema);