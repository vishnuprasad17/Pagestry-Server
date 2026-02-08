import { Review } from "../../domain/entities/Review.js";
import { ReviewNotFoundError } from "../../domain/errors/ReviewErrors.js";
import { IReviewRepository } from "../ports/IReviewRepository.js";

export class LikeReviewUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(userId: string, reviewId: string): Promise<Review> {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new ReviewNotFoundError(reviewId);
    }

    review.like(userId);
    await this.reviewRepository.save(review);

    return review;
  }
}