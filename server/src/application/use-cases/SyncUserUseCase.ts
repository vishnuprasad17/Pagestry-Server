import { User } from "../../domain/entities/User.js";
import { FirebaseUserDisabledError, UserBlockedError } from "../../domain/errors/AuthErrors.js";
import { AuthProvider } from "../../domain/value-objects/AuthProvider.js";
import { SyncUserDto, SyncUserResultDto } from "../dto/AuthDto.js";
import { IFirebaseAuthService } from "../ports/IFirebaseAuthService.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class SyncUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly firebaseAuthService: IFirebaseAuthService
  ) {}

  async execute(dto: SyncUserDto): Promise<SyncUserResultDto> {
    const { firebaseUid, email, name } = dto;

    // Verify Firebase user status
    const firebaseUser = await this.firebaseAuthService.getUser(firebaseUid);

    if (firebaseUser.disabled) {
      throw new FirebaseUserDisabledError();
    }

    // Find or create user
    let user = await this.userRepository.findByFirebaseUid(firebaseUid);

    if (!user) {
      const providerId = firebaseUser.providerData[0]?.providerId || "password";
      
      user = User.create({
        username: email,
        name: name || firebaseUser.displayName || "No Name",
        role: "user",
        authProvider: providerId as AuthProvider,
        isBlocked: false,
        firebaseUid: firebaseUid
      });

      await this.userRepository.save(user);
    }

    // Check if user is blocked
    if (user.isUserBlocked()) {
      throw new UserBlockedError();
    }

    return {
      mongoUserId: user.id,
      username: user.getUsername(),
      name: user.getName(),
      profileImage: user.getProfileImage()
    };
  }
}