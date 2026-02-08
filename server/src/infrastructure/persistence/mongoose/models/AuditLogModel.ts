import mongoose, { Schema, Document } from "mongoose";

interface IAuditLogDocument extends Document {
  action: "BLOCK_USER" | "UNBLOCK_USER";
  targetUser: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: {
      type: String,
      enum: ["BLOCK_USER", "UNBLOCK_USER"],
      required: true
    },
    targetUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ targetUser: 1 });
auditLogSchema.index({ performedBy: 1 });

export const AuditLogModel = mongoose.model<IAuditLogDocument>("AuditLog", auditLogSchema);