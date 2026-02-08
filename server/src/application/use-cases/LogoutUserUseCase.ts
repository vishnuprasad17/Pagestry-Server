import { IFirebaseAuthService } from "../ports/IFirebaseAuthService.js";

export class LogoutUserUseCase {
  constructor(
    private readonly firebaseAuthService: IFirebaseAuthService
  ) {}

  async execute(sessionCookie?: string): Promise<void> {
    if (!sessionCookie) {
      return;
    }

    try {
      const decoded = await this.firebaseAuthService.verifySessionCookie(sessionCookie);
      await this.firebaseAuthService.revokeRefreshTokens(decoded.uid);
    } catch (error) {
      console.error('Failed to revoke refresh tokens:', error);
    }
  }
}