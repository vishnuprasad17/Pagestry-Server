import { BookNotFoundError } from "../../domain/errors/CartErrors.js";
import { IUnitOfWork } from "../ports/IUnitOfWork.js";

export class UpdateRatingUseCase {
  constructor(private readonly unitOfWork: IUnitOfWork) {}

  async execute(bookId: string, oldRating: number, newRating: number): Promise<void> {
    await this.unitOfWork.begin();

    try {
      const bookRepo = this.unitOfWork.getBookRepository();
      const book = await bookRepo.findById(bookId);

      if (!book) {
        throw new BookNotFoundError(bookId);
      }

      book.updateRating(oldRating, newRating);
      await bookRepo.save(book);
      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}