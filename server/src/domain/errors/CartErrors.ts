import { DomainError } from "./DomainError.js";

export class CartNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`Cart not found for user: ${userId}`, 404);
    this.name = 'CartNotFoundError';
  }
}

export class BookNotFoundError extends DomainError {
  constructor(bookId: string) {
    super(`Book not found: ${bookId}`, 404);
    this.name = 'BookNotFoundError';
  }
}

export class InsufficientStockError extends DomainError {
  constructor(bookId: string, requested: number, available: number) {
    super(`Insufficient stock for book ${bookId}. Requested: ${requested}, Available: ${available}`, 400);
    this.name = 'InsufficientStockError';
  }
}

export class CartItemStockExceededError extends DomainError {
  constructor(maxStock: number, requested: number) {
    super(`Requested quantity exceeds maximum stock. Requested: ${requested}, Maximum: ${maxStock}`, 400);
    this.name = 'CartItemStockExceededError';
  }
}

export class InvalidCartItemDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidCartItemDataError';
  }
}