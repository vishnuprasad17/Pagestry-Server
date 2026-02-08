import { AuditAction } from "../value-objects/AuditAction.js";

export class AuditLog {
  constructor(
    public readonly id: string,
    public readonly action: AuditAction,
    public readonly targetUserId: string,
    public readonly performedById: string,
    public readonly createdAt: Date = new Date()
  ) {}

  getActionDescription(): string {
    switch (this.action) {
      case "BLOCK_USER":
        return "User blocked";
      case "UNBLOCK_USER":
        return "User unblocked";
      default:
        return "Unknown action";
    }
  }
}