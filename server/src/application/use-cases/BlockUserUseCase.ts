import { AuditLog } from "../../domain/entities/AuditLog.js";
import { CannotBlockAdminError } from "../../domain/errors/AdminErrors.js";
import { UserNotFoundError } from "../../domain/errors/AuthErrors.js";
import { IAuditLogRepository } from "../ports/IAuditLogRepository.js";
import { IFirebaseAdminService } from "../ports/IFirebaseAdminService.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class BlockUserUseCase {
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

    if (user.getRole() === "admin") {
      throw new CannotBlockAdminError();
    }

    // Block in Firebase
    await this.firebaseAdminService.updateUser(firebaseUid, { disabled: true });

    // Block in MongoDB
    await this.userRepository.blockUser(firebaseUid);

    // Create audit log
    const auditLog = new AuditLog(
      '',
      "BLOCK_USER",
      user.id.toString(),
      adminId
    );
    await this.auditLogRepository.save(auditLog);

    return {
      success: true,
      message: "User blocked successfully"
    };
  }
}