import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrderItem {
  bookId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  title?: string;
  category?: string;
  coverImage?: string;
}

export interface IPaymentDetails {
  method: "RAZORPAY" | "COD";
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  transactionId?: string;
  paidAt?: Date;
  amount: number;
  currency: string;
  failureReason?: string;
}

export interface IOrderDocument extends Document {
  orderId: string;
  userId: Types.ObjectId;
  email: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  totalPrice: number;
  status: "PENDING" | "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "FAILED";
  paymentDetails: IPaymentDetails;
  deliveryDetails: {
    partner: string;
    trackingId: string;
    estimatedDeliveryDate: Date;
    deliveredAt?: Date;
  } | null;
  idempotencyKey: string;
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrderDocument>(
  { 
    orderId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String },
      landmark: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    items: [
      {
        bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        title: { type: String },
        category: { type: String },
        coverImage: { type: String }
      }
    ],
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED", "FAILED"],
      default: "PENDING",
      index: true
    },
    paymentDetails: {
      method: { 
        type: String, 
        enum: ["RAZORPAY", "COD"], 
        required: true 
      },
      status: { 
        type: String, 
        enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"], 
        default: "PENDING",
        index: true
      },
      razorpayOrderId: { type: String, index: true },
      razorpayPaymentId: { type: String, index: true },
      razorpaySignature: { type: String },
      transactionId: { type: String },
      paidAt: { type: Date },
      amount: { type: Number, required: true },
      currency: { type: String, default: "INR" },
      failureReason: { type: String }
    },
    deliveryDetails: {
      type: {
        partner: { type: String },
        trackingId: { type: String },
        estimatedDeliveryDate: { type: Date },
        deliveredAt: { type: Date }
      },
      default: null
    },
    idempotencyKey: { type: String, unique: true, required: true, index: true },
    cancellationReason: { type: String },
    cancelledAt: { type: Date }
  },
  { timestamps: true }
);

// Compound indexes for common queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ "paymentDetails.status": 1, createdAt: -1 });

export const OrderModel = mongoose.model<IOrderDocument>('Order', orderSchema);