import { Author } from "../../domain/entities/Author.js";
import { Book } from "../../domain/entities/Book.js";
import { Category } from "../../domain/entities/Category.js";
import { AuthorNotFoundError } from "../../domain/errors/AuthorErrors.js";
import { AuthorDetailsDto } from "../dto/AuthorDto.js";
import { AuthorBookDetailDto } from "../dto/BookDto.js";
import { IAuthorRepository } from "../ports/IAuthorRepository.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class GetAuthorDetailsUseCase {
  constructor(
    private readonly authorRepository: IAuthorRepository,
    private readonly bookRepository: IBookRepository
  ) {}

  async execute(id: string): Promise<AuthorDetailsDto> {
    const author = await this.authorRepository.findById(id);

    if (!author) {
      throw new AuthorNotFoundError(id);
    }

    const books = await this.bookRepository.findByAuthorId(id);

    return {
      author: {
        id: author.id,
        name: author.getName(),
        bio: author.getBio(),
        profileImage: author.getProfileImage(),
        website: author.getWebsite(),
        isFeatured: author.isFeaturedAuthor(),
        createdAt: author.createdAt
      },
      books: books.map(this.mapToResponseDto)
    };
  }

  private mapToResponseDto(book: Book): AuthorBookDetailDto {
        return {
        id: book.id,
        title: book.title,
        category: { id: (book.categoryId as Category).id, name: (book.categoryId as Category).getName() },
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