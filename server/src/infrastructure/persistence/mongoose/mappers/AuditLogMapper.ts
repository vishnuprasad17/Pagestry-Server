import mongoose from "mongoose";
import { AuditLog } from "../../../../domain/entities/AuditLog.js";
import { AuditLogResponseDto } from "../../../../application/dto/AdminDto.js";

export class AuditLogMapper {
  static toDomain(document: any): AuditLogResponseDto {
    return {
      id: document._id.toString(),
      action: document.action,
      createdAt: document.createdAt,
      user: {
        id: document.user._id.toString(),
        username: document.user.username,
        name: document.user.name,
        role: document.user.role,
        isBlocked: document.user.isBlocked
      },
      admin: {
        id: document.admin._id.toString(),
        username: document.admin.username,
        name: document.admin.name,
        role: document.admin.role,
        isBlocked: document.admin.isBlocked
      }
    };
  }

  static toPersistence(auditLog: AuditLog): any {
    return {
      action: auditLog.action,
      targetUser: new mongoose.Types.ObjectId(auditLog.targetUserId),
      performedBy: new mongoose.Types.ObjectId(auditLog.performedById)
    };
  }
}