import { BookNotFoundError } from "../../domain/errors/CartErrors.js";
import { IUnitOfWork } from "../ports/IUnitOfWork.js";

export class AddRatingUseCase {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(bookId: string, rating: number): Promise<void> {
    await this.unitOfWork.begin();

    try {
      const bookRepo = this.unitOfWork.getBookRepository();
      const book = await bookRepo.findById(bookId);

      if (!book) {
        throw new BookNotFoundError(bookId);
      }

      book.addRating(rating);
      await bookRepo.save(book);
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}