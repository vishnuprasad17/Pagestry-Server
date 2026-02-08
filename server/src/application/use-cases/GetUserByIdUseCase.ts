import { UnauthorizedError } from "../../domain/errors/UserErrors.js";
import { UserResponseDto } from "../dto/UserDto.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(uid: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByFirebaseUid(uid);

    if (!user) {
      throw new UnauthorizedError();
    }

    return {
      id: user.id,
      name: user.getName(),
      username: user.getUsername(),
      authProvider: user.getAuthProvider(),
      profileImage: user.getProfileImage()
    };
  }
}