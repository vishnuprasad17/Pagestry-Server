import { Author } from "../../domain/entities/Author.js";
import { Book } from "../../domain/entities/Book.js";
import { Category } from "../../domain/entities/Category.js";
import { BookFilters } from "../../domain/value-objects/BookFilters.js";
import { BookResponseDto, PaginatedBooksDto } from "../dto/BookDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class GetFilteredBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(
    page: number,
    limit: number,
    categoryId?: string,
    sortBy?: string,
    searchQuery?: string
  ): Promise<PaginatedBooksDto> {
    const filters = new BookFilters(
      page,
      limit,
      categoryId,
      sortBy as any,
      searchQuery
    );

    const { books, total } = await this.bookRepository.findFiltered(filters);

    return {
      books: books.map(this.mapToResponseDto),
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalBooks: total
    };
  }

  private mapToResponseDto(book: Book): BookResponseDto {
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
      discountPercentage: book.getDiscountPercentage()
    };
  }
}