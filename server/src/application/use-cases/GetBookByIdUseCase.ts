import { Author } from "../../domain/entities/Author.js";
import { Category } from "../../domain/entities/Category.js";
import { BookNotFoundError } from "../../domain/errors/CartErrors.js";
import { BookResponseDto } from "../dto/BookDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class GetBookByIdUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(id: string): Promise<BookResponseDto> {
    const book = await this.bookRepository.findById(id);
    
    if (!book) {
      throw new BookNotFoundError(id);
    }

    return {
      id: book.id,
      title: book.title,
      author: { id: (book.authorId as Author).id, name: (book.authorId as Author).getName() },
      category: { id: (book.categoryId as Category).id, name: (book.categoryId as Category).getName() },
      description: book.description,
      ISBN: book.ISBN,
      coverImage: book.coverImage,
      mrp: book.mrp,
      sellingPrice: book.sellingPrice,
      stock: book.stock,
      featured: book.featured,
      averageRating: book.getAverageRating(),
      ratingCount: book.getRatingCount(),
      ratingBreakdown: book.getRatingBreakdown(),
      discountPercentage: book.getDiscountPercentage(),
      createdAt: book.createdAt
    };
  }
}