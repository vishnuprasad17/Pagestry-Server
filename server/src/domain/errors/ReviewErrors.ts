import { DomainError } from "./DomainError.js";

export class ReviewNotFoundError extends DomainError {
  constructor(reviewId: string) {
    super(`Review not found: ${reviewId}`, 404);
    this.name = 'ReviewNotFoundError';
  }
}

export class DuplicateReviewError extends DomainError {
  constructor(userId: string, bookId: string) {
    super(`User ${userId} has already reviewed book ${bookId}`, 400);
    this.name = 'DuplicateReviewError';
  }
}

export class InvalidRatingError extends DomainError {
  constructor(rating: number) {
    super(`Invalid rating: ${rating}. Rating must be between 1 and 5`, 400);
    this.name = 'InvalidRatingError';
  }
}

export class UnauthorizedReviewAccessError extends DomainError {
  constructor() {
    super("You are not authorized to modify this review", 403);
    this.name = 'UnauthorizedReviewAccessError';
  }
}

export class InvalidReviewDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidReviewDataError';
  }
}