import { DomainError } from "./DomainError.js";

export class BookNotFoundError extends DomainError {
  constructor(bookId: string) {
    super(`Book not found: ${bookId}`, 404);
    this.name = 'BookNotFoundError';
  }
}

export class InvalidPriceError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidPriceError';
  }
}

export class InsufficientStockError extends DomainError {
  constructor(bookId: string, requested: number, available: number) {
    super(`Insufficient stock for book ${bookId}. Requested: ${requested}, Available: ${available}`, 400);
    this.name = 'InsufficientStockError';
  }
}

export class InvalidISBNError extends DomainError {
  constructor(isbn: string) {
    super(`Invalid or duplicate ISBN: ${isbn}`, 400);
    this.name = 'InvalidISBNError';
  }
}

export class InvalidRatingError extends DomainError {
  constructor(rating: number) {
    super(`Invalid rating: ${rating}. Rating must be between 1 and 5`, 400);
    this.name = 'InvalidRatingError';
  }
}

export class InvalidBookDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidBookDataError';
  }
}