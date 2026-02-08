import { IEmailService } from "../ports/IEmailService.js";
import { IFirebaseAdminService } from "../ports/IFirebaseAdminService.js";

export class SendPasswordResetLinkUseCase {
  constructor(
    private readonly firebaseAdminService: IFirebaseAdminService,
    private readonly emailService: IEmailService
  ) {}

  async execute(email: string): Promise<{ success: boolean; message: string }> {
    const resetLink = await this.firebaseAdminService.generatePasswordResetLink(email);

    let userName: string | undefined;
    try {
      const userRecord = await this.firebaseAdminService.getUserByEmail(email);
      userName = userRecord.displayName;
    } catch (err) {
      console.warn('Could not fetch user info:', err);
    }

    await this.emailService.sendPasswordResetEmail(email, resetLink, userName);

    return {
      success: true,
      message: "Reset link sent successfully"
    };
  }
}