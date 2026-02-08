import { AuditLog } from "../../domain/entities/AuditLog.js";
import { UserNotFoundError } from "../../domain/errors/AuthErrors.js";
import { IAuditLogRepository } from "../ports/IAuditLogRepository.js";
import { IFirebaseAdminService } from "../ports/IFirebaseAdminService.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class UnblockUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly firebaseAdminService: IFirebaseAdminService
  ) {}

  async execute(firebaseUid: string, adminId: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findByFirebaseUid(firebaseUid);
    
    if (!user || user.getRole() !== "user") {
      throw new UserNotFoundError(firebaseUid);
    }

    // Unblock in Firebase
    await this.firebaseAdminService.updateUser(firebaseUid, { disabled: false });

    // Unblock in MongoDB
    await this.userRepository.unblockUser(firebaseUid);

    // Create audit log
    const auditLog = new AuditLog(
      '',
      "UNBLOCK_USER",
      user.id.toString(),
      adminId
    );
    await this.auditLogRepository.save(auditLog);

    return {
      success: true,
      message: "User unblocked successfully"
    };
  }
}