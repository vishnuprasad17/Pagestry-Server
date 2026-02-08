import { Book } from "../../domain/entities/Book.js";
import { IBookRepository } from "../ports/IBookRepository.js";

export class GetAllBooksUseCase {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(): Promise<Book[]> {
    return await this.bookRepository.findAll();
  }
}