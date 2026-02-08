import { Book } from "../../domain/entities/Book.js";
import { InvalidISBNError } from "../../domain/errors/BookErrors.js";
import { CreateBookDto } from "../dto/BookDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class CreateBookUseCase {
  constructor(
    private readonly bookRepository: IBookRepository
  ) {}

  async execute(dto: CreateBookDto): Promise<Book> {
    // Check for duplicate ISBN
    const existingBook = await this.bookRepository.findByISBN(dto.ISBN);
    if (existingBook) {
      throw new InvalidISBNError(dto.ISBN);
    }

    const book = Book.create({
      title: dto.title.trim(),
      authorId: dto.authorId,
      description: dto.description,
      categoryId: dto.categoryId,
      ISBN: dto.ISBN.trim(),
      coverImage: dto.coverImage,
      mrp: dto.mrp,
      sellingPrice: dto.sellingPrice,
      stock: dto.stock || 0,
      featured: dto.featured || false
    });

    await this.bookRepository.save(book);
    return book;
  }
}