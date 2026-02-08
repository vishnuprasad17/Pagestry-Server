import { Review } from "../../domain/entities/Review.js";
import { User } from "../../domain/entities/User.js";
import { ReviewPagination } from "../../domain/value-objects/ReviewPagination.js";
import { PaginatedReviewsDto, ReviewResponseDto } from "../dto/ReviewDto.js";
import { IReviewRepository } from "../ports/IReviewRepository.js";

export class GetBookReviewsUseCase {
  constructor(private readonly reviewRepository: IReviewRepository) {}

  async execute(bookId: string, page: number, currentUserId?: string): Promise<PaginatedReviewsDto> {
    const pagination = new ReviewPagination(page);
    
    const [reviews, total] = await Promise.all([
      this.reviewRepository.findByBookId(
        bookId,
        pagination.getSkip(),
        pagination.getLimit()
      ),
      this.reviewRepository.countByBookId(bookId)
    ]);

    return {
      reviews: reviews.map(review => this.mapToResponseDto(review, currentUserId)),
      total,
      totalPages: pagination.calculateTotalPages(total),
      currentPage: page
    };
  }

  private mapToResponseDto(review: Review, currentUserId?: string): ReviewResponseDto {
    return {
      id: review.id,
      userId: (review.userId as User).id,
      userName: (review.userId as User).getName(),
      bookId: review.bookId,
      title: review.getTitle(),
      content: review.getContent(),
      rating: review.getRating(),
      likes: review.getLikesCount(),
      dislikes: review.getDislikesCount(),
      hasUserLiked: currentUserId ? review.hasUserLiked(currentUserId) : undefined,
      hasUserDisliked: currentUserId ? review.hasUserDisliked(currentUserId) : undefined,
      createdAt: review.createdAt
    };
  }
}