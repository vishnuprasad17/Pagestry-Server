import { InvalidCredentialsError } from "../../domain/errors/AuthErrors.js";
import { AdminLoginDto, AdminLoginResultDto } from "../dto/AuthDto.js";
import { IJwtService } from "../ports/IJwtService.js";
import { IPasswordService } from "../ports/IPasswordService.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class AdminLoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly jwtService: IJwtService
  ) {}

  async execute(dto: AdminLoginDto): Promise<AdminLoginResultDto> {
    const { username, password } = dto;

    // Find admin user
    const admin = await this.userRepository.findAdminByUsername(username);

    if (!admin) {
      throw new InvalidCredentialsError();
    }

    // Verify password
    const passwordHash = admin.getPasswordHash();
    if (!passwordHash) {
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await this.passwordService.compare(password, passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate JWT token
    const token = this.jwtService.sign(
      {
        id: admin.id,
        username: admin.getUsername(),
        role: admin.getRole()
      },
      "1h"
    );

    return {
      token,
      user: {
        id: admin.id,
        username: admin.getUsername(),
        role: admin.getRole()
      }
    };
  }
}