import { DomainError } from "./DomainError.js";

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User not found: ${userId}`, 404);
    this.name = 'UserNotFoundError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor() {
    super("Unauthorized", 401);
    this.name = 'UnauthorizedError';
  }
}

export class BookNotFoundError extends DomainError {
  constructor(bookId: string) {
    super(`Book not found: ${bookId}`, 404);
    this.name = 'BookNotFoundError';
  }
}

export class WishlistOperationError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'WishlistOperationError';
  }
}

export class InvalidUserDataError extends DomainError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'InvalidUserDataError';
  }
}

export class AdminBlockAttemptError extends DomainError {
  constructor() {
    super("Admin users cannot be blocked", 400);
    this.name = 'AdminBlockAttemptError';
  }
}