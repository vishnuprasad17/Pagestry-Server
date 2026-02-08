import { ReviewResponseDto } from "../dto/ReviewDto.js";
import { IReviewRepository } from "../ports/IReviewRepository.js";

export class GetUserReviewForBookUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(userId: string, bookId: string): Promise<ReviewResponseDto | null> {
    const review = await this.reviewRepository.findByUserAndBook(userId, bookId);

    if (!review) {
      return null;
    }

    return {
      id: review.id,
      userId: review.userId as string,
      bookId: review.bookId,
      title: review.getTitle(),
      content: review.getContent(),
      rating: review.getRating(),
      likes: review.getLikesCount(),
      dislikes: review.getDislikesCount(),
      hasUserLiked: review.hasUserLiked(userId),
      hasUserDisliked: review.hasUserDisliked(userId),
      createdAt: review.createdAt
    };
  }
}