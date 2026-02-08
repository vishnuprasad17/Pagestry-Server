import { Review } from "../../domain/entities/Review.js";
import { DuplicateReviewError } from "../../domain/errors/ReviewErrors.js";
import { CreateReviewDto } from "../dto/ReviewDto.js";
import { IReviewUnitOfWork } from "../ports/IUnitOfWork.js";

export class CreateReviewUseCase {
  constructor(private readonly unitOfWork: IReviewUnitOfWork) {}

  async execute(dto: CreateReviewDto): Promise<Review> {
    await this.unitOfWork.begin();

    try {
      const reviewRepo = this.unitOfWork.getReviewRepository();
      const bookRepo = this.unitOfWork.getBookRepository();

      // Check for duplicate review
      const existingReview = await reviewRepo.findByUserAndBook(
        dto.userId,
        dto.bookId
      );

      if (existingReview) {
        throw new DuplicateReviewError(dto.userId, dto.bookId);
      }

      // Create review
      const review = Review.create({
        userId: dto.userId,
        bookId: dto.bookId,
        title: dto.title,
        content: dto.content,
        rating: dto.rating
      });

      // Save review and update book rating
      await reviewRepo.save(review);
      await bookRepo.addRating(dto.bookId, dto.rating);

      await this.unitOfWork.commit();
      return review;
    } catch (error) {
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}