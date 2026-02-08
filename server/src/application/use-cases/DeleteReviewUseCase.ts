import { ReviewNotFoundError, UnauthorizedReviewAccessError } from "../../domain/errors/ReviewErrors.js";
import { IReviewUnitOfWork } from "../ports/IUnitOfWork.js";

export class DeleteReviewUseCase {
  constructor(private readonly unitOfWork: IReviewUnitOfWork) {}

  async execute(reviewId: string, uid: string): Promise<void> {
    await this.unitOfWork.begin();

    try {
      const userRepo = this.unitOfWork.getUserRepository();
      const reviewRepo = this.unitOfWork.getReviewRepository();
      const bookRepo = this.unitOfWork.getBookRepository();

      const user = await userRepo.findByFirebaseUid(uid);
      
      if (!user) {
        throw new UnauthorizedReviewAccessError();
      }

      const review = await reviewRepo.findById(reviewId);

      if (!review) {
        throw new ReviewNotFoundError(reviewId);
      }

      const userId = user.id;

      // Verify ownership if userId provided
      if (userId && !review.isOwnedBy(userId)) {
        throw new UnauthorizedReviewAccessError();
      }

      // Delete review and update book rating
      await reviewRepo.delete(reviewId);
      await bookRepo.removeRating(review.bookId, review.getRating());

      await this.unitOfWork.commit();
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}