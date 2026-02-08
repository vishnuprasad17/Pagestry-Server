import { IFirebaseAuthService } from "../../application/ports/IFirebaseAuthService.js";
import { IJwtService } from "../../application/ports/IJwtService.js";
import { IPasswordService } from "../../application/ports/IPasswordService.js";
import { IUserRepository } from "../../application/ports/IUserRepository.js";
import { AdminLoginUseCase } from "../../application/use-cases/AdminLoginUseCase.js";
import { CreateSessionCookieUseCase } from "../../application/use-cases/CreateSessionCookieUseCase.js";
import { LogoutUserUseCase } from "../../application/use-cases/LogoutUserUseCase.js";
import { SyncUserUseCase } from "../../application/use-cases/SyncUserUseCase.js";
import { AuthController } from "../../interface-adapters/controllers/AuthController.js";
import { BcryptPasswordService } from "../services/auth/BcryptPasswordService.js";
import { FirebaseAuthService } from "../services/auth/FirebaseAuthService.js";
import { JwtService } from "../services/JwtService.js";
import { UserModel } from "../persistence/mongoose/models/UserModel.js";
import { MongoUserRepository } from "../persistence/mongoose/repositories/MongoUserRepository.js";

import dotenv from "dotenv";
dotenv.config();

export class AuthModule {
  private static userRepository: IUserRepository;
  private static firebaseAuthService: IFirebaseAuthService;
  private static passwordService: IPasswordService;
  private static jwtService: IJwtService;

  static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new MongoUserRepository(UserModel);
    }
    return this.userRepository;
  }

  static getFirebaseAuthService(): IFirebaseAuthService {
    if (!this.firebaseAuthService) {
      this.firebaseAuthService = new FirebaseAuthService();
    }
    return this.firebaseAuthService;
  }

  static getPasswordService(): IPasswordService {
    if (!this.passwordService) {
      this.passwordService = new BcryptPasswordService();
    }
    return this.passwordService;
  }

  static getJwtService(): IJwtService {
    if (!this.jwtService) {
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET environment variable is not set");
      }
      this.jwtService = new JwtService(secret);
    }
    return this.jwtService;
  }

  static getSyncUserUseCase(): SyncUserUseCase {
    return new SyncUserUseCase(
      this.getUserRepository(),
      this.getFirebaseAuthService()
    );
  }

  static getCreateSessionCookieUseCase(): CreateSessionCookieUseCase {
    return new CreateSessionCookieUseCase(this.getFirebaseAuthService());
  }

  static getAdminLoginUseCase(): AdminLoginUseCase {
    return new AdminLoginUseCase(
      this.getUserRepository(),
      this.getPasswordService(),
      this.getJwtService()
    );
  }

  static getLogoutUserUseCase(): LogoutUserUseCase {
    return new LogoutUserUseCase(this.getFirebaseAuthService());
  }

  static getAuthController(): AuthController {
    return new AuthController(
      this.getSyncUserUseCase(),
      this.getCreateSessionCookieUseCase(),
      this.getAdminLoginUseCase(),
      this.getLogoutUserUseCase(),
      this.getFirebaseAuthService()
    );
  }
}