import { UserNotFoundError } from "../../domain/errors/AuthErrors.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class RemoveFromWishlistUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string, bookId: string): Promise<void> {
    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    // Remove from wishlist
    await this.userRepository.removeFromWishlist(userId, bookId);
  }
}