import { User } from "../../domain/entities/User.js";
import { UserNotFoundError } from "../../domain/errors/UserErrors.js";
import { UpdateUserDto } from "../dto/UserDto.js";
import { IUserRepository } from "../ports/IUserRepository.js";
import { IImageStorageService } from "../ports/IImageStorageService.js";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly imageStorage: IImageStorageService
  ) {}

  async execute(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Handle image replacement
    if (dto.profileImage && dto.profileImage !== user.getProfileImage()) {
      const oldImage = user.getProfileImage();
      if (oldImage) {
        try {
          await this.imageStorage.delete(oldImage);
        } catch (error) {
          console.error('Failed to delete old image:', error);
        }
      }
    }

    user.updateName(dto.name);
    user.updateProfileImage(dto.profileImage);

    await this.userRepository.save(user);
    return user;
  }
}