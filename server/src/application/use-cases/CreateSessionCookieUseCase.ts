import { SessionCookieDto } from "../dto/AuthDto.js";
import { IFirebaseAuthService } from "../ports/IFirebaseAuthService.js";

export class CreateSessionCookieUseCase {
  constructor(
    private readonly firebaseAuthService: IFirebaseAuthService
  ) {}

  async execute(idToken: string): Promise<SessionCookieDto> {
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days
    const sessionCookie = await this.firebaseAuthService.createSessionCookie(
      idToken,
      expiresIn
    );

    return {
      sessionCookie,
      expiresIn
    };
  }
}