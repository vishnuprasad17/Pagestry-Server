import { Review } from "../../domain/entities/Review.js";
import { ReviewNotFoundError, UnauthorizedReviewAccessError } from "../../domain/errors/ReviewErrors.js";
import { UpdateReviewDto } from "../dto/ReviewDto.js";
import { IReviewUnitOfWork } from "../ports/IUnitOfWork.js";

export class UpdateReviewUseCase {
  constructor(private readonly unitOfWork: IReviewUnitOfWork) {}

  async execute(reviewId: string, uid: string, dto: UpdateReviewDto): Promise<Review> {
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

      // Verify ownership
      if (!review.isOwnedBy(userId)) {
        throw new UnauthorizedReviewAccessError();
      }

      // Update review and get old/new ratings
      const { oldRating, newRating } = review.updateDetails(dto);

      // Save review and update book rating if rating changed
      await reviewRepo.save(review);

      if (oldRating !== newRating) {
        await bookRepo.updateRating(review.bookId, oldRating, newRating);
      }

      await this.unitOfWork.commit();
      return review;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}