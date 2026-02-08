import { Author } from "../../domain/entities/Author.js";
import { Book } from "../../domain/entities/Book.js";
import { FeaturedBookResponseDto } from "../dto/BookDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class GetFeaturedBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(): Promise<FeaturedBookResponseDto[]> {
    const featuredBooks = await this.bookRepository.findFeatured();

    return featuredBooks.map(this.mapToResponseDto);
  }

  private mapToResponseDto(book: Book): FeaturedBookResponseDto {
      return {
        id: book.id,
        title: book.title,
        author: (book.authorId as Author).getName(),
        coverImage: book.coverImage,
        mrp: book.mrp,
        sellingPrice: book.sellingPrice,
        stock: book.stock,
        averageRating: book.getAverageRating(),
        ratingCount: book.getRatingCount(),
        discountPercentage: book.getDiscountPercentage()
      };
    }
}