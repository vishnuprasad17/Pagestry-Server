import mongoose, { Document, Schema, Types } from "mongoose";

export interface IAddressDocument extends Document {
  userId: Types.ObjectId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddressDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, required: false },
    landmark: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
    isDefault: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

addressSchema.index({ userId: 1 }, { unique: true, partialFilterExpression: { isDefault: true } });

export const AddressModel = mongoose.model<IAddressDocument>("Address", addressSchema);