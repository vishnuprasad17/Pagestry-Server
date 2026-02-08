import { Request, Response } from "express";
import { SyncUserUseCase } from "../../application/use-cases/SyncUserUseCase.js";
import { CreateSessionCookieUseCase } from "../../application/use-cases/CreateSessionCookieUseCase.js";
import { AdminLoginUseCase } from "../../application/use-cases/AdminLoginUseCase.js";
import { LogoutUserUseCase } from "../../application/use-cases/LogoutUserUseCase.js";
import { IFirebaseAuthService } from "../../application/ports/IFirebaseAuthService.js";

export class AuthController {
  constructor(
    private readonly syncUserUseCase: SyncUserUseCase,
    private readonly createSessionCookieUseCase: CreateSessionCookieUseCase,
    private readonly adminLoginUseCase: AdminLoginUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
    private readonly firebaseAuthService: IFirebaseAuthService
  ) {}

  async syncUser(req: Request, res: Response): Promise<void> {
    const token = req.headers.authorization?.split("Bearer ")[1];
    
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    // Verify Firebase token
    const decoded = await this.firebaseAuthService.verifyIdToken(token);

    // Sync user
    const userData = await this.syncUserUseCase.execute({
      firebaseUid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name
    });

    // Create session cookie
    const { sessionCookie, expiresIn } = await this.createSessionCookieUseCase.execute(token);

    res.cookie("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn
    });

    res.status(200).json({
      success: true,
      data: userData,
      message: "User synced successfully"
    });
  }

  async adminLogin(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    const result = await this.adminLoginUseCase.execute({ username, password });

    res.cookie("admin_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.status(200).json({
      success: true,
      data: result.user,
      message: "Admin logged in successfully"
    });
  }

  async logout(req: Request, res: Response): Promise<void> {
    const role = req.user?.role as string;

    if (role === "admin") {
      res.clearCookie("admin_token");
      res.status(200).json({
        success: true,
        data: {},
        message: "Admin logged out successfully"
      });
      return;
    }

    // User logout
    const sessionCookie = req.cookies?.session;
    
    try {
      await this.logoutUserUseCase.execute(sessionCookie);
    } catch (error) {
      // Ignore errors during logout
      console.error('Logout error:', error);
    }

    res.clearCookie("session");
    res.status(200).json({
      success: true,
      data: {},
      message: "Logged out successfully"
    });
  }
}