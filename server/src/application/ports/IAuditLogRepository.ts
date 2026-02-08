import { AuditLog } from "../../domain/entities/AuditLog.js";
import { AuditLogResponseDto } from "../dto/AdminDto.js";

export interface IAuditLogRepository {
  save(auditLog: AuditLog): Promise<AuditLog>;
  findFiltered(page: number, limit: number, filter?: string, search?: string): Promise<{ logs: AuditLogResponseDto[], total: number }>;
}