import { Review } from "../../domain/entities/Review.js";

export interface IReviewRepository {
  findById(reviewId: string): Promise<Review | null>;
  findByBookId(bookId: string, skip: number, limit: number): Promise<Review[]>;
  findByUserAndBook(userId: string, bookId: string): Promise<Review | null>;
  countByBookId(bookId: string): Promise<number>;
  save(review: Review): Promise<Review>;
  delete(reviewId: string): Promise<void>;
}