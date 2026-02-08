import { Book } from "../../domain/entities/Book.js";
import { BookFilters } from "../../domain/value-objects/BookFilters.js";

export interface IBookRepository {
  findById(id: string): Promise<Book | null>;
  findByIds(ids: string[]): Promise<Book[]>;
  findByISBN(isbn: string): Promise<Book | null>;
  findByAuthorId(authorId: string): Promise<Book[]>;
  findAll(): Promise<Book[]>;
  findFiltered(filters: BookFilters): Promise<{ books: Book[], total: number }>;
  findFeatured(): Promise<Book[]>;
  findByAuthor(authorId: string): Promise<Book[]>;
  search(query: string, limit?: number): Promise<Book[]>;
  save(book: Book): Promise<Book>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  countFeatured(): Promise<number>;
  checkStock(bookId: string, quantity: number): Promise<boolean>;
  reduceStock(bookId: string, quantity: number): Promise<void>;
  increaseStock(bookId: string, quantity: number): Promise<void>;
  getBookDetails(bookId: string): Promise<{ id: string; title: string; stock: number; category: string; coverImage: string } | null>;
  addRating(bookId: string, rating: number): Promise<void>;
  updateRating(bookId: string, oldRating: number, newRating: number): Promise<void>;
  removeRating(bookId: string, rating: number): Promise<void>;
  getTotalBooks(): Promise<number>;
}