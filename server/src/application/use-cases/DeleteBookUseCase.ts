import { BookNotFoundError } from "../../domain/errors/CartErrors.js";
import { IBookRepository } from "../ports/IBookRepository.js";
import { IImageStorageService } from "../ports/IImageStorageService.js";

export class DeleteBookUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly imageStorage: IImageStorageService
  ) {}

  async execute(id: string): Promise<void> {
    const book = await this.bookRepository.findById(id);
    
    if (!book) {
      throw new BookNotFoundError(id);
    }

    // Delete cover image
    if (book.coverImage) {
      try {
        await this.imageStorage.delete(book.coverImage);
      } catch (error) {
        console.error('Failed to delete image:', error);
      }
    }

    await this.bookRepository.delete(id);
  }
}