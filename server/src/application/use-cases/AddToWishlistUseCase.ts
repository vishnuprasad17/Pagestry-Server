import { UserNotFoundError } from "../../domain/errors/AuthErrors.js";
import { BookNotFoundError } from "../../domain/errors/CartErrors.js";
import { IBookRepository } from "../ports/IBookRepository.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class AddToWishlistUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async execute(userId: string, bookId: string): Promise<void> {
    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    // Verify book exists
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BookNotFoundError(bookId);
    }

    // Add to wishlist
    await this.userRepository.addToWishlist(userId, bookId);
  }
}