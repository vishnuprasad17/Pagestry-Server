import { Book } from "../../domain/entities/Book.js";
import { UserNotFoundError } from "../../domain/errors/AuthErrors.js";
import { WishlistItemDto } from "../dto/UserDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";
import { IUserRepository } from "../ports/IUserRepository.js";

export class GetWishlistUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async execute(userId: string): Promise<WishlistItemDto[]> {
    // Verify user exists
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    // Get wishlist
    const bookIds = await this.userRepository.getWishlist(userId);
    const wishlist = await this.bookRepository.findByIds(bookIds);

    return wishlist.map(this.mapToResponseDto);
  }

  private mapToResponseDto(book: Book): WishlistItemDto {
    return {
      id: book.id,
      title: book.title,
      coverImage: book.coverImage,
      sellingPrice: book.sellingPrice,
      mrp: book.mrp,
      stock: book.stock
    }
  }
}