import { Category } from "../../domain/entities/Category.js";
import { BookListItemDto } from "../dto/BookDto.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class SearchBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(query: string): Promise<BookListItemDto[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    const books = await this.bookRepository.search(query, 7);
    
    return books.map(book => ({
      id: book.id,
      title: book.title,
      category: { id: (book.categoryId as Category).id, name: (book.categoryId as Category).getName() },
      coverImage: book.coverImage
    }));
  }
}