import { Book } from "../../domain/entities/Book.js";
import { BookNotFoundError } from "../../domain/errors/CartErrors.js";
import { UpdateBookDto } from "../dto/BookDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";
import { IImageStorageService } from "../ports/IImageStorageService.js";

export class UpdateBookUseCase {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly imageStorage: IImageStorageService
  ) {}

  async execute(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    
    if (!book) {
      throw new BookNotFoundError(id);
    }

    // Handle image replacement
    if (dto.coverImage && dto.coverImage !== book.coverImage) {
      try {
        await this.imageStorage.delete(book.coverImage);
      } catch (error) {
        console.error('Failed to delete old image:', error);
      }
    }

    book.updateDetails({
      title: dto.title,
      description: dto.description,
      categoryId: dto.categoryId,
      coverImage: dto.coverImage,
      mrp: dto.mrp,
      sellingPrice: dto.sellingPrice,
      stock: dto.stock,
      featured: dto.featured
    });

    await this.bookRepository.save(book);
    return book;
  }
}